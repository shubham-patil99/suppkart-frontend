import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import { baseUrl } from '../../utils/urls';
import { useDispatch } from 'react-redux';
import { getcategory } from '../../redux/actions/categoryActions';
import Loader from '@components/Modal/Loader';
import { BASE_URL } from '@constants/Common';
import Link from 'next/link';
import Image from 'next/image';

function HomeBanner() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [silderData, setSetsliderData] = useState([])
  const [silderleftData, setSetleftsliderData] = useState([])
  const slideRef = useRef()
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000); 
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios.get(`${baseUrl}/api/get-slider`).then((res) => {
        if (res.status == 200) {
          setSetsliderData(res.data.result)
          setSetleftsliderData(res.data.result?.filter((item) => item.slider_position == "left"))
          setLoading(false);
        }
      }).catch((err) => { console.log(err); setLoading(false); })
    }
    const fetchIconData = async () => {
      setLoading(true);
      await axios.get(`${baseUrl}/api/get-all-categories-by-feature`).then((res) => {
        if (res.status === 200) {
          setisfeaturedCategory(res.data.result?.filter((item) => item?.is_featured == "1"))
        }
      }).catch((err) => { console.log(err); })
    }

    fetchData()
    fetchIconData()
  }, [])
  const scrollPrev = () => {
    const container = slideRef.current;
    const innerItems = container.querySelectorAll('.inner-items'); // Adjust the selector
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevItem = innerItems[currentIndex - 1];
      container.scrollTo({
        top: prevItem?.offsetTop || 0,
        left: prevItem?.offsetLeft,
        behavior: 'smooth',
      });
    }
  };
  const scrollNext = () => {
    const container = slideRef.current;
    const innerItems = container.querySelectorAll('.inner-items'); // Adjust the selector
    if (currentIndex < innerItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextItem = innerItems[currentIndex + 1];
      container.scrollTo({
        top: nextItem.offsetTop,
        left: nextItem.offsetLeft,
        behavior: 'smooth',
      });
    }
  };
  var settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false
  };
  const [isfeaturedCategory, setisfeaturedCategory] = useState()


  return (

    <React.Fragment>
      {loading &&
        <Loader />}
      <div className="home-banner">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-7 first-slider-home">
              <Slider {...settings}>
                {
                  silderleftData.length > 0 && silderleftData?.map((item, index) => {
                    return (
                      <div key={index} className='col-lg-2 col-md-4'>
                        <div className='goals-card sv-goals-card' onClick={() => {
                          window.location = item?.slider_url || "#"
                        }}>
                          <Image
                            src={`${baseUrl}/${item.slider_image}`}
                            alt="category image"
                            className="img-fluid category-image"
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fetchpriority="high"
                            loading="eager" 
                            priority={true} 
                          />
                        </div>
                      </div>
                    )
                  })
                }
              </Slider>
              <div className="under-slider">
                <div className="one">
                  <p><span>Free Shipping</span></p>
                  <p>Free shipping for workout supplements on orders over ₹2000.</p>
                </div>
                <div className="one">
                  <p><span>Authenticity Guaranteed</span></p>
                  <p>Guaranteed Authentic Supplements for Serious Fitness Enthusiasts.</p>
                </div>
                <div className="one">
                  <p><span>Secure Payment</span></p>
                  <p>Secure, fast, and reliable payment options .</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 second-sec">
              <Slider {...settings}>
                {silderData?.filter((item) => item.slider_position === "right").map((item, index) => (
                  <Image key={index} onClick={() => {
                    window.location = item?.slider_url || "#"
                  }} src={baseUrl + "/" + item?.slider_image}
                    fill
                    style={{ objectFit: 'fill', maxHeight: "555px" }}
                    fetchpriority="high"
                    alt="img"
                    loading="eager" // Eager load for the first image
                  />
                ))}
              </Slider>
            </div>

            <div className="col-lg-1 slider-ver">
              <div className="arrow top-arrow" onClick={() => scrollPrev()}>
                <Image
                  src={BASE_URL + "/assets/images/home-banner/arrow.svg"}
                  width={100}
                  height={100}
                  fetchpriority="high"
                  alt="arrow"
                  unoptimized />
              </div>
              <div className="vertical-slide" ref={slideRef}>
                {
                  isfeaturedCategory?.map((item, index) => {
                    // console.log(item );

                    return (
                      <div className="inner-items" key={index}>
                        <Link href={`/category/${item?.slug?.replace(/ /g, "-")}?id=${item?.id}`}>
                          <Image
                            src={baseUrl + "/" + item?.icon}
                            alt={item?.name}
                            width={100}
                            height={100}
                            fetchpriority="high"
                            priority={true} // First image should be priority
                          />
                          <p>{item?.name}</p>
                        </Link>
                      </div>
                    )
                  })
                }
              </div>
              <div className="arrow bottom-arrow" onClick={() => scrollNext()}>
                <Image width={100}
                  fetchpriority="high"
                  height={100} src={BASE_URL + "/assets/images/home-banner/arrow.svg"} alt="arrow"
                  unoptimized />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default HomeBanner
