// 📂 src/pages/categorySubCategory/SubcategoryPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { getPostsByCategoryHierarchy } from '../../redux/actions/postCategoryAction';
import Posts from '../../components/home/Posts';

const SubcategoryPage = () => {
  const { categorySlug, subcategorySlug, page = "1" } = useParams();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (categorySlug && subcategorySlug) {
        setLoading(true);
        console.log(`📂 Nivel 2 - Cargando: ${categorySlug}/${subcategorySlug}`);
        
        try {
          await dispatch(getPostsByCategoryHierarchy(
            categorySlug, 
            subcategorySlug, 
            null, // No hay subsubcategoría
            parseInt(page)
          ));
        } catch (err) {
          console.error('Error cargando subcategoría:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [categorySlug, subcategorySlug, page, dispatch]);

  // Formatear slug para mostrar
  const formatSlug = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs="auto" className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Chargement des annonces...</p>
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
            <Breadcrumb.Item href={`/${categorySlug}/1`}>
              {formatSlug(categorySlug)}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {formatSlug(subcategorySlug)}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold mb-2">
            {formatSlug(categorySlug)} › {formatSlug(subcategorySlug)}
          </h1>
          <p className="text-muted">
            Sous-catégorie: {formatSlug(subcategorySlug)}
          </p>
        </Col>
      </Row>

      {/* Posts de la subcategoría */}
      <Row>
        <Col>
          <Posts
            fromSubcategoryPage={true}
            selectedCategory={categorySlug}
            selectedSubcategory={subcategorySlug}
            selectedSubSubcategory={null}
            page={parseInt(page)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SubcategoryPage;