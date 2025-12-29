import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CardBodyDescription = ({ post }) => {
  const { t } = useTranslation(['categories', 'subcategories']);
  
  // Iconos por categoría (solo emojis)
  const categoryIcons = {
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

  // Configuración de campos por categoría (todos con emojis)
  const getFieldConfig = () => {
    const { categorie, subCategory } = post;
    
    const baseFields = [
      { key: 'description', label: 'Description', icon: '📝', alwaysShow: true }
    ];

    const categoryFields = {
      immobilier: [
        { key: 'surface', label: 'Surface', icon: '📏', suffix: ' m²' },
        { key: 'pieces', label: 'Pièces', icon: '🏠' },
        { key: 'etage', label: 'Étage', icon: '🏢' },
        { key: 'anneeConstruction', label: 'Année construction', icon: '📅' },
        { key: 'meuble', label: 'Meublé', icon: '🛋️', isBoolean: true },
        { key: 'jardin', label: 'Jardin', icon: '🌳', isBoolean: true },
        { key: 'parking', label: 'Parking', icon: '🚗', isBoolean: true },
        { key: 'ascenseur', label: 'Ascenseur', icon: '⬆️', isBoolean: true }
      ],
      vehicules: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'modele', label: 'Modèle', icon: '🚙' },
        { key: 'annee', label: 'Année', icon: '📅' },
        { key: 'kilometrage', label: 'Kilométrage', icon: '📊', suffix: ' km' },
        { key: 'carburant', label: 'Carburant', icon: '⛽' },
        { key: 'boiteVitesse', label: 'Boîte vitesse', icon: '⚙️' },
        { key: 'couleur', label: 'Couleur', icon: '🎨' },
        { key: 'etat', label: 'État', icon: '✅' }
      ],
      telephones: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'modele', label: 'Modèle', icon: '📱' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'capacite', label: 'Capacité', icon: '💾', suffix: ' GB' },
        { key: 'couleur', label: 'Couleur', icon: '🎨' },
        { key: 'garantie', label: 'Garantie', icon: '🛡️', isBoolean: true }
      ],
      informatique: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'modele', label: 'Modèle', icon: '💻' },
        { key: 'processeur', label: 'Processeur', icon: '⚡' },
        { key: 'ram', label: 'RAM', icon: '🧠', suffix: ' GB' },
        { key: 'stockage', label: 'Stockage', icon: '💾', suffix: ' GB' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'ecran', label: 'Écran', icon: '🖥️', suffix: ' pouces' }
      ],
      electromenager: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'modele', label: 'Modèle', icon: '🔌' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'puissance', label: 'Puissance', icon: '⚡', suffix: ' W' },
        { key: 'garantie', label: 'Garantie', icon: '🛡️', isBoolean: true }
      ],
      piecesDetachees: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'modele', label: 'Modèle', icon: '⚙️' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'compatible', label: 'Compatible avec', icon: '🔗' }
      ],
      vetements: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'taille', label: 'Taille', icon: '📏' },
        { key: 'couleur', label: 'Couleur', icon: '🎨' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'matiere', label: 'Matière', icon: '🧵' },
        { key: 'sexe', label: 'Sexe', icon: '👤' }
      ],
      santebeaute: [
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'typeProduit', label: 'Type produit', icon: '💄' },
        { key: 'dateExpiration', label: 'Date expiration', icon: '📅' },
        { key: 'etat', label: 'État', icon: '✅' }
      ],
      meubles: [
        { key: 'typeMeuble', label: 'Type meuble', icon: '🛋️' },
        { key: 'matiere', label: 'Matière', icon: '🌳' },
        { key: 'couleur', label: 'Couleur', icon: '🎨' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'dimensions', label: 'Dimensions', icon: '📐' }
      ],
      alimentaires: [
        { key: 'typeAliment', label: 'Type aliment', icon: '🍎' },
        { key: 'quantite', label: 'Quantité', icon: '⚖️' },
        { key: 'dateExpiration', label: 'Date expiration', icon: '📅' },
        { key: 'conditionnement', label: 'Conditionnement', icon: '📦' }
      ],
      services: [
        { key: 'experience', label: 'Expérience', icon: '📅', suffix: ' ans' },
        { key: 'disponibilite', label: 'Disponibilité', icon: '📅' },
        { key: 'zoneIntervention', label: 'Zone d\'intervention', icon: '📍' },
        { key: 'tarif', label: 'Tarif', icon: '💰', suffix: ' DZD' }
      ],
      materiaux: [
        { key: 'typeMateriau', label: 'Type matériau', icon: '🧱' },
        { key: 'quantite', label: 'Quantité', icon: '⚖️' },
        { key: 'qualite', label: 'Qualité', icon: '⭐' },
        { key: 'conditionnement', label: 'Conditionnement', icon: '📦' }
      ],
      loisirs: [
        { key: 'typeLoisir', label: 'Type loisir', icon: '🎮' },
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'etat', label: 'État', icon: '✅' },
        { key: 'ageRecommandé', label: 'Âge recommandé', icon: '👶' }
      ],
      sport: [
        { key: 'typeSport', label: 'Type sport', icon: '⚽' },
        { key: 'marque', label: 'Marque', icon: '🏷️' },
        { key: 'taille', label: 'Taille', icon: '📏' },
        { key: 'etat', label: 'État', icon: '✅' }
      ],
      voyages: [
        { key: 'destination', label: 'Destination', icon: '✈️' },
        { key: 'duree', label: 'Durée', icon: '📅', suffix: ' jours' },
        { key: 'dateDepart', label: 'Date départ', icon: '📅' },
        { key: 'typeHebergement', label: 'Type hébergement', icon: '🏨' }
      ],
      emploi: [
        { key: 'typeContrat', label: 'Type de contrat', icon: '📄' },
        { key: 'experienceRequise', label: 'Expérience requise', icon: '🎓', suffix: ' ans' },
        { key: 'salaire', label: 'Salaire', icon: '💰', suffix: ' DZD' },
        { key: 'dateDebut', label: 'Date début', icon: '📅' },
        { key: 'lieuTravail', label: 'Lieu de travail', icon: '📍' }
      ]
    };

    // Combinar campos base con campos específicos
    return [...baseFields, ...(categoryFields[categorie] || [])];
  };

  // Renderizar campo individual
  const renderField = (field) => {
    const value = post[field.key];
    
    if (!value && !field.alwaysShow) return null;
    
    if (field.isBoolean && typeof value === 'boolean') {
      return (
        <Col xs={6} md={4} className="mb-3">
          <div className="field-item">
            <div className="field-label text-muted small mb-1">
              <span className="me-1">{field.icon}</span>
              {field.label}
            </div>
            <div className="field-value">
              <Badge bg={value ? "success" : "secondary"}>
                {value ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>
        </Col>
      );
    }

    return (
      <Col xs={6} md={4} className="mb-3">
        <div className="field-item">
          <div className="field-label text-muted small mb-1">
            <span className="me-1">{field.icon}</span>
            {field.label}
          </div>
          <div className="field-value fw-medium">
            {value}{field.suffix || ''}
          </div>
        </div>
      </Col>
    );
  };

  // Renderizar sección de características especiales
  const renderFeatures = () => {
    const { categorie } = post;
    
    // Configuración de características por categoría
    const featuresConfig = {
      immobilier: [
        { key: 'climatisation', label: 'Climatisation', icon: '❄️' },
        { key: 'chauffage', label: 'Chauffage', icon: '🔥' },
        { key: 'cuisineEquipee', label: 'Cuisine équipée', icon: '🍳' },
        { key: 'internet', label: 'Internet', icon: '🌐' },
        { key: 'piscine', label: 'Piscine', icon: '🏊' },
        { key: 'terrasse', label: 'Terrasse', icon: '🌞' },
        { key: 'cave', label: 'Cave', icon: '🍷' },
        { key: 'alarme', label: 'Alarme', icon: '🚨' },
        { key: 'interphone', label: 'Interphone', icon: '📞' }
      ],
      vehicules: [
        { key: 'climatisation', label: 'Climatisation', icon: '❄️' },
        { key: 'gps', label: 'GPS', icon: '📍' },
        { key: 'airbag', label: 'Airbag', icon: '🛡️' },
        { key: 'toitOuvrant', label: 'Toit ouvrant', icon: '☀️' },
        { key: 'regulateurVitesse', label: 'Régulateur vitesse', icon: '⚡' },
        { key: 'cameraRecul', label: 'Caméra recul', icon: '📷' }
      ],
      meubles: [
        { key: 'montage', label: 'Montage inclus', icon: '🔧' },
        { key: 'livraison', label: 'Livraison possible', icon: '🚚' },
        { key: 'personnalisable', label: 'Personnalisable', icon: '🎨' }
      ]
    };

    const features = featuresConfig[categorie];
    if (!features) return null;

    const activeFeatures = features.filter(f => post[f.key]);
    if (activeFeatures.length === 0) return null;

    // Títulos por categoría
    const sectionTitles = {
      immobilier: 'Équipements & Services',
      vehicules: 'Équipements & Options',
      meubles: 'Services additionnels'
    };

    return (
      <div className="features-section mt-4">
        <h6 className="section-title mb-3">
          <span className="me-2">⭐</span>
          {sectionTitles[categorie] || 'Caractéristiques'}
        </h6>
        <div className="features-list d-flex flex-wrap gap-2">
          {activeFeatures.map(feature => (
            <Badge key={feature.key} bg="light" text="dark" className="feature-badge p-2">
              <span className="me-1">{feature.icon}</span>
              {feature.label}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar campos personalizados para categorías especiales
  const renderCustomFields = () => {
    const { categorie } = post;
    
    if (categorie === 'immobilier') {
      return (
        <div className="custom-fields mt-3">
          <div className="row">
            {/* Campos adicionales para immobilier */}
            {post.orientation && (
              <Col xs={6} md={4} className="mb-3">
                <div className="field-item">
                  <div className="field-label text-muted small mb-1">
                    <span className="me-1">🧭</span>
                    Orientation
                  </div>
                  <div className="field-value fw-medium">{post.orientation}</div>
                </div>
              </Col>
            )}
            {post.vue && (
              <Col xs={6} md={4} className="mb-3">
                <div className="field-item">
                  <div className="field-label text-muted small mb-1">
                    <span className="me-1">🌅</span>
                    Vue
                  </div>
                  <div className="field-value fw-medium">{post.vue}</div>
                </div>
              </Col>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const fields = getFieldConfig();

  return (
    <div className="card-body-description">
      {/* Icono de categoría y título */}
      <div className="category-header mb-4">
        <div className="d-flex align-items-center">
          <div className="category-icon-display me-3" style={{ fontSize: '2.5rem' }}>
            {categoryIcons[post.categorie] || '📋'}
          </div>
          <div>
            <h5 className="category-name mb-1">
              {t(post.categorie, { ns: 'categories' }) || post.categorie}
            </h5>
            {post.subCategory && (
              <div className="subcategory-name text-muted">
                <small>
                  {t(`${post.categorie}.categories.${post.subCategory}`, { ns: 'subcategories' }) || post.subCategory}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campos principales */}
      <Row className="g-3">
        {fields.map(field => renderField(field))}
      </Row>

      {/* Campos personalizados */}
      {renderCustomFields()}

      {/* Características especiales */}
      {renderFeatures()}

      {/* Descripción completa */}
      {post.description && (
        <div className="description-section mt-4">
          <h6 className="section-title mb-3">
            <span className="me-2">📝</span>
            Description détaillée
          </h6>
          <div className="description-content p-3 bg-light rounded">
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{post.description}</p>
          </div>
        </div>
      )}

      {/* Información adicional si existe */}
      {(post.notes || post.remarques) && (
        <div className="additional-info mt-4">
          <h6 className="section-title mb-3">
            <span className="me-2">💡</span>
            Informations supplémentaires
          </h6>
          <div className="additional-content p-3 bg-warning bg-opacity-10 rounded">
            <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
              {post.notes || post.remarques}
            </p>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .card-body-description {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .category-header {
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .category-icon-display {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .category-name {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .subcategory-name {
          font-size: 0.9rem;
        }
        
        .field-item {
          border-left: 3px solid #0d6efd;
          padding-left: 12px;
          transition: all 0.2s ease;
          height: 100%;
        }
        
        .field-item:hover {
          border-left-color: #0b5ed7;
          background-color: #f8f9ff;
          padding-left: 15px;
        }
        
        .field-label {
          font-size: 0.8rem;
          letter-spacing: 0.3px;
          color: #6c757d;
        }
        
        .field-value {
          font-size: 1.05rem;
          color: #212529;
          font-weight: 600;
        }
        
        .section-title {
          color: #495057;
          border-bottom: 2px solid #f8f9fa;
          padding-bottom: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .feature-badge {
          font-size: 0.85rem;
          border: 1px solid #dee2e6;
          transition: all 0.2s ease;
        }
        
        .feature-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .description-content {
          line-height: 1.7;
          font-size: 0.95rem;
          color: #4a5568;
        }
        
        .additional-content {
          border-left: 4px solid #ffc107;
          font-size: 0.9rem;
          color: #856404;
        }
        
        /* Animaciones */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .field-item, .features-section, .description-section {
          animation: fadeInUp 0.3s ease forwards;
          animation-delay: calc(var(--item-index, 0) * 0.05s);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .category-name {
            font-size: 1.2rem;
          }
          
          .category-icon-display {
            font-size: 2rem;
          }
          
          .field-item {
            padding-left: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CardBodyDescription;