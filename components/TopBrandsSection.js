import React, {  useState } from 'react'
import Slider from 'react-slick';
import SectionsHeading from './Cards/SectionsHeading';
import SportsCards from './Cards/SportsCards';

function TopBrandsSection({starsdata}) {

    const [data, setData] = useState(starsdata ||[])
   
    var settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };

    return (
        <div className='container-fluid home-sections bg-light'>
            <SectionsHeading title="Trusted By The Best" subTitle={"Top-tier performers rely on our products daily. Whether aiming for the podium or personal success, they deserve unparalleled quality and support."} />
            <div className='row'>
                <div className='sports-slides'>
                    <div className='row'>
                        <Slider {...settings}>
                            {
                                data?.map((item, index) => {
                                    return (
                                        <div className='col-lg-6 ' key={index}>
                                            <SportsCards detials={item} />
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default TopBrandsSection