const mongoose = require("mongoose");

const chambreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" }, // lien vers l'image (Cloudinary ou dossier uploads)
    numero: { type: String, trim: true }, // numéro de chambre (ex: "101", "Suite 201")
    type: { type: String, default: "" }, // type de chambre (ex: "Standard", "Deluxe", "Suite")
    capacite: { type: Number, default: 2 }, // nombre de personnes
    prix: { type: Number, default: 0 }, // prix par nuit
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    reservable: {
      type: Boolean,
      default: true, // true = réservable par défaut
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chambre", chambreSchema);
