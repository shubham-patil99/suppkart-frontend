import React, { memo } from 'react';
import Slider from 'react-slick';
import TopdealsCard from './Cards/TopDeals';
import SectionsHeading from './Cards/SectionsHeading';
import { formatCurrency } from '@helpers/frontend'

const TopdealSection = ({ topdealdata = [] }) => {
    const settings = React.useMemo(() => ({
        dots: false,
        infinite: true,
        speed: 200,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
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
    }), []);

    return (
        <div className='container-fluid home-sections'>
            <div className='row'>
                <SectionsHeading title="Top Deals" />
                <Slider {...settings}>
                    {topdealdata.map((item) => (
                        <div key={item?.id} className='col-lg-6'>
                            <TopdealsCard details={item} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default memo(TopdealSection);