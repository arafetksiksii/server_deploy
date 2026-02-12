const mongoose = require("mongoose");

const chambreSchema = new mongoose.Schema(
  {
    // Champs multilingues
    name: {
      fr: { type: String, trim: true },
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
    descriptionCourte: {
      fr: { type: String, default: "" },
      ar: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    descriptionDetaillee: {
      fr: { type: String, default: "" },
      ar: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    // Anciens champs (rétrocompatibilité - dépréciés)
    description: { type: String, default: "" }, // description du type de chambre (déprécié, utiliser descriptionDetaillee)
    imagePrincipale: { type: String, default: "" }, // image principale pour la présentation
    images: [{ type: String }], // tableau d'images supplémentaires pour la galerie
    type: { type: String, default: "" }, // catégorie du type (ex: "Standard", "Deluxe", "Suite", "Présidentielle")
    capacite: { type: Number, default: 2 }, // capacité maximale (nombre de personnes)
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    reservable: {
      type: Boolean,
      default: true, // si ce type de chambre est réservable
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chambre", chambreSchema);
