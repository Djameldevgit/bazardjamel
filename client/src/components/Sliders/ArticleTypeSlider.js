import React from "react";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";

const ArticleTypeSlider = ({ articleTypes, categorySlug, subCategorySlug }) => {
  const history = useHistory();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleClick = (articleSlug) => {
    history.push(`/${categorySlug}/${subCategorySlug}/${articleSlug}`);
  };

  return (
    <Slider {...settings}>
      {articleTypes.map((art) => (
        <div
          key={art.id}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
          onClick={() => handleClick(art.slug)}
        >
          <span style={{ fontSize: "2rem" }}>{art.emoji}</span>
          <span>{art.name}</span>
        </div>
      ))}
    </Slider>
  );
};

export default ArticleTypeSlider;
