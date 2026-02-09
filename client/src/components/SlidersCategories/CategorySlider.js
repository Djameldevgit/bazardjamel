import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 767) setItemsPerPage(8);
      else if (w <= 1023) setItemsPerPage(6);
      else if (w <= 1439) setItemsPerPage(8);
      else setItemsPerPage(10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const goNext = () => setCurrentPage(prev => (prev + 1 >= totalPages ? 0 : prev + 1));
  const goPrev = () => setCurrentPage(prev => (prev - 1 < 0 ? totalPages - 1 : prev - 1));

  const handleClick = (cat) => {
    if (!cat) return;
    if (onCategoryClick) onCategoryClick(cat);
    else history.push(`/category/${cat.slug}`);
  };

  const pages = [];
  for (let i = 0; i < categories.length; i += itemsPerPage) {
    pages.push(categories.slice(i, i + itemsPerPage));
  }

  return (
    <div className="cs-slider-final">
      <div className="cs-slider-container">
        {pages.length > 0 && (
          <div className="cs-slider-page cs-active">
            <div className="cs-category-row">
              {pages[currentPage].map((cat, index) => (
                <div
                  key={cat._id}
                  className="cs-category-item"
                  onClick={() => handleClick(cat)}
                  style={{ "--cs-item-delay": index }}
                >
                  <div className="cs-image-container">
                    {cat.icon ? (
                      <img src={cat.icon} alt={cat.name} className="cs-category-image" />
                    ) : (
                      <div className="cs-image-fallback">{cat.name?.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="cs-category-name">{cat.name}</div>
                  {cat.posts?.length > 0 && (
                    <div className="cs-product-count">{cat.posts.length}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="cs-slider-controls">
            <button className="cs-nav-btn cs-prev-btn" onClick={goPrev}>‹</button>
            <div className="cs-page-indicators">
              {pages.map((_, i) => (
                <button
                  key={i}
                  className={`cs-page-indicator-btn ${i === currentPage ? "cs-active" : ""}`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button className="cs-nav-btn cs-next-btn" onClick={goNext}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySlider;
