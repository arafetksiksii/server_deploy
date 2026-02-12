# 📋 API Documentation - Types de Chambres

Documentation complète de l'API pour la gestion des **types de chambres** (présentation des différents types disponibles à l'hôtel).

> **Note** : Cette API gère les **types de chambres** pour la présentation (ex: "Chambre Standard", "Suite Deluxe"), pas les chambres individuelles avec numéros.

## 🔗 Base URL

```
http://localhost:5000/api/chambres
```

ou en production :
```
https://votre-domaine.com/api/chambres
```

---

## 📊 Structure des données

### Modèle Type de Chambre

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": {
    "fr": "Chambre Deluxe",
    "ar": "غرفة ديلوكس",
    "en": "Deluxe Room"
  },
  "descriptionCourte": {
    "fr": "Chambre spacieuse avec vue sur la mer",
    "ar": "غرفة واسعة مع إطلالة على البحر",
    "en": "Spacious room with sea view"
  },
  "descriptionDetaillee": {
    "fr": "Notre chambre Deluxe offre un confort exceptionnel avec une vue panoramique sur la mer Méditerranée. Équipée d'un lit king-size, d'une salle de bain moderne et de tous les équipements nécessaires pour un séjour mémorable.",
    "ar": "توفر غرفتنا الديلوكس راحة استثنائية مع إطلالة بانورامية على البحر الأبيض المتوسط. مجهزة بسرير كينغ سايز وحمام عصري وجميع المرافق اللازمة لإقامة لا تُنسى.",
    "en": "Our Deluxe room offers exceptional comfort with a panoramic view of the Mediterranean Sea. Equipped with a king-size bed, modern bathroom and all the amenities needed for a memorable stay."
  },
  "imagePrincipale": "https://novotel-tunis.com/uploads/events/1234567890.jpg",
  "images": [
    "https://novotel-tunis.com/uploads/events/1234567891.jpg",
    "https://novotel-tunis.com/uploads/events/1234567892.jpg"
  ],
  "type": "Deluxe",
  "capacite": 2,
  "reservable": true,
  "menus": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Menu Petit Déjeuner",
      ...
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Champs

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `name` | Object | ✅ Oui | Nom multilingue `{ fr: string, ar: string, en: string }` |
| `descriptionCourte` | Object | ❌ Non | Description courte multilingue `{ fr: string, ar: string, en: string }` |
| `descriptionDetaillee` | Object | ❌ Non | Description détaillée multilingue `{ fr: string, ar: string, en: string }` |
| `imagePrincipale` | String | ❌ Non | URL de l'image principale pour la présentation (1 seule) |
| `images` | Array[String] | ❌ Non | Tableau d'URLs d'images supplémentaires pour la galerie (max 20) |
| `type` | String | ❌ Non | Catégorie du type (ex: "Standard", "Deluxe", "Suite", "Présidentielle") |
| `capacite` | Number | ❌ Non | Capacité maximale en nombre de personnes (défaut: 2) |
| `reservable` | Boolean | ❌ Non | Si ce type de chambre est réservable (défaut: true) |
| `menus` | Array[ObjectId] | ❌ Non | Tableau de références vers les menus disponibles |
| `description` | String | ❌ Non | ⚠️ Déprécié - Utiliser `descriptionDetaillee` à la place |

---

## 🚀 Routes API

### 1. Créer un type de chambre

**POST** `/api/chambres`

Crée un nouveau type de chambre pour la présentation avec une image principale et plusieurs images supplémentaires.

#### Headers
```
Content-Type: multipart/form-data
```

#### Body (FormData)
```
name: JSON string (requis) - Nom multilingue {"fr": "...", "ar": "...", "en": "..."}
descriptionCourte: JSON string (optionnel) - Description courte multilingue {"fr": "...", "ar": "...", "en": "..."}
descriptionDetaillee: JSON string (optionnel) - Description détaillée multilingue {"fr": "...", "ar": "...", "en": "..."}
type: string (optionnel) - Catégorie (ex: "Standard", "Deluxe", "Suite")
capacite: number (optionnel, défaut: 2)
reservable: boolean (optionnel, défaut: true)
imagePrincipale: File (optionnel, 1 seule image)
images: File[] (optionnel, jusqu'à 20 images)
```

#### Exemple JavaScript/Fetch

```javascript
const formData = new FormData();

// Champs multilingues (envoyés en JSON string)
const nameMultilingue = {
  fr: "Chambre Deluxe",
  ar: "غرفة ديلوكس",
  en: "Deluxe Room"
};
formData.append("name", JSON.stringify(nameMultilingue));

const descriptionCourte = {
  fr: "Chambre spacieuse avec vue sur la mer",
  ar: "غرفة واسعة مع إطلالة على البحر",
  en: "Spacious room with sea view"
};
formData.append("descriptionCourte", JSON.stringify(descriptionCourte));

const descriptionDetaillee = {
  fr: "Notre chambre Deluxe offre un confort exceptionnel...",
  ar: "توفر غرفتنا الديلوكس راحة استثنائية...",
  en: "Our Deluxe room offers exceptional comfort..."
};
formData.append("descriptionDetaillee", JSON.stringify(descriptionDetaillee));

// Autres champs
formData.append("type", "Deluxe");
formData.append("capacite", "2");
formData.append("reservable", "true");

// Image principale (1 seule)
const imagePrincipaleFile = document.querySelector('input[name="imagePrincipale"]').files[0];
if (imagePrincipaleFile) {
  formData.append("imagePrincipale", imagePrincipaleFile);
}

// Images supplémentaires (plusieurs)
const imagesFiles = document.querySelector('input[name="images"]').files;
for (let i = 0; i < imagesFiles.length; i++) {
  formData.append("images", imagesFiles[i]);
}

const response = await fetch("http://localhost:5000/api/chambres", {
  method: "POST",
  body: formData
});

const chambre = await response.json();
console.log(chambre);
```

#### Exemple React

```jsx
import { useState } from "react";
import { createChambre } from "./api/chambreApi";

function CreateChambre() {
  const [formData, setFormData] = useState({
    name: { fr: "", ar: "", en: "" },
    descriptionCourte: { fr: "", ar: "", en: "" },
    descriptionDetaillee: { fr: "", ar: "", en: "" },
    type: "",
    capacite: 2,
    reservable: true,
  });
  const [imagePrincipale, setImagePrincipale] = useState(null);
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const chambreData = {
        ...formData,
        imagePrincipale,
        images,
      };
      
      const chambre = await createChambre(chambreData);
      console.log("Chambre créée:", chambre);
      
      // Réinitialiser le formulaire
      setFormData({
        name: { fr: "", ar: "", en: "" },
        descriptionCourte: { fr: "", ar: "", en: "" },
        descriptionDetaillee: { fr: "", ar: "", en: "" },
        type: "",
        capacite: 2,
        reservable: true,
      });
      setImagePrincipale(null);
      setImages([]);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nom (multilingue)</h3>
      <input
        type="text"
        placeholder="Nom (FR)"
        value={formData.name.fr}
        onChange={(e) => setFormData({ 
          ...formData, 
          name: { ...formData.name, fr: e.target.value } 
        })}
        required
      />
      <input
        type="text"
        placeholder="Nom (AR)"
        value={formData.name.ar}
        onChange={(e) => setFormData({ 
          ...formData, 
          name: { ...formData.name, ar: e.target.value } 
        })}
      />
      <input
        type="text"
        placeholder="Nom (EN)"
        value={formData.name.en}
        onChange={(e) => setFormData({ 
          ...formData, 
          name: { ...formData.name, en: e.target.value } 
        })}
      />
      
      <h3>Description courte (multilingue)</h3>
      <textarea
        placeholder="Description courte (FR)"
        value={formData.descriptionCourte.fr}
        onChange={(e) => setFormData({ 
          ...formData, 
          descriptionCourte: { ...formData.descriptionCourte, fr: e.target.value } 
        })}
      />
      <textarea
        placeholder="Description courte (AR)"
        value={formData.descriptionCourte.ar}
        onChange={(e) => setFormData({ 
          ...formData, 
          descriptionCourte: { ...formData.descriptionCourte, ar: e.target.value } 
        })}
      />
      <textarea
        placeholder="Description courte (EN)"
        value={formData.descriptionCourte.en}
        onChange={(e) => setFormData({ 
          ...formData, 
          descriptionCourte: { ...formData.descriptionCourte, en: e.target.value } 
        })}
      />
      
      <h3>Description détaillée (multilingue)</h3>
      <textarea
        placeholder="Description détaillée (FR)"
        rows="4"
        value={formData.descriptionDetaillee.fr}
        onChange={(e) => setFormData({ 
          ...formData, 
          descriptionDetaillee: { ...formData.descriptionDetaillee, fr: e.target.value } 
        })}
      />
      <textarea
        placeholder="Description détaillée (AR)"
        rows="4"
        value={formData.descriptionDetaillee.ar}
        onChange={(e) => setFormData({ 
          ...formData, 
          descriptionDetaillee: { ...formData.descriptionDetaillee, ar: e.target.value } 
        })}
      />
      <textarea
        placeholder="Description détaillée (EN)"
        rows="4"
        value={formData.descriptionDetaillee.en}
        onChange={(e) => setFormData({ 
          ...formData, 
          descriptionDetaillee: { ...formData.descriptionDetaillee, en: e.target.value } 
        })}
      />
      
      <input
        type="text"
        placeholder="Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />
      <input
        type="number"
        placeholder="Capacité"
        value={formData.capacite}
        onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
      />
      
      <label>
        Image principale:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagePrincipale(e.target.files[0])}
        />
      </label>
      
      <label>
        Images supplémentaires (plusieurs):
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
        />
      </label>
      
      <button type="submit">Créer</button>
    </form>
  );
}
```

#### Réponse

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": {
    "fr": "Chambre Deluxe",
    "ar": "غرفة ديلوكس",
    "en": "Deluxe Room"
  },
  "descriptionCourte": {
    "fr": "Chambre spacieuse avec vue sur la mer",
    "ar": "غرفة واسعة مع إطلالة على البحر",
    "en": "Spacious room with sea view"
  },
  "descriptionDetaillee": {
    "fr": "Notre chambre Deluxe offre un confort exceptionnel...",
    "ar": "توفر غرفتنا الديلوكس راحة استثنائية...",
    "en": "Our Deluxe room offers exceptional comfort..."
  },
  "imagePrincipale": "https://novotel-tunis.com/uploads/events/1234567890.jpg",
  "images": [
    "https://novotel-tunis.com/uploads/events/1234567891.jpg",
    "https://novotel-tunis.com/uploads/events/1234567892.jpg"
  ],
  "type": "Deluxe",
  "capacite": 2,
  "reservable": true,
  "menus": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Récupérer toutes les chambres

**GET** `/api/chambres`

Récupère la liste de toutes les chambres avec leurs menus populés.

#### Exemple JavaScript/Fetch

```javascript
const response = await fetch("http://localhost:5000/api/chambres");
const chambres = await response.json();
console.log(chambres);
```

#### Exemple React avec useEffect et traductions

```jsx
import { useState, useEffect } from "react";
import { fetchChambres, getName, getDescriptionCourte, getDescriptionDetaillee } from "./api/chambreApi";

function ChambresList({ lang = 'fr' }) {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChambres = async () => {
      try {
        const data = await fetchChambres();
        setChambres(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChambres();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {chambres.map((chambre) => (
        <div key={chambre._id}>
          <h3>{getName(chambre, lang)}</h3>
          {chambre.imagePrincipale && (
            <img src={chambre.imagePrincipale} alt={getName(chambre, lang)} />
          )}
          <p>{getDescriptionCourte(chambre, lang)}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Réponse

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": {
      "fr": "Chambre Deluxe",
      "ar": "غرفة ديلوكس",
      "en": "Deluxe Room"
    },
    "descriptionCourte": {
      "fr": "Chambre spacieuse avec vue sur la mer",
      "ar": "غرفة واسعة مع إطلالة على البحر",
      "en": "Spacious room with sea view"
    },
    "descriptionDetaillee": {
      "fr": "Notre chambre Deluxe offre un confort exceptionnel...",
      "ar": "توفر غرفتنا الديلوكس راحة استثنائية...",
      "en": "Our Deluxe room offers exceptional comfort..."
    },
    "imagePrincipale": "https://novotel-tunis.com/uploads/events/1234567890.jpg",
    "images": [...],
    "type": "Deluxe",
    "capacite": 2,
    "reservable": true,
    "menus": [...],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  ...
]
```

---

### 3. Récupérer une chambre par ID

**GET** `/api/chambres/:id`

Récupère les détails d'une chambre spécifique.

#### Exemple JavaScript/Fetch

```javascript
const chambreId = "507f1f77bcf86cd799439011";
const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}`);
const chambre = await response.json();
console.log(chambre);
```

#### Exemple React avec traductions

```jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  fetchChambreById, 
  getName, 
  getDescriptionCourte, 
  getDescriptionDetaillee 
} from "./api/chambreApi";

function ChambreDetail({ lang = 'fr' }) {
  const { id } = useParams();
  const [chambre, setChambre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChambre = async () => {
      try {
        const data = await fetchChambreById(id);
        setChambre(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChambre();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!chambre) return <div>Chambre non trouvée</div>;

  return (
    <div>
      <h1>{getName(chambre, lang)}</h1>
      {chambre.imagePrincipale && (
        <img src={chambre.imagePrincipale} alt={getName(chambre, lang)} />
      )}
      <p><strong>Description courte:</strong> {getDescriptionCourte(chambre, lang)}</p>
      <p><strong>Description détaillée:</strong> {getDescriptionDetaillee(chambre, lang)}</p>
      <p>Type: {chambre.type}</p>
      <p>Capacité: {chambre.capacite} personnes</p>
      
      {chambre.images && chambre.images.length > 0 && (
        <div>
          <h3>Images supplémentaires:</h3>
          {chambre.images.map((img, index) => (
            <img key={index} src={img} alt={`${getName(chambre, lang)} ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Exemple React avec sélecteur de langue

```jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  fetchChambreById, 
  getName, 
  getDescriptionCourte, 
  getDescriptionDetaillee 
} from "./api/chambreApi";

function ChambreDetail() {
  const { id } = useParams();
  const [chambre, setChambre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('fr'); // Langue sélectionnée

  useEffect(() => {
    const loadChambre = async () => {
      try {
        const data = await fetchChambreById(id);
        setChambre(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChambre();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!chambre) return <div>Chambre non trouvée</div>;

  return (
    <div>
      {/* Sélecteur de langue */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Langue: 
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <h1>{getName(chambre, lang)}</h1>
      {chambre.imagePrincipale && (
        <img src={chambre.imagePrincipale} alt={getName(chambre, lang)} style={{ maxWidth: "100%" }} />
      )}
      <p><strong>Description courte:</strong> {getDescriptionCourte(chambre, lang)}</p>
      <p><strong>Description détaillée:</strong> {getDescriptionDetaillee(chambre, lang)}</p>
      <p>Type: {chambre.type}</p>
      <p>Capacité: {chambre.capacite} personnes</p>
      
      {chambre.images && chambre.images.length > 0 && (
        <div>
          <h3>Images supplémentaires:</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {chambre.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`${getName(chambre, lang)} ${index + 1}`}
                style={{ maxWidth: "200px", height: "auto" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Réponse

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": {
    "fr": "Chambre Deluxe",
    "ar": "غرفة ديلوكس",
    "en": "Deluxe Room"
  },
  "descriptionCourte": {
    "fr": "Chambre spacieuse avec vue sur la mer",
    "ar": "غرفة واسعة مع إطلالة على البحر",
    "en": "Spacious room with sea view"
  },
  "descriptionDetaillee": {
    "fr": "Notre chambre Deluxe offre un confort exceptionnel avec une vue panoramique sur la mer Méditerranée. Équipée d'un lit king-size, d'une salle de bain moderne et de tous les équipements nécessaires pour un séjour mémorable.",
    "ar": "توفر غرفتنا الديلوكس راحة استثنائية مع إطلالة بانورامية على البحر الأبيض المتوسط. مجهزة بسرير كينغ سايز وحمام عصري وجميع المرافق اللازمة لإقامة لا تُنسى.",
    "en": "Our Deluxe room offers exceptional comfort with a panoramic view of the Mediterranean Sea. Equipped with a king-size bed, modern bathroom and all the amenities needed for a memorable stay."
  },
  "imagePrincipale": "https://novotel-tunis.com/uploads/events/1234567890.jpg",
  "images": [...],
  "type": "Deluxe",
  "capacite": 2,
  "reservable": true,
  "menus": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Mettre à jour une chambre

**PUT** `/api/chambres/:id`

Met à jour une chambre existante. Les champs non fournis ne seront pas modifiés.

#### Headers
```
Content-Type: multipart/form-data
```

#### Body (FormData)
```
name: JSON string (optionnel) - Nom multilingue {"fr": "...", "ar": "...", "en": "..."}
descriptionCourte: JSON string (optionnel) - Description courte multilingue
descriptionDetaillee: JSON string (optionnel) - Description détaillée multilingue
type: string (optionnel)
capacite: number (optionnel)
reservable: boolean (optionnel)
imagePrincipale: File (optionnel, remplace l'image principale)
images: File[] (optionnel, remplace toutes les images supplémentaires)
```

#### Exemple JavaScript/Fetch

```javascript
const chambreId = "507f1f77bcf86cd799439011";
const formData = new FormData();

// Mettre à jour le nom multilingue
const nameMultilingue = {
  fr: "Chambre Deluxe Modifiée",
  ar: "غرفة ديلوكس معدلة",
  en: "Modified Deluxe Room"
};
formData.append("name", JSON.stringify(nameMultilingue));

// Optionnel: remplacer l'image principale
const newImagePrincipale = document.querySelector('input[name="imagePrincipale"]').files[0];
if (newImagePrincipale) {
  formData.append("imagePrincipale", newImagePrincipale);
}

// Optionnel: remplacer toutes les images supplémentaires
const newImages = document.querySelector('input[name="images"]').files;
for (let i = 0; i < newImages.length; i++) {
  formData.append("images", newImages[i]);
}

const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}`, {
  method: "PUT",
  body: formData
});

const chambre = await response.json();
console.log(chambre);
```

#### Réponse

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": {
    "fr": "Chambre Deluxe Modifiée",
    "ar": "غرفة ديلوكس معدلة",
    "en": "Modified Deluxe Room"
  },
  "descriptionCourte": {
    "fr": "Chambre spacieuse avec vue sur la mer",
    "ar": "غرفة واسعة مع إطلالة على البحر",
    "en": "Spacious room with sea view"
  },
  "descriptionDetaillee": {
    "fr": "Notre chambre Deluxe offre un confort exceptionnel...",
    "ar": "توفر غرفتنا الديلوكس راحة استثنائية...",
    "en": "Our Deluxe room offers exceptional comfort..."
  },
  "imagePrincipale": "https://novotel-tunis.com/uploads/events/1234567890.jpg",
  "images": [...],
  "type": "Deluxe",
  "capacite": 2,
  "reservable": true,
  "menus": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### 5. Supprimer une chambre

**DELETE** `/api/chambres/:id`

Supprime une chambre.

#### Exemple JavaScript/Fetch

```javascript
const chambreId = "507f1f77bcf86cd799439011";

const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}`, {
  method: "DELETE"
});

const result = await response.json();
console.log(result); // { message: "Chambre deleted successfully" }
```

#### Exemple React

```jsx
const handleDelete = async (id) => {
  if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/chambres/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression");

    // Recharger la liste
    fetchChambres();
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

#### Réponse

```json
{
  "message": "Chambre deleted successfully"
}
```

---

### 6. Ajouter un menu à une chambre

**PUT** `/api/chambres/:id/add-menu`

Ajoute un menu à une chambre (sans doublon).

#### Headers
```
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "menuId": "507f1f77bcf86cd799439012"
}
```

#### Exemple JavaScript/Fetch

```javascript
const chambreId = "507f1f77bcf86cd799439011";
const menuId = "507f1f77bcf86cd799439012";

const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}/add-menu`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ menuId }),
});

const chambre = await response.json();
console.log(chambre);
```

#### Réponse

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Chambre Deluxe",
  ...
  "menus": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Menu Petit Déjeuner",
      ...
    }
  ],
  ...
}
```

---

### 7. Ajouter une image supplémentaire

**POST** `/api/chambres/:id/add-image`

Ajoute une image supplémentaire à une chambre existante (sans remplacer les autres).

#### Headers
```
Content-Type: multipart/form-data
```

#### Body (FormData)
```
image: File (requis)
```

#### Exemple JavaScript/Fetch

```javascript
const chambreId = "507f1f77bcf86cd799439011";
const formData = new FormData();
const imageFile = document.querySelector('input[name="image"]').files[0];
formData.append("image", imageFile);

const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}/add-image`, {
  method: "POST",
  body: formData
});

const chambre = await response.json();
console.log(chambre);
```

#### Exemple React

```jsx
const handleAddImage = async (chambreId) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}/add-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout");

      const chambre = await response.json();
      console.log("Image ajoutée:", chambre);
      // Mettre à jour l'état
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  fileInput.click();
};
```

#### Réponse

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Chambre Deluxe",
  ...
  "images": [
    "https://novotel-tunis.com/uploads/events/1234567891.jpg",
    "https://novotel-tunis.com/uploads/events/1234567892.jpg",
    "https://novotel-tunis.com/uploads/events/1234567893.jpg" // nouvelle image
  ],
  ...
}
```

---

### 8. Supprimer une image

**PUT** `/api/chambres/:id/remove-image`

Supprime une image spécifique d'une chambre.

#### Headers
```
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "imageUrl": "https://novotel-tunis.com/uploads/events/1234567891.jpg"
}
```

#### Exemple JavaScript/Fetch

```javascript
const chambreId = "507f1f77bcf86cd799439011";
const imageUrl = "https://novotel-tunis.com/uploads/events/1234567891.jpg";

const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}/remove-image`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ imageUrl }),
});

const chambre = await response.json();
console.log(chambre);
```

#### Exemple React

```jsx
const handleRemoveImage = async (chambreId, imageUrl) => {
  try {
    const response = await fetch(`http://localhost:5000/api/chambres/${chambreId}/remove-image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression");

    const chambre = await response.json();
    console.log("Image supprimée:", chambre);
    // Mettre à jour l'état
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

#### Réponse

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Chambre Deluxe",
  ...
  "images": [
    "https://novotel-tunis.com/uploads/events/1234567892.jpg"
    // l'image supprimée n'est plus dans le tableau
  ],
  ...
}
```

---

## 🔔 Socket.IO Events

L'API émet des événements Socket.IO lors des modifications :

- `chambreCreated` : Émis lorsqu'une chambre est créée
- `chambreUpdated` : Émis lorsqu'une chambre est mise à jour
- `chambreDeleted` : Émis lorsqu'une chambre est supprimée (contient l'ID de la chambre)

#### Exemple d'écoute Socket.IO

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("chambreCreated", (chambre) => {
  console.log("Nouvelle chambre créée:", chambre);
  // Mettre à jour l'interface
});

socket.on("chambreUpdated", (chambre) => {
  console.log("Chambre mise à jour:", chambre);
  // Mettre à jour l'interface
});

socket.on("chambreDeleted", (chambreId) => {
  console.log("Chambre supprimée:", chambreId);
  // Mettre à jour l'interface
});
```

---

## ⚠️ Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide (champs manquants, format incorrect) |
| 404 | Chambre non trouvée |
| 500 | Erreur serveur |

---

## 📝 Notes importantes

> **⚠️ Important** : Cette API gère les **types de chambres** pour la présentation (ex: "Chambre Standard", "Suite Deluxe"), pas les chambres individuelles avec numéros. Utilisez cette API pour afficher les différents types de chambres disponibles à l'hôtel.

1. **Images** :
   - L'image principale est unique (1 seule)
   - Les images supplémentaires peuvent être jusqu'à 20
   - Les images sont uploadées sur SFTP/OVH et retournent une URL complète
   - Format accepté : JPG, PNG, WebP, etc.

2. **Mise à jour** :
   - Lors de la mise à jour, seuls les champs fournis seront modifiés
   - Pour remplacer l'image principale, envoyez un nouveau fichier dans `imagePrincipale`
   - Pour remplacer toutes les images supplémentaires, envoyez de nouveaux fichiers dans `images`
   - Pour ajouter une image sans remplacer, utilisez la route `/add-image`

3. **Menus** :
   - Les menus sont automatiquement populés dans les réponses
   - Utilisez `add-menu` pour lier un menu à un type de chambre (évite les doublons)

4. **Types de chambres** :
   - Chaque entrée représente un **type de chambre** (ex: "Chambre Standard", "Suite Deluxe")
   - Le champ `name` est le nom complet du type (ex: "Chambre Standard avec vue mer")
   - Le champ `type` est la catégorie (ex: "Standard", "Deluxe", "Suite")

5. **CORS** :
   - L'API accepte les requêtes depuis les origines configurées dans `index.js`

---

## 🎯 Exemple complet React Hook

```jsx
import { useState, useEffect } from "react";

function useChambres() {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:5000/api/chambres";

  // Récupérer toutes les chambres
  const fetchChambres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setChambres(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Créer une chambre
  const createChambre = async (chambreData) => {
    const formData = new FormData();
    Object.keys(chambreData).forEach((key) => {
      if (key === "imagePrincipale" || key === "images") return;
      formData.append(key, chambreData[key]);
    });

    if (chambreData.imagePrincipale) {
      formData.append("imagePrincipale", chambreData.imagePrincipale);
    }

    if (chambreData.images) {
      chambreData.images.forEach((img) => formData.append("images", img));
    }

    const response = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de la création");
    const newChambre = await response.json();
    setChambres([...chambres, newChambre]);
    return newChambre;
  };

  // Mettre à jour une chambre
  const updateChambre = async (id, chambreData) => {
    const formData = new FormData();
    Object.keys(chambreData).forEach((key) => {
      if (key === "imagePrincipale" || key === "images") return;
      if (chambreData[key] !== undefined) {
        formData.append(key, chambreData[key]);
      }
    });

    if (chambreData.imagePrincipale) {
      formData.append("imagePrincipale", chambreData.imagePrincipale);
    }

    if (chambreData.images) {
      chambreData.images.forEach((img) => formData.append("images", img));
    }

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour");
    const updatedChambre = await response.json();
    setChambres(chambres.map((c) => (c._id === id ? updatedChambre : c)));
    return updatedChambre;
  };

  // Supprimer une chambre
  const deleteChambre = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression");
    setChambres(chambres.filter((c) => c._id !== id));
  };

  // Ajouter une image
  const addImage = async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_BASE}/${id}/add-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout de l'image");
    const updatedChambre = await response.json();
    setChambres(chambres.map((c) => (c._id === id ? updatedChambre : c)));
    return updatedChambre;
  };

  // Supprimer une image
  const removeImage = async (id, imageUrl) => {
    const response = await fetch(`${API_BASE}/${id}/remove-image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression de l'image");
    const updatedChambre = await response.json();
    setChambres(chambres.map((c) => (c._id === id ? updatedChambre : c)));
    return updatedChambre;
  };

  useEffect(() => {
    fetchChambres();
  }, []);

  return {
    chambres,
    loading,
    error,
    fetchChambres,
    createChambre,
    updateChambre,
    deleteChambre,
    addImage,
    removeImage,
  };
}

export default useChambres;
```

---

## 🌐 Utilisation des traductions côté frontend

### Helpers disponibles

Le service API fournit des fonctions helper pour faciliter l'utilisation des traductions :

```javascript
import { 
  getName, 
  getDescriptionCourte, 
  getDescriptionDetaillee,
  getTranslatedText 
} from './api/chambreApi';
```

#### Exemple d'utilisation

```jsx
import { useState, useEffect } from 'react';
import { fetchChambres, getName, getDescriptionCourte, getDescriptionDetaillee } from './api/chambreApi';

function ChambresList({ lang = 'fr' }) {
  const [chambres, setChambres] = useState([]);

  useEffect(() => {
    const loadChambres = async () => {
      const data = await fetchChambres();
      setChambres(data);
    };
    loadChambres();
  }, []);

  return (
    <div>
      {chambres.map((chambre) => (
        <div key={chambre._id}>
          <h2>{getName(chambre, lang)}</h2>
          <p>{getDescriptionCourte(chambre, lang)}</p>
          <p>{getDescriptionDetaillee(chambre, lang)}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Fonction helper générique

```javascript
import { getTranslatedText } from './api/chambreApi';

// Récupérer n'importe quel champ traduit
const nom = getTranslatedText(chambre, 'name', 'fr'); // Français
const nomAr = getTranslatedText(chambre, 'name', 'ar'); // Arabe
const nomEn = getTranslatedText(chambre, 'name', 'en'); // Anglais

// Avec langue de secours
const nom = getTranslatedText(chambre, 'name', 'ar', 'fr'); // Arabe, sinon Français
```

#### Exemple avec sélecteur de langue

```jsx
import { useState } from 'react';
import { getName, getDescriptionCourte } from './api/chambreApi';

function ChambreCard({ chambre }) {
  const [lang, setLang] = useState('fr');

  return (
    <div>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
      
      <h2>{getName(chambre, lang)}</h2>
      <p>{getDescriptionCourte(chambre, lang)}</p>
    </div>
  );
}
```

---

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
