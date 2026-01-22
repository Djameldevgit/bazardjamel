import React from "react";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";

const SubCategorySlider = ({ subcategories, categorySlug }) => {
  const history = useHistory();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleClick = (subSlug) => {
    history.push(`/${categorySlug}/${subSlug}`);
  };

  return (
    <Slider {...settings}>
      {subcategories.map((sub) => (
        <div
          key={sub.id}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
          onClick={() => handleClick(sub.slug)}
        >
          <span style={{ fontSize: "2rem" }}>{sub.emoji}</span>
          <span>{sub.name}</span>
        </div>
      ))}
    </Slider>
  );
};

export default SubCategorySlider;
