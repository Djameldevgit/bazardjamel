import SliderVehicule from './SliderVehicules';
import SliderVetements from './SliderVetements';
import SliderTelephones from './SliderTelephones';
import SliderInformatiques from './SliderInformatiques';
import SliderElectromenager from './SlidersElectromenagers';
import SliderPiecesDetachees from './SliderPiecesDetaches';
import SliderSanteBeaute from './SliderSanteBeaute';
import SliderMeubles from './SliderMuebles';
import SliderLoisirs from './SliderLoisir';
 
 
import SliderSport from './SliderSport';
import SliderAlimentaires from './SliderAlimentaires';
import SliderServices from './SliderServices';
import SliderMateriaux from './SliderMateriaux';
import SliderVoyages from './SliderVoyages';
import SliderEmploi from './SliderEmploi';
import SliderImmobilerOperations from './SliderImmobilerOperations';
import SliderImmobilerProperties from './SliderImmobilersProperties';
 
import SliderStores from './SliderStores';
 
import CategorySlderEmoji from './CategorySlderEmoji';


const DynamicCategorySlider = ({ categoryName }) => {
  // Base de datos de coincidencias de categorías - COMPLETA Y ACTUALIZADA
  const categoryDatabase = {
    // Vehículos
    'vehicules': {
      component: SliderVehicule,
      variations: [
        'automobiles', 'vehicules', 'véhicules', 'vehicles',
        'voitures', 'motos', 'voiture', 'vehicle', 'carros',
        'coches', 'autos', 'cars', 'automóviles', 'transport',
        'automobiles & véhicules', 'automobiles et véhicules'
      ]
    },

    // Vestimenta
    'vetements': {
      component: SliderVetements,
      variations: [
        'vetements', 'vêtements', 'mode', 'clothing',
        'clothes', 'fashion', 'ropa', 'vestimenta',
        'prendas', 'habillement', 'kleidung', 'apparel',
        'vêtements & mode', 'vetements et mode'
      ]
    },

    // Teléfonos
    'telephones': {
      component: SliderTelephones,
      variations: [
        'telephones', 'téléphones', 'smartphones', 'phone',
        'mobile', 'smartphone', 'celulares', 'móviles',
        'teléfonos', 'handy', 'telefono', 'cellphone', 'mobilephone',
        'téléphones & accessoires', 'telephones et accessoires'
      ]
    },

    // Informática
    'informatique': {
      component: SliderInformatiques,
      variations: [
        'informatique', 'informática', 'computación', 'technology',
        'tech', 'computers', 'ordenadores', 'computer', 'computadora',
        'it', 'informatic', 'informatica'
      ]
    },

    // Electromenager
    'electromenager': {
      component: SliderElectromenager,
      variations: [
        'electromenager', 'électroménager', 'electrodomésticos',
        'appliances', 'home_appliances', 'electrodomesticos',
        'electro', 'appareils', 'homeappliances', 'electrodomestico',
        'électroménager & électronique', 'electromenager et electronique'
      ]
    },

    // Pièces Détachées
    'piecesdetachees': {
      component: SliderPiecesDetachees,
      variations: [
        'piecesdetachees', 'pièces détachées', 'pieces_detachees',
        'repuestos', 'spareparts', 'piezas', 'recambios',
        'auto parts', 'car parts', 'partes', 'componentes',
        'pièces détachées'
      ]
    },

    // Santé & Beauté
    'santebeaute': {
      component: SliderSanteBeaute,
      variations: [
        'santebeaute', 'santé & beauté', 'santebeaute',
        'salud-belleza', 'beauty', 'cosmeticos', 'cosmétiques',
        'beauté', 'healthbeauty', 'salud y belleza', 'cosmetics',
        'santé & beauté', 'sante et beaute'
      ]
    },

    // Meubles & Maison
    'meubles': {
      component: SliderMeubles,
      variations: [
        'meubles', 'meubles-maison', 'meubles_maison',
        'muebles', 'furniture', 'mobiliario', 'homefurniture',
        'mobili', 'mobilier', 'home decor', 'decoracion',
        'meubles & maison', 'meubles et maison'
      ]
    },

    // Loisirs & Divertissements
    'loisirs': {
      component: SliderLoisirs,
      variations: [
        'loisirs', 'loisirs-divertissements', 'loisirs_divertissements',
        'ocio', 'entretenimiento', 'hobbies', 'entretenimento',
        'entertainment', 'leisure', 'recreation', 'diversión',
        'loisirs & divertissements', 'loisirs et divertissements'
      ]
    },

    // Sport
    'sport': {
      component: SliderSport,
      variations: [
        'sport', 'sports', 'deportes', 'deporte',
        'athletics', 'athlétisme', 'esportes', 'esport',
        'sports', 'deporte'
      ]
    },

    // Alimentaires
    'alimentaires': {
      component: SliderAlimentaires,
      variations: [
        'alimentaires', 'alimentos', 'food', 'comida',
        'nourriture', 'alimentación', 'alimentation',
        'grocery', 'épicerie', 'supermercado',
        'alimentaires'
      ]
    },

    // Services
    'services': {
      component: SliderServices,
      variations: [
        'services', 'servicios', 'service', 'servicio',
        'professional services', 'serviços', 'servicii',
        'professional', 'professionnel', 'profesional',
        'services'
      ]
    },

    // Materiaux & Équipement
    'materiaux': {
      component: SliderMateriaux,
      variations: [
        'materiaux', 'materiales', 'materials', 'equipment',
        'matériaux & équipement', 'materiales y equipos',
        'construction materials', 'materiales de construcción'
      ]
    },

    // Voyages
    'voyages': {
      component: SliderVoyages,
      variations: [
        'voyages', 'viajes', 'travel', 'trips',
        'travels', 'voyage', 'viaje', 'turismo',
        'tourism', 'traveling'
      ]
    },

    // Emploi
    'emploi': {
      component: SliderEmploi,
      variations: [
        'emploi', 'empleo', 'job', 'jobs',
        'employment', 'trabajo', 'work',
        'empleos', 'travail', 'empleos'
      ]
    },

    'stores': {
      component: SliderStores,
      variations: [
        'stores', 'store', 'boutiques', 'boutique',
        'tiendas', 'tienda', 'shops', 'shop',
        'magasins', 'magasin', 'comercios', 'comercio',
        'negocios', 'negocio', 'businesses', 'business',
        'empresas', 'empresa', 'marques', 'marque',
        'brands', 'brand', 'marcas', 'marca'
      ]
    }





  };

  // Base de datos especial para immobiler con dos niveles
  const immobilierDatabase = {
    // Operaciones (primer nivel)
    'operations': {
      component: SliderImmobilerOperations,
      variations: ['immobilier']
    },
    // Tipos de propiedades (segundo nivel)
    'vente': {
      component: SliderImmobilerProperties,
      displayName: 'Vente'
    },
    'location': {
      component: SliderImmobilerProperties,
      displayName: 'Location'
    },
    'location_vacances': {
      component: SliderImmobilerProperties,
      displayName: 'Location Vacances'
    },
    'cherche_location': {
      component: SliderImmobilerProperties,
      displayName: 'Cherche Location'
    },
    'cherche_achat': {
      component: SliderImmobilerProperties,
      displayName: 'Cherche Achat'
    }
  };
  // Función para normalizar texto
  const normalizeText = (text) => {
    if (!text) return '';

    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '');
  };

  // Función para determinar si estamos en un caso de immobiler
  const isImmobilierCase = (category) => {
    const normalized = normalizeText(category);

    // Verificar si es immobiler directamente
    if (normalized === 'immobilier') return { isImmobilier: true, level: 'operations' };

    // Verificar operaciones de immobiler
    const immobilierOperations = ['vente', 'location', 'location_vacances', 'cherche_location', 'cherche_achat'];
    if (immobilierOperations.includes(normalized)) {
      return { isImmobilier: true, level: 'property', operation: normalized };
    }

    return { isImmobilier: false };
  };

  // Función para buscar categoría
  const findCategory = (category) => {
    if (!category) return null;

    const normalizedCategory = normalizeText(category);

    // 1. Verificar si es un caso especial de immobiler
    const immobilierCheck = isImmobilierCase(normalizedCategory);
    if (immobilierCheck.isImmobilier) {
      if (immobilierCheck.level === 'operations') {
        return {
          component: immobilierDatabase.operations.component,
          isImmobilier: true,
          level: 'operations'
        };
      } else if (immobilierCheck.level === 'property' && immobilierCheck.operation) {
        return {
          component: immobilierDatabase[immobilierCheck.operation]?.component || SliderImmobilerProperties,
          isImmobilier: true,
          level: 'property',
          operation: immobilierCheck.operation
        };
      }
    }

    // 2. Buscar en categorías normales (para otras categorías)
    if (categoryDatabase[normalizedCategory]) {
      return {
        component: categoryDatabase[normalizedCategory].component,
        isImmobilier: false
      };
    }

    // 3. Buscar por variaciones
    for (const [key, data] of Object.entries(categoryDatabase)) {
      if (normalizeText(key) === normalizedCategory) {
        return {
          component: data.component,
          isImmobilier: false
        };
      }

      const hasExactVariation = data.variations.some(variation =>
        normalizeText(variation) === normalizedCategory
      );

      if (hasExactVariation) {
        return {
          component: data.component,
          isImmobilier: false
        };
      }
    }

    return null;
  };

  const categoryInfo = findCategory(categoryName);

  if (!categoryInfo) {
    // Mostrar slider general
    return (
      <div className="dynamic-slider-container">
        <div className="slider-info mb-3">
          <h5 className="text-muted">
            <i className="fas fa-arrow-right me-2"></i>
            Explorando: {categoryName}
          </h5>
        </div>
        <CategorySlderEmoji/>
      </div>
    );
  }

  // Determinar el título según el tipo de categoría
  // Determinar el título según el tipo de categoría
  

  const getTitle = () => {
    if (categoryInfo.isImmobilier) {
      if (categoryInfo.level === 'operations') {
        return 'Type de transaction immobilière';
      } else if (categoryInfo.level === 'property') {
        const operationName = categoryInfo.operation
          ? immobilierDatabase[categoryInfo.operation]?.displayName || categoryInfo.operation
          : 'Immobilier';
        return `Type de bien pour ${operationName}`;
      }
    }

    // Caso especial para stores/boutiques
    const normalizedCategory = normalizeText(categoryName);
    if (normalizedCategory === 'stores' || normalizedCategory === 'boutiques') {
      return 'Boutiques par catégorie';
    }

    return `Subcategorías de ${categoryName}`;
  };

  // Determinar el icono según el tipo
  const getIcon = () => {
    if (categoryInfo.isImmobilier) {
      return categoryInfo.level === 'operations' ? '🏠' : '🏘️';
    }

    // Caso especial para stores/boutiques
    const normalizedCategory = normalizeText(categoryName);
    if (normalizedCategory === 'stores' || normalizedCategory === 'boutiques') {
      return '🏪';
    }

    return 'fas fa-layer-group';
  };
  return (
    <div className="dynamic-slider-container">
      <div className="slider-info mb-3">
        <h5 className="text-primary">
          {categoryInfo.isImmobilier && typeof getIcon() === 'string' ? (
            <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
              {getIcon()}
            </span>
          ) : (
            <i className={`${getIcon()} me-2`}></i>
          )}
          {getTitle()}
        </h5>
      </div>

      {/* Renderizar el componente adecuado */}
      {categoryInfo.isImmobilier ? (
        <categoryInfo.component />
      ) : (
        <categoryInfo.component />
      )}
    </div>
  );
};

export default DynamicCategorySlider;