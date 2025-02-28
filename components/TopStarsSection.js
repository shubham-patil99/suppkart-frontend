import React from 'react'
import Slider from 'react-slick';
import TopdealsCard from './Cards/TopDeals';
import SectionsHeading from './Cards/SectionsHeading';
import SportsCards from './Cards/SportsCards';

function TopStarsSection() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };
    const topArray = [1, 2, 3, 4, 5, 6]
    return (
        <div className='container-fluid home-sections bg-light'>
                <SectionsHeading title="Top Stars" />
            <div className='row'>
                <div className='col'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <SportsCards />
                        </div>
                        <div className='col-lg-6'>
                            <SportsCards />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopStarsSection