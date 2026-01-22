// src/components/Sliders/SubCategorySlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Card, Badge } from 'react-bootstrap';

const SubCategorySlider = ({ subcategories = [], onSubcategoryClick }) => {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className="subcategory-slider">
      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={16}
        slidesPerView={2}
        navigation
        scrollbar={{ draggable: true }}
        breakpoints={{
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 6 }
        }}
      >
        {subcategories.map((subcategory) => (
          <SwiperSlide key={subcategory._id || subcategory.slug}>
            <Card 
              className="h-100 border-0 shadow-sm hover-shadow"
              style={{ cursor: 'pointer' }}
              onClick={() => onSubcategoryClick(subcategory.slug || subcategory.name)}
            >
              <Card.Body className="text-center p-3">
                <div className="mb-2" style={{ fontSize: '32px' }}>
                  {subcategory.emoji || '📂'}
                </div>
                <Card.Title className="h6 mb-1 text-truncate">
                  {subcategory.name}
                </Card.Title>
                {subcategory.postCount && (
                  <Badge bg="light" text="dark" className="mt-1">
                    {subcategory.postCount} posts
                  </Badge>
                )}
                {subcategory.description && (
                  <p className="small text-muted mt-2 mb-0 text-truncate">
                    {subcategory.description}
                  </p>
                )}
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: #0d6efd;
          background: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default SubCategorySlider;