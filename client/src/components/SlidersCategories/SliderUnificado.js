const SliderUnificado = ({
  title,
  items = [],
  level = 2,
  activeItem,
  onItemClick,
  variant = "default", // "categoryPage" o "home"
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`cs-slider-final cs-${variant}`}>
      {/* Renderiza header solo si title existe y no es CategoryPage */}
      {variant !== "categoryPage" && title && (
        <div className="cs-slider-header">
          <h3 className="cs-slider-title">{title}</h3>
        </div>
      )}

      {/* Slider */}
      <div className="cs-slider-container">
        <div className="cs-category-row cs-first-row">
          {items.map((item, index) => (
            <div
              key={item._id || item.slug}
              className="cs-category-item"
              style={{ "--cs-item-delay": index }}
              onClick={() => onItemClick(item)}
            >
              <div className="cs-image-container">
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="cs-category-image"
                  />
                ) : (
                  <div className="cs-image-fallback">
                    {item.name?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="cs-category-name">{item.name}</div>

              {activeItem?.slug === item.slug && (
                <div className="cs-product-count bg-primary text-white">
                  Activo
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default SliderUnificado;
