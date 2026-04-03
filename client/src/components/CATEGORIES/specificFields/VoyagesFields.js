// 📂 components/CATEGORIES/specificFields/VoyagesFields.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE VOYAGES (STEP 2)
// ============================================

// Destination
const DestinationField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Destination</label>
      <input
        type="text"
        name="destination"
        className="form-control"
        placeholder="Ex: Paris, Istanbul, Dubaï, Makkah..."
        value={postData?.destination || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Durée
const DureeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Durée</label>
      <input
        type="text"
        name="duree"
        className="form-control"
        placeholder="Ex: 7 jours, 2 semaines, 15 nuits..."
        value={postData?.duree || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Date départ
const DateDepartField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Date de départ</label>
      <input
        type="date"
        name="date_depart"
        className="form-control"
        value={postData?.date_depart || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Date retour
const DateRetourField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Date de retour</label>
      <input
        type="date"
        name="date_retour"
        className="form-control"
        value={postData?.date_retour || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre de personnes
const NombrePersonnesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de personnes</label>
      <input
        type="number"
        name="nombre_personnes"
        className="form-control"
        placeholder="Ex: 1, 2, 4..."
        value={postData?.nombre_personnes || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Transport
const TransportField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Transport</label>
      <select
        name="transport"
        className="form-control"
        value={postData?.transport || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="avion">Avion</option>
        <option value="bus">Bus</option>
        <option value="train">Train</option>
        <option value="voiture">Voiture</option>
        <option value="mixte">Mixte</option>
      </select>
    </div>
  );
};

// Hébergement
const HebergementField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hébergement</label>
      <input
        type="text"
        name="hebergement"
        className="form-control"
        placeholder="Ex: Hôtel 4*, Riad, Appartement..."
        value={postData?.hebergement || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Activités incluses
const ActivitesInclusesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Activités incluses</label>
      <textarea
        name="activites_incluses"
        className="form-control"
        rows="3"
        placeholder="Visites guidées, excursions, repas..."
        value={postData?.activites_incluses || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type d'hébergement (pour location vacances)
const TypeHebergementField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'hébergement</label>
      <select
        name="type_hebergement"
        className="form-control"
        value={postData?.type_hebergement || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="appartement">Appartement</option>
        <option value="villa">Villa</option>
        <option value="maison">Maison</option>
        <option value="studio">Studio</option>
        <option value="riad">Riad</option>
        <option value="chalet">Chalet</option>
      </select>
    </div>
  );
};

// Capacité
const CapaciteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité (personnes)</label>
      <input
        type="number"
        name="capacite"
        className="form-control"
        placeholder="Ex: 2, 4, 6..."
        value={postData?.capacite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Équipements
const EquipementsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Équipements</label>
      <textarea
        name="equipements"
        className="form-control"
        rows="3"
        placeholder="WiFi, piscine, climatisation, parking..."
        value={postData?.equipements || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Proximité
const ProximiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Proximité</label>
      <input
        type="text"
        name="proximite"
        className="form-control"
        placeholder="Ex: Centre ville 5min, Plage 200m..."
        value={postData?.proximite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de pèlerinage (Hajj/Omra)
const TypePelerinageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de pèlerinage</label>
      <select
        name="type_pelerinage"
        className="form-control"
        value={postData?.type_pelerinage || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="hajj">Hajj</option>
        <option value="omra">Omra</option>
        <option value="hajj_omra">Hajj + Omra</option>
      </select>
    </div>
  );
};

// Groupe
const GroupeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Groupe</label>
      <select
        name="groupe"
        className="form-control"
        value={postData?.groupe || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="individuel">Individuel</option>
        <option value="famille">Famille</option>
        <option value="groupe_organise">Groupe organisé</option>
      </select>
    </div>
  );
};

// Hôtel Makkah
const HotelMakkahField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hôtel à Makkah</label>
      <input
        type="text"
        name="hotel_makkah"
        className="form-control"
        placeholder="Nom et catégorie"
        value={postData?.hotel_makkah || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Hôtel Madinah
const HotelMadinahField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hôtel à Madinah</label>
      <input
        type="text"
        name="hotel_madinah"
        className="form-control"
        placeholder="Nom et catégorie"
        value={postData?.hotel_madinah || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Vols inclus
const VolsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vols inclus</label>
      <select
        name="vols"
        className="form-control"
        value={postData?.vols || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="aller_retour">Aller-retour inclus</option>
        <option value="non_inclus">Vols non inclus</option>
        <option value="optionnel">Optionnel</option>
      </select>
    </div>
  );
};

// Type de séjour
const TypeSejourField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de séjour</label>
      <select
        name="type_sejour"
        className="form-control"
        value={postData?.type_sejour || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="detente">Détente</option>
        <option value="decouverte">Découverte</option>
        <option value="aventure">Aventure</option>
        <option value="culturel">Culturel</option>
        <option value="balneaire">Balnéaire</option>
      </select>
    </div>
  );
};

// Catégorie hôtel
const CategorieHotelField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Catégorie d'hôtel</label>
      <select
        name="categorie_hotel"
        className="form-control"
        value={postData?.categorie_hotel || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="2_etoiles">2 étoiles</option>
        <option value="3_etoiles">3 étoiles</option>
        <option value="4_etoiles">4 étoiles</option>
        <option value="5_etoiles">5 étoiles</option>
        <option value="luxe">Luxe</option>
      </select>
    </div>
  );
};

// Nom bateau (croisière)
const NomBateauField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nom du bateau</label>
      <input
        type="text"
        name="nom_bateau"
        className="form-control"
        placeholder="Nom de la croisière"
        value={postData?.nom_bateau || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de cabine (croisière)
const CabineField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de cabine</label>
      <select
        name="cabine"
        className="form-control"
        value={postData?.cabine || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="interieur">Intérieure</option>
        <option value="exterieur">Extérieure</option>
        <option value="balcon">Avec balcon</option>
        <option value="suite">Suite</option>
      </select>
    </div>
  );
};

// Compagnie/Agence
const CompagnieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compagnie/Agence</label>
      <input
        type="text"
        name="compagnie"
        className="form-control"
        placeholder="Nom de la compagnie ou agence"
        value={postData?.compagnie || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de voyage
const TypeVoyageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de voyage</label>
      <select
        name="type_voyage"
        className="form-control"
        value={postData?.type_voyage || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="affaires">Voyage d'affaires</option>
        <option value="touristique">Touristique</option>
        <option value="familial">Familial</option>
        <option value="romantique">Romantique</option>
        <option value="gastronomique">Gastronomique</option>
      </select>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const VoyagesFields = (props) => {
  const { step } = props;
  
  const customComponents = {
    // Campos comunes para todos los viajes
    'destination': <DestinationField {...props} />,
    'duree': <DureeField {...props} />,
    'date_depart': <DateDepartField {...props} />,
    'date_retour': <DateRetourField {...props} />,
    'nombre_personnes': <NombrePersonnesField {...props} />,
    'transport': <TransportField {...props} />,
    'hebergement': <HebergementField {...props} />,
    'activites_incluses': <ActivitesInclusesField {...props} />,
    'type_hebergement': <TypeHebergementField {...props} />,
    'capacite': <CapaciteField {...props} />,
    'equipements': <EquipementsField {...props} />,
    'proximite': <ProximiteField {...props} />,
    'type_pelerinage': <TypePelerinageField {...props} />,
    'groupe': <GroupeField {...props} />,
    'hotel_makkah': <HotelMakkahField {...props} />,
    'hotel_madinah': <HotelMadinahField {...props} />,
    'vols': <VolsField {...props} />,
    'type_sejour': <TypeSejourField {...props} />,
    'categorie_hotel': <CategorieHotelField {...props} />,
    'nom_bateau': <NomBateauField {...props} />,
    'cabine': <CabineField {...props} />,
    'compagnie': <CompagnieField {...props} />,
    'type_voyage': <TypeVoyageField {...props} />
  };
  
  const additionalFields = {
    components: customComponents,
  };
  
  if (step) {
    return (
      <BaseCategoryField
        {...props}
        step={step}
        additionalFields={additionalFields}
      />
    );
  }
  
  return null;
};

export default VoyagesFields;