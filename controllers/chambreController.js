const Chambre = require("../models/Chambre");

exports.createChambre = async (req, res) => {
  try {
    const { 
      name, 
      descriptionCourte, 
      descriptionDetaillee, 
      description, // rétrocompatibilité
      reservable, 
      type, 
      capacite
    } = req.body;
    
    // Gérer l'image principale (peut être un tableau ou un seul fichier)
    let imagePrincipale = "";
    if (req.files && req.files.imagePrincipale) {
      const principaleFiles = Array.isArray(req.files.imagePrincipale) 
        ? req.files.imagePrincipale 
        : [req.files.imagePrincipale];
      if (principaleFiles.length > 0) {
        imagePrincipale = principaleFiles[0].path || principaleFiles[0].url || "";
      }
    }
    
    // Gérer les images supplémentaires
    let images = [];
    if (req.files && req.files.images) {
      const imagesFiles = Array.isArray(req.files.images) 
        ? req.files.images 
        : [req.files.images];
      images = imagesFiles.map(file => file.path || file.url || "").filter(Boolean);
    }

    // Parser les champs multilingues (peuvent être envoyés en JSON string ou objet)
    // Initialiser avec la structure complète par défaut
    let nameObj = { fr: "", ar: "", en: "" };
    let descriptionCourteObj = { fr: "", ar: "", en: "" };
    let descriptionDetailleeObj = { fr: "", ar: "", en: "" };

    if (name) {
      if (typeof name === 'string') {
        try {
          const parsed = JSON.parse(name);
          // S'assurer que la structure est complète
          nameObj = {
            fr: parsed.fr || "",
            ar: parsed.ar || "",
            en: parsed.en || ""
          };
        } catch {
          // Si ce n'est pas du JSON, utiliser comme valeur par défaut pour 'fr'
          nameObj = { fr: name, ar: "", en: "" };
        }
      } else if (typeof name === 'object' && name !== null) {
        // S'assurer que la structure est complète
        nameObj = {
          fr: name.fr || "",
          ar: name.ar || "",
          en: name.en || ""
        };
      }
    }

    if (descriptionCourte) {
      if (typeof descriptionCourte === 'string') {
        try {
          const parsed = JSON.parse(descriptionCourte);
          descriptionCourteObj = {
            fr: parsed.fr || "",
            ar: parsed.ar || "",
            en: parsed.en || ""
          };
        } catch {
          descriptionCourteObj = { fr: descriptionCourte, ar: "", en: "" };
        }
      } else if (typeof descriptionCourte === 'object' && descriptionCourte !== null) {
        descriptionCourteObj = {
          fr: descriptionCourte.fr || "",
          ar: descriptionCourte.ar || "",
          en: descriptionCourte.en || ""
        };
      }
    }

    if (descriptionDetaillee) {
      if (typeof descriptionDetaillee === 'string') {
        try {
          const parsed = JSON.parse(descriptionDetaillee);
          descriptionDetailleeObj = {
            fr: parsed.fr || "",
            ar: parsed.ar || "",
            en: parsed.en || ""
          };
        } catch {
          descriptionDetailleeObj = { fr: descriptionDetaillee, ar: "", en: "" };
        }
      } else if (typeof descriptionDetaillee === 'object' && descriptionDetaillee !== null) {
        descriptionDetailleeObj = {
          fr: descriptionDetaillee.fr || "",
          ar: descriptionDetaillee.ar || "",
          en: descriptionDetaillee.en || ""
        };
      }
    }

    // Validation: au moins le nom en français doit être fourni
    if (!nameObj.fr || nameObj.fr.trim() === "") {
      return res.status(400).json({ 
        message: "Le nom de la chambre en français (name.fr) est requis" 
      });
    }

    // Gérer la capacité de manière sécurisée
    let capaciteValue = 2;
    if (capacite !== undefined && capacite !== null && capacite !== "") {
      const parsedCapacite = parseInt(capacite);
      if (!isNaN(parsedCapacite) && parsedCapacite > 0) {
        capaciteValue = parsedCapacite;
      }
    }

    const chambre = new Chambre({
      name: nameObj,
      descriptionCourte: descriptionCourteObj,
      descriptionDetaillee: descriptionDetailleeObj,
      description: description || "", // rétrocompatibilité
      imagePrincipale,
      images,
      type,
      capacite: capaciteValue,
      reservable: reservable !== undefined ? reservable : true,
    });
    await chambre.save();

    const io = req.app.get("io");
    io.emit("chambreCreated", chambre);

    res.status(201).json(chambre);
  } catch (err) {
    console.error("❌ Error creating Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllChambres = async (req, res) => {
  try {
    const chambres = await Chambre.find().populate("menus");
    res.status(200).json(chambres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChambreById = async (req, res) => {
  try {
    const chambre = await Chambre.findById(req.params.id).populate("menus");
    if (!chambre) return res.status(404).json({ message: "Chambre not found" });
    res.status(200).json(chambre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateChambre = async (req, res) => {
  try {
    const { 
      name, 
      descriptionCourte, 
      descriptionDetaillee, 
      description, // rétrocompatibilité
      reservable, 
      type, 
      capacite
    } = req.body;
    const updateFields = {};

    // Récupérer la chambre existante pour préserver les traductions non modifiées
    const existing = await Chambre.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Chambre not found" });
    }

    // Parser les champs multilingues si fournis
    if (name !== undefined) {
      if (typeof name === 'string') {
        try {
          const parsed = JSON.parse(name);
          // Fusionner avec les valeurs existantes pour préserver les autres langues
          updateFields.name = {
            fr: parsed.fr !== undefined ? parsed.fr : (existing.name?.fr || ""),
            ar: parsed.ar !== undefined ? parsed.ar : (existing.name?.ar || ""),
            en: parsed.en !== undefined ? parsed.en : (existing.name?.en || "")
          };
        } catch {
          // Si ce n'est pas du JSON, mettre à jour seulement 'fr'
          updateFields.name = {
            fr: name,
            ar: existing.name?.ar || "",
            en: existing.name?.en || ""
          };
        }
      } else if (typeof name === 'object' && name !== null) {
        // Fusionner avec les valeurs existantes
        updateFields.name = {
          fr: name.fr !== undefined ? name.fr : (existing.name?.fr || ""),
          ar: name.ar !== undefined ? name.ar : (existing.name?.ar || ""),
          en: name.en !== undefined ? name.en : (existing.name?.en || "")
        };
      }
    }

    if (descriptionCourte !== undefined) {
      if (typeof descriptionCourte === 'string') {
        try {
          const parsed = JSON.parse(descriptionCourte);
          updateFields.descriptionCourte = {
            fr: parsed.fr !== undefined ? parsed.fr : (existing.descriptionCourte?.fr || ""),
            ar: parsed.ar !== undefined ? parsed.ar : (existing.descriptionCourte?.ar || ""),
            en: parsed.en !== undefined ? parsed.en : (existing.descriptionCourte?.en || "")
          };
        } catch {
          updateFields.descriptionCourte = {
            fr: descriptionCourte,
            ar: existing.descriptionCourte?.ar || "",
            en: existing.descriptionCourte?.en || ""
          };
        }
      } else if (typeof descriptionCourte === 'object' && descriptionCourte !== null) {
        updateFields.descriptionCourte = {
          fr: descriptionCourte.fr !== undefined ? descriptionCourte.fr : (existing.descriptionCourte?.fr || ""),
          ar: descriptionCourte.ar !== undefined ? descriptionCourte.ar : (existing.descriptionCourte?.ar || ""),
          en: descriptionCourte.en !== undefined ? descriptionCourte.en : (existing.descriptionCourte?.en || "")
        };
      }
    }

    if (descriptionDetaillee !== undefined) {
      if (typeof descriptionDetaillee === 'string') {
        try {
          const parsed = JSON.parse(descriptionDetaillee);
          updateFields.descriptionDetaillee = {
            fr: parsed.fr !== undefined ? parsed.fr : (existing.descriptionDetaillee?.fr || ""),
            ar: parsed.ar !== undefined ? parsed.ar : (existing.descriptionDetaillee?.ar || ""),
            en: parsed.en !== undefined ? parsed.en : (existing.descriptionDetaillee?.en || "")
          };
        } catch {
          updateFields.descriptionDetaillee = {
            fr: descriptionDetaillee,
            ar: existing.descriptionDetaillee?.ar || "",
            en: existing.descriptionDetaillee?.en || ""
          };
        }
      } else if (typeof descriptionDetaillee === 'object' && descriptionDetaillee !== null) {
        updateFields.descriptionDetaillee = {
          fr: descriptionDetaillee.fr !== undefined ? descriptionDetaillee.fr : (existing.descriptionDetaillee?.fr || ""),
          ar: descriptionDetaillee.ar !== undefined ? descriptionDetaillee.ar : (existing.descriptionDetaillee?.ar || ""),
          en: descriptionDetaillee.en !== undefined ? descriptionDetaillee.en : (existing.descriptionDetaillee?.en || "")
        };
      }
    }

    if (description !== undefined) {
      updateFields.description = description; // rétrocompatibilité
    }

    // Gérer l'image principale si fournie
    if (req.files && req.files.imagePrincipale) {
      const principaleFiles = Array.isArray(req.files.imagePrincipale) 
        ? req.files.imagePrincipale 
        : [req.files.imagePrincipale];
      if (principaleFiles.length > 0) {
        updateFields.imagePrincipale = principaleFiles[0].path || principaleFiles[0].url || "";
      }
    }
    
    // Gérer les images supplémentaires si fournies
    if (req.files && req.files.images) {
      const imagesFiles = Array.isArray(req.files.images) 
        ? req.files.images 
        : [req.files.images];
      updateFields.images = imagesFiles.map(file => file.path || file.url || "").filter(Boolean);
    }
    
    if (reservable !== undefined) updateFields.reservable = reservable;
    if (type !== undefined) updateFields.type = type;
    
    // Gérer la capacité de manière sécurisée
    if (capacite !== undefined && capacite !== null && capacite !== "") {
      const parsedCapacite = parseInt(capacite);
      if (!isNaN(parsedCapacite) && parsedCapacite > 0) {
        updateFields.capacite = parsedCapacite;
      }
    }

    const chambre = await Chambre.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    const io = req.app.get("io");
    io.emit("chambreUpdated", chambre);

    res.status(200).json(chambre);
  } catch (err) {
    console.error("❌ Error updating Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteChambre = async (req, res) => {
  try {
    const chambre = await Chambre.findByIdAndDelete(req.params.id);
    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    const io = req.app.get("io");
    io.emit("chambreDeleted", chambre._id);

    res.status(200).json({ message: "Chambre deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMenuToChambre = async (req, res) => {
  try {
    const { menuId } = req.body;

    const chambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { menus: menuId } },
      { new: true }
    ).populate("menus");

    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    res.status(200).json(chambre);
  } catch (err) {
    console.error("❌ Error adding menu to Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.addImageToChambre = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = req.file.path || req.file.url || "";
    if (!imageUrl) {
      return res.status(400).json({ message: "Failed to upload image" });
    }

    const chambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { images: imageUrl } },
      { new: true }
    ).populate("menus");

    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    const io = req.app.get("io");
    io.emit("chambreUpdated", chambre);

    res.status(200).json(chambre);
  } catch (err) {
    console.error("❌ Error adding image to Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.removeImageFromChambre = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    const chambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      { $pull: { images: imageUrl } },
      { new: true }
    ).populate("menus");

    if (!chambre) return res.status(404).json({ message: "Chambre not found" });

    const io = req.app.get("io");
    io.emit("chambreUpdated", chambre);

    res.status(200).json(chambre);
  } catch (err) {
    console.error("❌ Error removing image from Chambre:", err.message);
    res.status(500).json({ message: err.message });
  }
};
