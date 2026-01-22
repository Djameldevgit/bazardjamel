// src/components/Sliders/MainCategorySlider.jsx
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

  if (!categories || categories.length === 0) return null;

  const handleClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category.slug);
    } else {
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
        {categories.map((category) => (
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
                {category.postCount && (
                  <Badge bg="primary" className="mt-1">
                    {category.postCount}
                  </Badge>
                )}
                {category.posts && (
                  <p className="small text-muted mt-2 mb-0">
                    {category.posts.length} posts
                  </p>
                )}
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .category-icon {
          transition: transform 0.3s ease;
        }
        
        .hover-card:hover .category-icon {
          transform: scale(1.1);
        }
        
        .swiper-slide {
          height: auto;
        }
        
        .main-category-slider .card {
          min-height: 140px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default CategorySlider;