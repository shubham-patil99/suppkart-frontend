import React, { useState } from "react";
import Slider from "react-slick";
import { baseUrl } from "../../utils/urls";
import Image from "next/image";

function ProductImageSlide(images) {
  const isVisible = useState(true);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (

    <div>
      {images && images?.images?.length > 0 ? (
        <Slider {...settings}>
          {images?.images?.split(",").map((imageUrl, index) => {
            return (
              <div key={index} className="min-slider-main">
                <div className="small-image-container">
                  <Image
                    src={baseUrl + "/" + imageUrl.trim()}
                    className="img-fluid"
                    alt={`Image ${index + 1}`}
                    width={100} height={100}
                  />
                </div>
              </div>
            );
          })}
        </Slider>
      ) : (
        ""
      )}
    </div>
  )
}

export default ProductImageSlide
