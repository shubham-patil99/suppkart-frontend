import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TransformWrapper , TransformComponent } from "react-zoom-pan-pinch";
import { baseUrl } from "@utils/urls";
import Image from "next/image";
const PhotoSlider = ({ setIsVisible, isVisible }) => {
  const [isHidden, setIsHidden] = useState(true);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };


  const handleCrossClick = () => {
    setIsHidden(true);
  };

  return (
    <div
      className={`slider-container photo-slider ${isHidden ? "hidden" : ""}`}
    >
      <span
        className="cross-btn"
        onClick={() => {
          setIsVisible();
        }}
      >
        <i className="fa-solid fa-x"></i>
      </span>
      <Slider {...settings}>
        {isVisible?.map((img ,index) => {
          return (
            <div key={index} className="img-contr">
              <TransformWrapper defaultScale={1} defaultPositionX={100} defaultPositionY={200}>
                <TransformComponent>
                  <Image src={baseUrl+"/"+img} alt="img"  width={500} height={500} unoptimized />
                </TransformComponent>
              </TransformWrapper>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default PhotoSlider;
