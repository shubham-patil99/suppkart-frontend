import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import c from "@constants/Common";
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import moment from 'moment'
import Slider from 'react-slick'
import { getCartListCount } from '@redux/actions/CartListCountActions';
import { baseUrl } from '@utils/urls';
import Layout from '@components/Layouts/Layout';
import Loader from '@components/Modal/Loader';
import Breadcrums from '@components/Breadcrums/Breadcrums';
import LoaderSmall from '@components/Modal/LoaderSmall';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { formatProductName } from '@helpers/frontend';
const ProductdetailsCard = dynamic(() => import('@components/Cards/ProductdetailsCard'), {
    ssr: false, // Disable SSR for this component
});


const TopdealsCard = dynamic(() => import('@components/Cards/TopDeals'), {
    ssr: false, // Disable SSR for this component
});

function ProductDetailsPage({ productdetails, relatedProduct }) {
    const dispatch = useDispatch()
    const router = useRouter();
    const { params = [] } = router.query;
    const dynamicId = router.query?.id;
    const id = dynamicId
    // params.length > 0 ? params[0] : "";
    const slugName = params.length == 1 ? params[0] : "";
    const variantname = params.length > 0 ? params[1] : "";
    const [tabs, setTabs] = useState(1);
    const [data, setData] = useState(productdetails || {});
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [catProductData, setCatProductData] = useState(relatedProduct.products || []);
    const [productReviewCount, setProductReviewCount] = useState([]);
    const [productReviewData, setProductReviewData] = useState([]);
    const userData = useSelector((state) => state.userData)
    const [productLoading, setProductLoading] = useState(false);
    const [catProductLoading, setCatProductLoading] = useState(false);

    useEffect(() => {
        setCatProductData(relatedProduct.products)
        setData(productdetails)

    }, [relatedProduct.products, productdetails, id])
    useEffect(() => {
        if (userData?.token) {
            dispatch(getCartListCount(`/api/get-cart-list`, userData?.token, "CartListSuccess"));
        }
    }, [])
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchProductReviewData = async () => {
        try {
            const product_id = { product_id: id };
            if (product_id) {
                const response = await axios.post(`${baseUrl}/api/get-product-reviews`, product_id);
                setProductReviewData(response.data.result.reviews);
                setProductReviewCount(response.data.result.total_reviews_count);
                setLoading(false);
            }
        } catch (error) {
        }
    }

    const deleteReview = async (id) => {
        const FormData = require('form-data');
        let data = new FormData();
        data.append('review_id', id);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: baseUrl + '/api/delete-product-review',
            headers: {
                Authorization: `Bearer ${userData?.token}`,
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                if (response.data?.responseCode == 200) {
                    toast.success(response.data?.message)
                    fetchProductReviewData()
                }
            })
            .catch((error) => {
                // console.log(error);
            });
    }


    const isSectionActive = (tabNumber) => {
        return tabNumber === tabs ? 'isSectionActive' : '';
    };

    const handleTabClick = (tabNumber) => {
        setTabs(tabNumber);
    };
    const breadcumsDetails = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: data ? data.product_name?.substring(0, 35) : "Product",
            path: "/"
        },
    ]

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        autoplay: false,
        vertical: windowWidth > 991 ? true : false,
        verticalSwiping: windowWidth > 991 ? true : false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: false,
                    dots: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    centerMode: false,
                }
            }
        ]
    };



    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8" />
                <title>{data?.product_name?.substring(0, 35)}</title>
                <meta name="title" content={data?.meta_title || ""} />
                <meta name="description" content={data?.meta_description || ""} />
                <meta name="image" content={"https://api.suppkart.com/" + data?.meta_image || ""} />
                <meta name="keywords" content={data?.meta_keywords || ""} />
                <meta name="author" content={c.APP_NAME} />
                <meta property="og:url" content={data?.og_url || ""} />
                <meta property="og:site_name" content={c.APP_NAME} />
                <meta property="og:image" content={`https://api.suppkart.com/${data?.og_image || "/default-image.png"}`} />
                <meta property="og:title" content={data?.og_title || "Default Meta Title"} />
                <meta property="og:description" content={data?.og_description || "Default meta description for the page"} />
                <link rel="shortcut icon" href={`${c.BASE_URL}/favicon.png`} />
                <link rel="icon" href="/footer-logo.svg" />
                <link rel="canonical" href={`${c.BASE_URL}/products/${data?.slug?.replace(/ /g, "-")}-${variantname}?id=${id}`} />
                
            </Head>
            <Layout>
                {productLoading ? (
                    <Loader />
                ) : (
                    <div className='container-fluid' style={{ overflowX: "hidden" }}>
                        <div className='row'>
                            <div className='col'>
                                <Breadcrums breadcumsDetails={breadcumsDetails} />
                            </div>
                        </div>
                        <div className='row' style={{ position: "relative" }}>
                            {
                                productLoading ?
                                    <LoaderSmall /> :
                                    <>
                                        {
                                            !data?.product_name ?
                                                <p className='text-center d-flex w-100 alig-items-center justify-content-center no-prod' style={{ minHeight: "100px" }}>
                                                    <span>No products found</span>
                                                    <Link href='/'>Home</Link>
                                                </p> :
                                                <>
                                                    <div className='col-lg-8 mb-5'>
                                                        <div>
                                                            <ProductdetailsCard products={data} setData={setData} productReviewCount={productReviewCount} />
                                                        </div>
                                                        <div className='mt-lg-2'>
                                                            <div className='product-description'>
                                                                <ul className='d-flex'>
                                                                    <li className={`light-gray bold-600 ${isSectionActive(1)}`} onClick={() => handleTabClick(1)}>Description</li>
                                                                    {
                                                                        data?.nutrition && data?.nutrition != "" &&
                                                                        <li className={`light-gray bold-600 ${isSectionActive(2)}`} onClick={() => handleTabClick(2)}>Nutrition</li>
                                                                    }
                                                                    <li className={`light-gray bold-600 ${isSectionActive(3)}`} onClick={() => {
                                                                        fetchProductReviewData()
                                                                        handleTabClick(3)
                                                                    }}>Review ({productReviewCount ? productReviewCount : 0})</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        {tabs === 1 && (
                                                            <div dangerouslySetInnerHTML={{ __html: data?.long_description }} />
                                                        )}
                                                        {tabs === 2 && (
                                                            <div dangerouslySetInnerHTML={{ __html: (data?.nutrition ? data?.nutrition : "") || "" }} />
                                                        )}
                                                        {tabs === 3 && (
                                                            <div>
                                                                {productReviewData?.map((review, index) => (
                                                                    <div className='row pb-2' key={index} style={{ borderBottom: "1px solid #ccc" }}>
                                                                        <h5 className='gray py-2 d-flex justify-content-between align-items-center'>{review?.customer_name}
                                                                            {
                                                                                userData?.userDetails?.id == review?.user_id &&
                                                                                <span className='cursor-pointer ' style={{ fontSize: "12px" }} onClick={() => {
                                                                                    deleteReview(review?.id)
                                                                                }}>
                                                                                    Delete Review
                                                                                </span>
                                                                            }
                                                                        </h5>
                                                                        <span className='py-2'>
                                                                            {[...Array(5)].map((_, index) => {
                                                                                const starValue = index + 1;
                                                                                return (
                                                                                    <span
                                                                                        key={index}
                                                                                        style={{ cursor: 'pointer', color: starValue <= review?.rating ? 'gold' : 'gray', fontSize: "30px" }}
                                                                                    >
                                                                                        ★
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </span>
                                                                        <p className='review-text'>
                                                                            {review.review}
                                                                            {/* {console.log(review , "<<<<review")} */}
                                                                        </p>
                                                                        <div className='review-img'>
                                                                            {review?.image?.length > 0 && review.image?.split(",").map((image, imgIndex) => (
                                                                                <a href={baseUrl + "/" + image?.trim()} target='_blank'>

                                                                                    <img key={imgIndex} src={baseUrl + "/" + image?.trim()} alt={`img ${imgIndex}`} />
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                        <div className='d-flex justify-content-between'>
                                                                            <p className='gray'>
                                                                                {moment(review.created_at).calendar()}
                                                                            </p>

                                                                        </div>
                                                                    </div>
                                                                ))
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='col-lg-4'>
                                                        {
                                                            catProductData?.length > 0 &&
                                                            <div className='row'>
                                                                <div className='col py-2'>
                                                                    <h2 className='heading-large'>Related Products</h2>
                                                                </div>
                                                                <div className='related-side-product col-lg-12 d-lg-flex flex-lg-column justify-content-center align-items-center mx-0'>
                                                                    <Slider {...settings}>
                                                                        {catProductData?.length > 0 ? (
                                                                            catProductData?.map((product, index) => (
                                                                                <TopdealsCard key={index} details={product} />
                                                                            ))
                                                                        ) : (
                                                                            <p className='text-center'>{catProductLoading && <Loader /> ? 'Loading...' : ''}</p>
                                                                        )}
                                                                    </Slider>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </>
                                        }
                                    </>
                            }
                        </div>
                    </div>
                )}
            </Layout>
        </React.Fragment>
    )
}




ProductDetailsPage.propTypes = {
    pagename: PropTypes,
};


export async function getServerSideProps(context) {
    let vrN = context.query.params?.length > 0 ? context.query.params[1] : ""
    let pSlug = context.query.params?.length == 1 ? context.query.params[0] : ""
    // params?.length > 0 ? params[1] || "" : "";
    const { res } = context;
    const dynamicId = context.query?.id;
    let id = dynamicId
    // console.log("context.query", context.query.params);
    var productdetails = {}
    var productVarintdetails = {}
    if (vrN) {
        const dataFor = new FormData()
        dataFor.append("product_id", id)
        dataFor.append("attribute_name[]", formatProductName(vrN))
        await axios.post(`${baseUrl}/api/get-single-product`, { product_id: id }).then((response) => {
            if (response.data.responseCode === 200) {
                productVarintdetails = response.data.result
            }
        }).catch((err) => {
            // console.log(err);
        })

        await axios.request({
            method: 'post',
            url: `${baseUrl}/api/get-single-product-variant`,
            data: dataFor,
        }).then((response) => {
            if (response.data.responseCode === 200) {
                let resultData = response.data.result
                let formatedData = { ...productVarintdetails, ...resultData, images: resultData.images ? resultData.images : productVarintdetails.images }
                productdetails = formatedData
            }
        }).catch((err) => {
            // console.log(err);
        })

    } else {

        await axios.post(`${baseUrl}/api/get-single-product`, { product_id: id }).then((response) => {
            if (response.data.responseCode === 200) {
                productdetails = response.data.result
            }
        }).catch((err) => {
            // console.log(err);
        })
    }

    let relatedProduct = {}
    const category_id = { category_id: productdetails.category_id };
    await axios.post(`${baseUrl}/api/get-product-by-category`, category_id).then((response) => {
        if (response.data.responseCode === 200) {
            relatedProduct = response.data.result
        }
    }).catch((err) => {
        // console.log(err);
    })

    if (!productdetails?.product_name) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>404 - Page Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 50px;
                        background-color: #f8f8f8;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                    h1 {
                        font-size: 24px;
                        color: #333;
                    }
                    p {
                        font-size: 16px;
                        color: #666;
                    }
                    a {
                        display: inline-block;
                        margin-top: 15px;
                        padding: 10px 20px;
                        color: white;
                        background-color: #007bff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    a:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="${c.BASE_URL}/assets/images/page-not-found.webp" alt="Page Not Found">
                    <h1>404 - Page Not Found</h1>
                    <p>Unfortunately, the page you are looking for has been moved or deleted.</p>
                    <a href="/">Go to Homepage</a>
                </div>
            </body>
            </html>
        `);
        return {
            props: {},
        };

    }

    return { props: { productdetails, productVarintdetails, relatedProduct } }
}
export default ProductDetailsPage