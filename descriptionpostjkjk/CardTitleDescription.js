import React from 'react';
import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CardTitleDescription = ({ post }) => {
  const { t } = useTranslation(['categories', 'subcategories']);
  
  // Mapeo de emojis por categoría
  const categoryEmojis = {
    'immobilier': '🏠',
    'vehicules': '🚗',
    'telephones': '📱',
    'informatique': '💻',
    'electromenager': '🔌',
    'piecesDetachees': '⚙️',
    'vetements': '👕',
    'alimentaires': '🍎',
    'santebeaute': '💄',
    'meubles': '🛋️',
    'services': '🛠️',
    'materiaux': '🧱',
    'loisirs': '🎮',
    'emploi': '💼',
    'sport': '⚽',
    'voyages': '✈️'
  };

  // Función para generar título según categoría
  const generateTitle = () => {
    const { categorie, subCategory, articleType, pieces, marque, modele, annee, etat } = post;
    const emoji = categoryEmojis[categorie] || '📋';

    switch(categorie) {
      case 'immobilier':
        const operation = articleType === 'vente' ? 'Vente' : 
                         articleType === 'location' ? 'Location' : 'Location vacances';
        const typeBien = subCategory === 'appartement' ? 'Appartement' :
                        subCategory === 'villa' ? 'Villa' :
                        subCategory === 'terrain' ? 'Terrain' : 'Local';
        
        if (subCategory === 'terrain') {
          return `${emoji} ${operation} ${typeBien} ${pieces ? ` - ${pieces} m²` : ''}`;
        }
        
        return `${emoji} ${operation} ${typeBien} ${pieces ? `F${pieces}` : ''}`;

      case 'vehicules':
        const typeVehicule = subCategory === 'automobiles' ? 'Voiture' :
                            subCategory === 'utilitaires' ? 'Utilitaire' : 'Moto';
        return `${emoji} ${typeVehicule} ${marque || ''} ${modele || ''} ${annee ? `- ${annee}` : ''}`;

      case 'telephones':
        const typePhone = subCategory === 'smartphones' ? 'Smartphone' :
                         subCategory === 'telephones_cellulaires' ? 'Téléphone cellulaire' : 'Tablette';
        return `${emoji} ${typePhone} ${marque || ''} ${modele || ''} ${etat ? `(${etat})` : ''}`;

      case 'informatique':
        const typeInfo = subCategory === 'ordinateurs_portables' ? 'PC Portable' :
                        subCategory === 'ordinateurs_bureau' ? 'PC Bureau' : 'Serveur';
        return `${emoji} ${typeInfo} ${marque || ''} ${modele || ''}`;

      case 'electromenager':
        const typeAppliance = subCategory === 'televiseurs' ? 'Téléviseur' :
                             subCategory === 'demodulateurs_box_tv' ? 'Démodulateur' : 'Parabole';
        return `${emoji} ${typeAppliance} ${marque || ''} ${modele || ''}`;

      case 'vetements':
        const typeVetement = subCategory === 'vetements_homme' ? 'Vêtement Homme' :
                            subCategory === 'vetements_femme' ? 'Vêtement Femme' : 'Chaussures';
        return `${emoji} ${typeVetement} ${marque ? `- ${marque}` : ''} ${modele ? ` ${modele}` : ''}`;

      case 'services':
        const typeService = subCategory === 'construction_travaux' ? 'Service Construction' : 'Formation';
        return `${emoji} ${typeService} - ${post.titre || ''}`;

      case 'emploi':
        const typeEmploi = subCategory === 'offres_emploi' ? 'Offre d\'emploi' : 'Demande d\'emploi';
        return `${emoji} ${typeEmploi} - ${post.titre || ''}`;

      case 'voyages':
        const typeVoyage = subCategory === 'voyage_organise' ? 'Voyage organisé' :
                          subCategory === 'location_vacances' ? 'Location vacances' : 'Hajj/Omra';
        return `${emoji} ${typeVoyage} - ${post.destination || ''}`;

      default:
        // Para otras categorías
        const categoryName = t(categorie, { ns: 'categories' }) || categorie;
        const subCatName = t(`${categorie}.categories.${subCategory}`, { ns: 'subcategories' }) || subCategory;
        
        if (marque && modele) {
          return `${emoji} ${categoryName} ${marque} ${modele}`;
        } else if (post.titre) {
          return `${emoji} ${post.titre}`;
        } else {
          return `${emoji} ${categoryName} ${subCatName ? `- ${subCatName}` : ''}`;
        }
    }
  };

  // Badge de estado/opération
  const renderBadge = () => {
    const { categorie, articleType, etat, disponibilite } = post;
    
    if (categorie === 'immobilier') {
      const badgeType = articleType === 'vente' ? 'warning' : 
                       articleType === 'location' ? 'primary' : 'info';
      const badgeText = articleType === 'vente' ? 'À VENDRE' : 
                       articleType === 'location' ? 'À LOUER' : 'VACANCES';
      return <Badge bg={badgeType} className="ms-2">{badgeText}</Badge>;
    }
    
    if (etat) {
      const badgeColors = {
        'neuf': 'success',
        'occasion': 'secondary',
        'comme neuf': 'info',
        'endommagé': 'danger'
      };
      return <Badge bg={badgeColors[etat] || 'light'} text="dark" className="ms-2">{etat.toUpperCase()}</Badge>;
    }
    
    if (disponibilite === 'disponible') {
      return <Badge bg="success" className="ms-2">DISPONIBLE</Badge>;
    }
    
    return null;
  };

  return (
    <div className="card-title-description">
      <h3 className="title mb-2">
        {generateTitle()}
        {renderBadge()}
      </h3>
      
      {/* Subtítulo con precio si existe */}
      {post.price && (
        <div className="price-display mt-2">
          <span className="price-label fw-medium">Prix:</span>
          <span className="price-value fw-bold text-primary ms-2" style={{ fontSize: '1.5rem' }}>
            {new Intl.NumberFormat('fr-FR').format(post.price)} DZD
          </span>
          {post.negociable && (
            <Badge bg="light" text="dark" className="ms-2">Négociable</Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CardTitleDescription;