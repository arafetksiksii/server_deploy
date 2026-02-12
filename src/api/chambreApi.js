/**
 * Service API pour la gestion des chambres
 * 
 * Utilisation:
 * import { fetchChambres, createChambre } from './api/chambreApi';
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Récupère toutes les chambres
 * @returns {Promise<Array>} Liste des chambres avec menus populés
 */
export const fetchChambres = async () => {
  const response = await fetch(`${API_BASE_URL}/api/chambres`);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Récupère une chambre par son ID
 * @param {string} id - ID de la chambre
 * @returns {Promise<Object>} Chambre avec menus populés
 */
export const fetchChambreById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/chambres/${id}`);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Crée un nouveau type de chambre (pour présentation)
 * @param {Object} chambreData - Données du type de chambre
 * @param {Object} chambreData.name - Nom multilingue { fr: string, ar: string, en: string } (fr requis)
 * @param {Object} chambreData.descriptionCourte - Description courte multilingue { fr: string, ar: string, en: string }
 * @param {Object} chambreData.descriptionDetaillee - Description détaillée multilingue { fr: string, ar: string, en: string }
 * @param {boolean} chambreData.reservable - Si ce type de chambre est réservable
 * @param {string} chambreData.type - Catégorie du type (ex: "Standard", "Deluxe", "Suite")
 * @param {number} chambreData.capacite - Capacité maximale (nombre de personnes)
 * @param {File} chambreData.imagePrincipale - Fichier image principale (optionnel)
 * @param {File[]} chambreData.images - Tableau de fichiers images supplémentaires (optionnel)
 * @returns {Promise<Object>} Type de chambre créé
 */
export const createChambre = async (chambreData) => {
  const formData = new FormData();
  
  // Champs multilingues (envoyés en JSON string)
  if (chambreData.name) {
    formData.append("name", JSON.stringify(chambreData.name));
  }
  if (chambreData.descriptionCourte) {
    formData.append("descriptionCourte", JSON.stringify(chambreData.descriptionCourte));
  }
  if (chambreData.descriptionDetaillee) {
    formData.append("descriptionDetaillee", JSON.stringify(chambreData.descriptionDetaillee));
  }
  
  // Autres champs
  if (chambreData.type) formData.append("type", chambreData.type);
  if (chambreData.capacite) formData.append("capacite", chambreData.capacite);
  formData.append("reservable", chambreData.reservable !== undefined ? chambreData.reservable : true);
  
  // Images
  if (chambreData.imagePrincipale) {
    formData.append("imagePrincipale", chambreData.imagePrincipale);
  }
  
  if (chambreData.images && Array.isArray(chambreData.images)) {
    chambreData.images.forEach((img) => {
      formData.append("images", img);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/chambres`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  return response.json();
};

/**
 * Met à jour une chambre existante
 * @param {string} id - ID de la chambre
 * @param {Object} chambreData - Données à mettre à jour (seuls les champs fournis seront modifiés)
 * @param {Object} chambreData.name - Nom multilingue { fr: string, ar: string, en: string }
 * @param {Object} chambreData.descriptionCourte - Description courte multilingue { fr: string, ar: string, en: string }
 * @param {Object} chambreData.descriptionDetaillee - Description détaillée multilingue { fr: string, ar: string, en: string }
 * @returns {Promise<Object>} Chambre mise à jour
 */
export const updateChambre = async (id, chambreData) => {
  const formData = new FormData();
  
  // Champs multilingues (seulement si fournis)
  if (chambreData.name !== undefined) {
    formData.append("name", JSON.stringify(chambreData.name));
  }
  if (chambreData.descriptionCourte !== undefined) {
    formData.append("descriptionCourte", JSON.stringify(chambreData.descriptionCourte));
  }
  if (chambreData.descriptionDetaillee !== undefined) {
    formData.append("descriptionDetaillee", JSON.stringify(chambreData.descriptionDetaillee));
  }
  
  // Autres champs
  if (chambreData.type !== undefined) formData.append("type", chambreData.type);
  if (chambreData.capacite !== undefined) formData.append("capacite", chambreData.capacite);
  if (chambreData.reservable !== undefined) formData.append("reservable", chambreData.reservable);
  
  // Images (remplacent les existantes si fournies)
  if (chambreData.imagePrincipale) {
    formData.append("imagePrincipale", chambreData.imagePrincipale);
  }
  
  if (chambreData.images && Array.isArray(chambreData.images)) {
    chambreData.images.forEach((img) => {
      formData.append("images", img);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/chambres/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  return response.json();
};

/**
 * Supprime une chambre
 * @param {string} id - ID de la chambre
 * @returns {Promise<Object>} Message de confirmation
 */
export const deleteChambre = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/chambres/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  return response.json();
};

/**
 * Ajoute un menu à une chambre
 * @param {string} id - ID de la chambre
 * @param {string} menuId - ID du menu à ajouter
 * @returns {Promise<Object>} Chambre mise à jour avec menus populés
 */
export const addMenuToChambre = async (id, menuId) => {
  const response = await fetch(`${API_BASE_URL}/api/chambres/${id}/add-menu`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ menuId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  return response.json();
};

/**
 * Ajoute une image supplémentaire à une chambre (sans remplacer les autres)
 * @param {string} id - ID de la chambre
 * @param {File} imageFile - Fichier image à ajouter
 * @returns {Promise<Object>} Chambre mise à jour
 */
export const addImageToChambre = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/chambres/${id}/add-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  return response.json();
};

/**
 * Supprime une image d'une chambre
 * @param {string} id - ID de la chambre
 * @param {string} imageUrl - URL de l'image à supprimer
 * @returns {Promise<Object>} Chambre mise à jour
 */
export const removeImageFromChambre = async (id, imageUrl) => {
  const response = await fetch(`${API_BASE_URL}/api/chambres/${id}/remove-image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  return response.json();
};

/**
 * Helper: Récupère le texte traduit selon la langue
 * @param {Object} chambre - Objet chambre avec les champs multilingues
 * @param {string} field - Nom du champ ('name', 'descriptionCourte', 'descriptionDetaillee')
 * @param {string} lang - Langue souhaitée ('fr', 'ar', 'en')
 * @param {string} fallback - Langue de secours si la langue demandée n'existe pas (défaut: 'fr')
 * @returns {string} Texte traduit
 */
export const getTranslatedText = (chambre, field, lang = 'fr', fallback = 'fr') => {
  if (!chambre || !chambre[field]) return '';
  
  const fieldData = chambre[field];
  
  // Si c'est un objet multilingue
  if (typeof fieldData === 'object' && fieldData !== null && !Array.isArray(fieldData)) {
    return fieldData[lang] || fieldData[fallback] || fieldData.fr || '';
  }
  
  // Sinon retourner tel quel (rétrocompatibilité)
  return fieldData || '';
};

/**
 * Helper: Récupère le nom traduit
 * @param {Object} chambre - Objet chambre
 * @param {string} lang - Langue ('fr', 'ar', 'en')
 * @returns {string} Nom traduit
 */
export const getName = (chambre, lang = 'fr') => {
  return getTranslatedText(chambre, 'name', lang);
};

/**
 * Helper: Récupère la description courte traduite
 * @param {Object} chambre - Objet chambre
 * @param {string} lang - Langue ('fr', 'ar', 'en')
 * @returns {string} Description courte traduite
 */
export const getDescriptionCourte = (chambre, lang = 'fr') => {
  return getTranslatedText(chambre, 'descriptionCourte', lang);
};

/**
 * Helper: Récupère la description détaillée traduite
 * @param {Object} chambre - Objet chambre
 * @param {string} lang - Langue ('fr', 'ar', 'en')
 * @returns {string} Description détaillée traduite
 */
export const getDescriptionDetaillee = (chambre, lang = 'fr') => {
  return getTranslatedText(chambre, 'descriptionDetaillee', lang);
};
