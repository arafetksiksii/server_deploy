const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
  // Identité client
  numeroChambre: { type: String },
  nomFamille: { type: String },
  numeroTelephone: { type: String },
  demandeSpeciale: { type: String },

  // Questions
  enregistrementRapide: { type: Boolean },  // Avez-vous enregistré à l'hôtel rapidement ?
  butVisite: { type: String, enum: ["Entreprise", "Loisir", "Autre"] },
  commentaireVisite: { type: String },

  receptionnistePoli: { type: Boolean }, // Le réceptionniste était-il poli ?
  commentaireReceptionniste: { type: String },

  infosNecessaires: { type: Boolean }, // Avez-vous reçu toutes les informations nécessaires ?
  commentaireInfos: { type: String },

  temperatureConfortable: { type: Boolean }, // La température de la chambre est-elle confortable ?
  commentaireTemperature: { type: String },

  toutDisponible: { type: Boolean }, // Tout ce dont vous avez besoin est-il disponible dans la chambre ?
  commentaireDisponibilite: { type: String },

  equipementFonctionne: { type: Boolean }, // L'équipement et les meubles fonctionnent-ils correctement ?
  commentaireEquipement: { type: String },

  propreteManquements: { type: Boolean }, // Y a-t-il des manquements dans la propreté ?
  
  problemeWifi: { type: Boolean }, // Avez-vous déjà eu des problèmes avec votre Wi-Fi ?
  commentaireWifi: { type: String },

  petitDejeunerDelicieux: { type: Boolean }, // Tous les plats du petit-déjeuner étaient-ils délicieux ?
  commentairePetitDejeuner: { type: String },

  ameliorations: { type: String }, // Que pourrions-nous améliorer ?
}, { timestamps: true });

module.exports = mongoose.model("Questionnaire", questionnaireSchema);
