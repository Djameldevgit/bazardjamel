// 📂 src/pages/hierarchical/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { getPostsByCategory } from '../../redux/actions/postCategoryAction';
import Posts from '../../components/home/Posts';

// Importar sliders específicos
import SliderElectromenager from '../../components/SlidersCategories/SlidersElectromenagers';
import SliderVehicules from '../../components/SlidersCategories/SliderVehicules';
import SliderImmobiler from '../../components/SlidersCategories/SliderImmobiler';
import SliderVetements from '../../components/SlidersCategories/SliderVetements'; // ✅ AGREGADO
import SliderTelephones from '../../components/SlidersCategories/SliderTelephones'; // ✅ AGREGADO
import SliderInformatique from '../../components/SlidersCategories/SliderInformatiques'; // ✅ AGREGADO
import SliderPiecesDetachees from '../../components/SlidersCategories/SliderPiecesDetaches'; // ✅ AGREGADO
import SliderSanteBeaute from '../../components/SlidersCategories/SliderSanteBeaute'; // ✅ AGREGADO
import SliderMeubles from '../../components/SlidersCategories/SliderMuebles'; // ✅ AGREGADO
import SliderLoisirs from '../../components/SlidersCategories/SliderLoisir'; // ✅ AGREGADO
import SliderSport from '../../components/SlidersCategories/SliderSport'; // ✅ AGREGADO
import SliderAlimentaires from '../../components/SlidersCategories/SliderAlimentaires'; // ✅ AGREGADO
import SliderServices from '../../components/SlidersCategories/SliderServices'; // ✅ AGREGADO
import SliderMateriaux from '../../components/SlidersCategories/SliderMateriaux'; // ✅ AGREGADO
import SliderVoyages from '../../components/SlidersCategories/SliderVoyages'; // ✅ AGREGADO
import SliderEmploi from '../../components/SlidersCategories/SliderEmploi'; // ✅ AGREGADO
import SliderBoutiques from '../../components/SlidersCategories/SliderBoutiques'; // ✅ AGREGADO

const CategoryPage = () => {
  const { categorySlug, page = "1" } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { 
    post = {}, 
    homePosts = {}
  } = useSelector(state => state);

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  
  // Mapa de sliders por categoría (ACTUALIZADO con todas las categorías)
  const sliderMap = {
    'electromenager': SliderElectromenager,
    'vehicules': SliderVehicules,
    'immobilier': SliderImmobiler,
    'vetements': SliderVetements, // ✅ AGREGADO
    'telephones': SliderTelephones, // ✅ AGREGADO
    'informatique': SliderInformatique, // ✅ AGREGADO
    'pieces-detachees': SliderPiecesDetachees, // ✅ AGREGADO
    'sante-beaute': SliderSanteBeaute, // ✅ AGREGADO
    'meubles': SliderMeubles, // ✅ AGREGADO
    'loisirs': SliderLoisirs, // ✅ AGREGADO
    'sport': SliderSport, // ✅ AGREGADO
    'alimentaires': SliderAlimentaires, // ✅ AGREGADO
    'services': SliderServices, // ✅ AGREGADO
    'materiaux': SliderMateriaux, // ✅ AGREGADO
    'voyages': SliderVoyages, // ✅ AGREGADO
    'emploi': SliderEmploi, // ✅ AGREGADO
    'boutiques': SliderBoutiques, // ✅ AGREGADO
  };

  useEffect(() => {
    const loadData = async () => {
      if (categorySlug) {
        setLoading(true);
        console.log(`📂 Cargando página de categoría: ${categorySlug}`);
        
        try {
          // Cargar posts de la categoría
          await dispatch(getPostsByCategory(categorySlug, parseInt(page)));
          
          // Cargar subcategorías (si es necesario para otros componentes)
          if (post.subcategories && post.subcategories[categorySlug]) {
            setSubcategories(post.subcategories[categorySlug]);
          }
        } catch (error) {
          console.error('Error loading category:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [categorySlug, page, dispatch]);

  // Manejar selección de ítem desde el slider
  const handleItemSelect = (item, hasSubcategories) => {
    if (hasSubcategories) {
      // El slider manejará las sub-subcategorías internamente
      console.log('Item con subcategorías:', item.id);
    } else {
      // Para ítems sin subcategorías: filtrar posts en la misma página
      setActiveFilter(item.id);
      
      // También puedes navegar a subcategoría si prefieres
      // history.push(`/${categorySlug}/${item.id}/1`);
    }
  };

  // Obtener título para mostrar
  const getDisplayTitle = () => {
    if (!categorySlug) return 'Categoría';
    
    return categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determinar qué slider mostrar
  const getSliderComponent = () => {
    const SliderComponent = sliderMap[categorySlug];
    
    if (SliderComponent) {
      return (
        <SliderComponent 
          onItemSelect={handleItemSelect}
        />
      );
    } else {
      // Si no hay slider específico, mostrar uno genérico o nada
      return (
        <div className="text-center p-5 border rounded bg-light">
          <p className="text-muted">Slider no disponible para esta categoría</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs="auto" className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Chargement de la catégorie...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
            <Breadcrumb.Item active>
              {getDisplayTitle()}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold mb-3">
            {getDisplayTitle()}
          </h1>
          {subcategories && subcategories.length > 0 ? (
            <p className="text-muted mb-0">
              {subcategories.length} sous-catégories disponibles
            </p>
          ) : (
            <p className="text-muted mb-0">
              Catégorie {getDisplayTitle()}
            </p>
          )}
        </Col>
      </Row>

      {/* Slider específico de la categoría */}
      <Row className="mb-5">
        <Col>
          {getSliderComponent()}
        </Col>
      </Row>

      {/* Posts con filtro activo (si hay) */}
      <Row>
        <Col>
          <Posts
            fromCategoryPage={true}
            selectedCategory={categorySlug}
            selectedSubcategory={activeFilter} // Filtro aplicado desde slider
            page={parseInt(page)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryPage;