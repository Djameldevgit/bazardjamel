// CategorySlider.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Card, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const history = useHistory();

  // Validación más robusta
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.log('⚠️ CategorySlider: No hay categorías o array inválido');
    return (
      <div className="text-center py-4">
        <p className="text-muted">No hay categorías disponibles</p>
      </div>
    );
  }

  const handleClick = (category) => {
    // Validación antes de continuar
    if (!category || !category.slug) {
      console.error('❌ CategorySlider: Categoría inválida:', category);
      return;
    }

    console.log('🖱️ Click en categoría:', category.name, 'slug:', category.slug);

    if (onCategoryClick) {
      // Opción A: Enviar objeto completo (RECOMENDADO)
      onCategoryClick(category);
      // Opción B: Enviar solo slug (si prefieres)
      // onCategoryClick(category.slug);
    } else {
      // Navegación por defecto
      history.push(`/category/${category.slug}`);
    }
  };

  return (
    <div className="main-category-slider">
      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        scrollbar={{ draggable: true }}
        breakpoints={{
          480: { slidesPerView: 4 },
          640: { slidesPerView: 5 },
          768: { slidesPerView: 6 },
          992: { slidesPerView: 7 },
          1200: { slidesPerView: 8 }
        }}
      >
        {categories.map((category) => {
          // Validar cada categoría antes de renderizar
          if (!category || !category.slug || !category.name) {
            console.warn('⚠️ Categoría inválida en slider:', category);
            return null;
          }

          return (
            <SwiperSlide key={category._id || category.slug}>
              <Card 
                className="h-100 border-0 shadow-sm text-center hover-card"
                style={{ cursor: 'pointer' }}
                onClick={() => handleClick(category)}
              >
                <Card.Body className="p-3">
                  <div className="category-icon mb-2" style={{ fontSize: '40px' }}>
                    {category.emoji || category.icon || '🏷️'}
                  </div>
                  <Card.Title className="h6 mb-1">
                    {category.name}
                  </Card.Title>
                  {category.postCount > 0 && (
                    <Badge bg="primary" className="mt-1">
                      {category.postCount}
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default CategorySlider;