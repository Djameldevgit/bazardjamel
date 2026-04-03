// 📂 components/CATEGORIES/specificFields/MeublesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE MEUBLES & MAISON (STEP 2)
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    'IKEA', 'But', 'Conforama', 'Roche Bobois', 'Maisons du Monde',
    'Alinéa', 'Habitat', 'Fly', 'Mobilier de France', 'Demeyere',
    'Ligne Roset', 'Togo', 'Leroy Merlin', 'Castorama', 'Brico Dépôt',
    'Villeroy & Boch', 'Arc International', 'Sevres', 'Christofle',
    'Décor Paris', 'Autre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <select
        name="marque"
        className="form-control"
        value={postData?.marque || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la marque</option>
        {marques.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
};

// Modèle / Nom du produit
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle / Nom</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: Table MALM, Canapé MANSTAD..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Matière / Matériau
const MatiereField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matière / Matériau</label>
      <select
        name="matiere"
        className="form-control"
        value={postData?.matiere || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Bois massif">Bois massif</option>
        <option value="Bois aggloméré">Bois aggloméré</option>
        <option value="MDF">MDF</option>
        <option value="Contreplaqué">Contreplaqué</option>
        <option value="Métal">Métal</option>
        <option value="Verre">Verre</option>
        <option value="Plastique">Plastique</option>
        <option value="Résine">Résine</option>
        <option value="Céramique">Céramique</option>
        <option value="Tissu">Tissu</option>
        <option value="Cuir">Cuir</option>
        <option value="Velours">Velours</option>
        <option value="Lin">Lin</option>
        <option value="Coton">Coton</option>
        <option value="Polyester">Polyester</option>
        <option value="Laine">Laine</option>
        <option value="Rotin">Rotin</option>
        <option value="Osier">Osier</option>
      </select>
    </div>
  );
};

// Couleur
const CouleurField = ({ postData, handleChangeInput }) => {
  const couleurs = [
    'Blanc', 'Noir', 'Gris', 'Beige', 'Marron', 'Chêne', 'Noyer',
    'Blanc cassé', 'Crème', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange',
    'Rose', 'Violet', 'Bordeaux', 'Kaki', 'Multicolore'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Couleur</label>
      <select
        name="couleur"
        className="form-control"
        value={postData?.couleur || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la couleur</option>
        {couleurs.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};

// État
const EtatField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">État</label>
      <select
        name="etat"
        className="form-control"
        value={postData?.etat || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Neuf (avec emballage)">Neuf (avec emballage)</option>
        <option value="Neuf (sans emballage)">Neuf (sans emballage)</option>
        <option value="Comme neuf">Comme neuf</option>
        <option value="Très bon état">Très bon état</option>
        <option value="Bon état">Bon état</option>
        <option value="État moyen">État moyen</option>
        <option value="À restaurer">À restaurer</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA MEUBLES
// ============================================

// Dimensions
const DimensionsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Dimensions</label>
      <div className="row g-2">
        <div className="col-4">
          <input
            type="number"
            name="longueur"
            className="form-control"
            placeholder="L (cm)"
            value={postData?.longueur || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-4">
          <input
            type="number"
            name="largeur"
            className="form-control"
            placeholder="l (cm)"
            value={postData?.largeur || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-4">
          <input
            type="number"
            name="hauteur"
            className="form-control"
            placeholder="H (cm)"
            value={postData?.hauteur || ''}
            onChange={handleChangeInput}
          />
        </div>
      </div>
    </div>
  );
};

// Type de meuble
const TypeMeubleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de meuble</label>
      <select
        name="type_meuble"
        className="form-control"
        value={postData?.type_meuble || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Canapé">Canapé</option>
        <option value="Fauteuil">Fauteuil</option>
        <option value="Table">Table</option>
        <option value="Chaise">Chaise</option>
        <option value="Tabouret">Tabouret</option>
        <option value="Armoire">Armoire</option>
        <option value="Commode">Commode</option>
        <option value="Buffet">Buffet</option>
        <option value="Bibliothèque">Bibliothèque</option>
        <option value="Étagère">Étagère</option>
        <option value="Bureau">Bureau</option>
        <option value="Lit">Lit</option>
        <option value="Matelas">Matelas</option>
        <option value="Sommier">Sommier</option>
        <option value="Tête de lit">Tête de lit</option>
        <option value="Table de nuit">Table de nuit</option>
        <option value="Meuble TV">Meuble TV</option>
        <option value="Meuble salle de bain">Meuble salle de bain</option>
        <option value="Meuble cuisine">Meuble cuisine</option>
        <option value="Meuble jardin">Meuble jardin</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA DÉCORATION
// ============================================

// Type de décoration
const TypeDecorationField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de décoration</label>
      <select
        name="type_decoration"
        className="form-control"
        value={postData?.type_decoration || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Cadre">Cadre</option>
        <option value="Tableau">Tableau</option>
        <option value="Miroir">Miroir</option>
        <option value="Horloge">Horloge</option>
        <option value="Vase">Vase</option>
        <option value="Bougie">Bougie</option>
        <option value="Luminaire">Luminaire</option>
        <option value="Plante artificielle">Plante artificielle</option>
        <option value="Coussin">Coussin</option>
        <option value="Plaid">Plaid</option>
        <option value="Rideau">Rideau</option>
        <option value="Tapis">Tapis</option>
        <option value="Statue">Statue</option>
        <option value="Mobile">Mobile</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA VAISSELLE
// ============================================

// Type de vaisselle
const TypeVaisselleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de vaisselle</label>
      <select
        name="type_vaisselle"
        className="form-control"
        value={postData?.type_vaisselle || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Assiette">Assiette</option>
        <option value="Bol">Bol</option>
        <option value="Verre">Verre</option>
        <option value="Tasse">Tasse</option>
        <option value="Mug">Mug</option>
        <option value="Couverts">Couverts</option>
        <option value="Casserole">Casserole</option>
        <option value="Poêle">Poêle</option>
        <option value="Plat">Plat</option>
        <option value="Saladier">Saladier</option>
        <option value="Service à thé">Service à thé</option>
        <option value="Service à café">Service à café</option>
        <option value="Carafe">Carafe</option>
        <option value="Pichet">Pichet</option>
      </select>
    </div>
  );
};

// Matière vaisselle
const MatiereVaisselleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matière</label>
      <select
        name="matiere_vaisselle"
        className="form-control"
        value={postData?.matiere_vaisselle || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Céramique">Céramique</option>
        <option value="Porcelaine">Porcelaine</option>
        <option value="Faïence">Faïence</option>
        <option value="Verre">Verre</option>
        <option value="Cristal">Cristal</option>
        <option value="Acier inoxydable">Acier inoxydable</option>
        <option value="Fonte">Fonte</option>
        <option value="Bois">Bois</option>
        <option value="Plastique">Plastique</option>
        <option value="Mélaminé">Mélaminé</option>
      </select>
    </div>
  );
};

// Nombre de pièces (service)
const NbPiecesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de pièces</label>
      <input
        type="number"
        name="nb_pieces"
        className="form-control"
        placeholder="Ex: 12, 24, 36..."
        value={postData?.nb_pieces || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA LITERIE & LINGE
// ============================================

// Taille literie
const TailleLiterieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille</label>
      <select
        name="taille_literie"
        className="form-control"
        value={postData?.taille_literie || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="90x190 cm (1 personne)">90x190 cm (1 personne)</option>
        <option value="140x190 cm (2 personnes)">140x190 cm (2 personnes)</option>
        <option value="160x200 cm (Queen)">160x200 cm (Queen)</option>
        <option value="180x200 cm (King)">180x200 cm (King)</option>
        <option value="200x200 cm (Super King)">200x200 cm (Super King)</option>
        <option value="Bébé 60x120">Bébé 60x120</option>
        <option value="Enfant 80x160">Enfant 80x160</option>
      </select>
    </div>
  );
};

// Type de literie
const TypeLiterieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de literie</label>
      <select
        name="type_literie"
        className="form-control"
        value={postData?.type_literie || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Draps">Draps</option>
        <option value="Housse de couette">Housse de couette</option>
        <option value="Taies d'oreiller">Taies d'oreiller</option>
        <option value="Couverture">Couverture</option>
        <option value="Couette">Couette</option>
        <option value="Oreiller">Oreiller</option>
        <option value="Surmatelas">Surmatelas</option>
        <option value="Protège-matelas">Protège-matelas</option>
        <option value="Serviettes">Serviettes</option>
        <option value="Nappe">Nappe</option>
        <option value="Torchons">Torchons</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA PUÉRICULTURE
// ============================================

// Type de produit puériculture
const TypePuéricultureField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <select
        name="type_puericulture"
        className="form-control"
        value={postData?.type_puericulture || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Lit bébé">Lit bébé</option>
        <option value="Table à langer">Table à langer</option>
        <option value="Chaise haute">Chaise haute</option>
        <option value="Poussette">Poussette</option>
        <option value="Siège auto">Siège auto</option>
        <option value="Baignoire">Baignoire</option>
        <option value="Parc bébé">Parc bébé</option>
        <option value="Trotteur">Trotteur</option>
        <option value="Moniteur bébé">Moniteur bébé</option>
        <option value="Veilleuse">Veilleuse</option>
        <option value="Jouet éveil">Jouet éveil</option>
        <option value="Vêtements bébé">Vêtements bébé</option>
        <option value="Biberons">Biberons</option>
        <option value="Tire-lait">Tire-lait</option>
        <option value="Chauffe-biberon">Chauffe-biberon</option>
        <option value="Stérilisateur">Stérilisateur</option>
      </select>
    </div>
  );
};

// Âge bébé
const AgeBebeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Âge recommandé</label>
      <select
        name="age_bebe"
        className="form-control"
        value={postData?.age_bebe || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="0-3 mois">0-3 mois</option>
        <option value="3-6 mois">3-6 mois</option>
        <option value="6-9 mois">6-9 mois</option>
        <option value="9-12 mois">9-12 mois</option>
        <option value="12-18 mois">12-18 mois</option>
        <option value="18-24 mois">18-24 mois</option>
        <option value="2-3 ans">2-3 ans</option>
        <option value="3-5 ans">3-5 ans</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA RIDEAUX & TAPIS
// ============================================

// Dimensions rideaux
const DimensionsRideauxField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Dimensions</label>
      <div className="row g-2">
        <div className="col-6">
          <input
            type="number"
            name="largeur_rideau"
            className="form-control"
            placeholder="Largeur (cm)"
            value={postData?.largeur_rideau || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-6">
          <input
            type="number"
            name="longueur_rideau"
            className="form-control"
            placeholder="Longueur (cm)"
            value={postData?.longueur_rideau || ''}
            onChange={handleChangeInput}
          />
        </div>
      </div>
    </div>
  );
};

// Dimensions tapis
const DimensionsTapisField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Dimensions</label>
      <div className="row g-2">
        <div className="col-6">
          <input
            type="number"
            name="largeur_tapis"
            className="form-control"
            placeholder="Largeur (cm)"
            value={postData?.largeur_tapis || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-6">
          <input
            type="number"
            name="longueur_tapis"
            className="form-control"
            placeholder="Longueur (cm)"
            value={postData?.longueur_tapis || ''}
            onChange={handleChangeInput}
          />
        </div>
      </div>
    </div>
  );
};

// Forme tapis
const FormeTapisField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Forme</label>
      <select
        name="forme_tapis"
        className="form-control"
        value={postData?.forme_tapis || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Rectangulaire">Rectangulaire</option>
        <option value="Carré">Carré</option>
        <option value="Rond">Rond</option>
        <option value="Ovale">Ovale</option>
        <option value="Couloir">Couloir</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA MEUBLES DE BUREAU
// ============================================

// Type de meuble bureau
const TypeMeubleBureauField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de mobilier</label>
      <select
        name="type_meuble_bureau"
        className="form-control"
        value={postData?.type_meuble_bureau || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Bureau">Bureau</option>
        <option value="Fauteuil de bureau">Fauteuil de bureau</option>
        <option value="Chaise de bureau">Chaise de bureau</option>
        <option value="Armoire de bureau">Armoire de bureau</option>
        <option value="Étagère de bureau">Étagère de bureau</option>
        <option value="Classeur">Classeur</option>
        <option value="Table de réunion">Table de réunion</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA FOURNITURES SCOLAIRES
// ============================================

// Type de fourniture
const TypeFournitureField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de fourniture</label>
      <select
        name="type_fourniture"
        className="form-control"
        value={postData?.type_fourniture || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Cartable">Cartable</option>
        <option value="Sac à dos">Sac à dos</option>
        <option value="Trousse">Trousse</option>
        <option value="Cahier">Cahier</option>
        <option value="Stylo">Stylo</option>
        <option value="Crayon">Crayon</option>
        <option value="Marqueur">Marqueur</option>
        <option value="Gomme">Gomme</option>
        <option value="Règle">Règle</option>
        <option value="Calculatrice">Calculatrice</option>
        <option value="Lot">Lot de fournitures</option>
      </select>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const MeublesFields = (props) => {
  const { step } = props;
  
  const customComponents = {
    // Campos comunes
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'matiere': <MatiereField {...props} />,
    'couleur': <CouleurField {...props} />,
    'etat': <EtatField {...props} />,
    
    // Meubles
    'dimensions': <DimensionsField {...props} />,
    'type_meuble': <TypeMeubleField {...props} />,
    
    // Décoration
    'type_decoration': <TypeDecorationField {...props} />,
    
    // Vaisselle
    'type_vaisselle': <TypeVaisselleField {...props} />,
    'matiere_vaisselle': <MatiereVaisselleField {...props} />,
    'nb_pieces': <NbPiecesField {...props} />,
    
    // Literie
    'taille_literie': <TailleLiterieField {...props} />,
    'type_literie': <TypeLiterieField {...props} />,
    
    // Puériculture
    'type_puericulture': <TypePuéricultureField {...props} />,
    'age_bebe': <AgeBebeField {...props} />,
    
    // Rideaux
    'dimensions_rideaux': <DimensionsRideauxField {...props} />,
    
    // Tapis
    'dimensions_tapis': <DimensionsTapisField {...props} />,
    'forme_tapis': <FormeTapisField {...props} />,
    
    // Bureau
    'type_meuble_bureau': <TypeMeubleBureauField {...props} />,
    
    // Fournitures scolaires
    'type_fourniture': <TypeFournitureField {...props} />
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

export default MeublesFields;