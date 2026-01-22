// src/components/Sliders/ArticleSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Card, Badge } from 'react-bootstrap';

const ArticleSlider = ({ articles = [], onArticleClick }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="article-slider">
      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={12}
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
        {articles.map((article) => (
          <SwiperSlide key={article._id || article.slug}>
            <Card 
              className="h-100 border-0 shadow-sm hover-shadow"
              style={{ cursor: 'pointer' }}
              onClick={() => onArticleClick(article.slug || article.name)}
            >
              <Card.Body className="text-center p-3">
                <div className="mb-2" style={{ fontSize: '28px' }}>
                  {article.emoji || '📄'}
                </div>
                <Card.Title className="h6 mb-1 text-truncate">
                  {article.name}
                </Card.Title>
                {article.postCount && (
                  <Badge bg="light" text="dark" className="mt-1">
                    {article.postCount}
                  </Badge>
                )}
                {article.level === 3 && (
                  <Badge bg="info" className="mt-1">
                    Artículo
                  </Badge>
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
        
        .article-slider .card {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
};

export default ArticleSlider;