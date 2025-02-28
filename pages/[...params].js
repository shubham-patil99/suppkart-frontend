import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import c, { BASE_URL } from "@constants/Common";
import { useDispatch, useSelector } from 'react-redux';
import { getCartListCount } from '@redux/actions/CartListCountActions';
import { baseUrl } from '@utils/urls';
import Breadcrums from '@components/Breadcrums/Breadcrums';
import LoaderSmall from '@components/Modal/LoaderSmall';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Loader from '@components/Modal/Loader';
import { getbrand } from '@redux/actions/brandActions';
const ProductCard = dynamic(() => import('@components/Cards/ProductCard'));
const Layout = dynamic(() => import('@components/Layouts/Layout'));

function Product({ productData }) {
    const userData = useSelector((state) => state?.userData);
    const brandData = useSelector((state) => state.brandData)
    const canonicalUrl = `${c.BASE_URL}/category/${slug}?id=${id}`;
    const dispatch = useDispatch();
    const router = useRouter();
    const { params } = router.query;
    const slug = params[1];
    const type = params.length > 0 ? params[0] : "";
    const dynamicId = router.query?.id;
    const id = dynamicId
    // params.length > 0 ? params[1] : "";
    // const lastPrm = params[2] ? params[2] : "";
    const [data, setData] = useState([]);
    const filtermodalRef = useRef(null)
    const [dataForFi, setDataForFi] = useState([]);
    const [brandIds, setBrandId] = useState(type === 'brand' ? [Number(id)] : []);
    // console.log("productData", productData);
    const [brandname, setBrandName] = useState([]);
    const [disCount, setdisCount] = useState();
    const [itemshort, setitemshort] = useState();
    const [priceRangeArr, setpriceRangeArr] = useState();
    const [loading, setLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(false);
    const [openFilter, setopenFilter] = useState(false)

    // url code start
    useEffect(() => {
        if (!productLoading && data?.products?.length === 0) {
            router.push('/404');
        }
    }, [data?.products, productLoading]);

    // url code ends
    useEffect(() => {
        // if(type != "brand"){
        // setBrandId([]);
        // setBrandName([]);
        // }
        setpriceRangeArr(null);
        setdisCount(null);
    }, [type, id])


    useEffect(() => {
        handleMultipleFilter(brandIds, disCount, priceRangeArr)
    }, [brandIds, disCount, priceRangeArr])

    useEffect(() => {
        if (type == 'product' || type == "category" || type == "search") { fetchData() }
    }, [brandIds])
    useEffect(() => {
        if (userData?.token) {
            dispatch(
                getCartListCount(
                    `/api/get-user-wishlist`,
                    userData?.token,
                    "WishListSuccess"
                )
            );
        }
    }, [userData?.token]);
    useEffect(() => {
        fetchData();
        if (brandData?.brandData?.brands?.length == 0) {
            dispatch(getbrand(`/api/get-brands?page=1`))
        }
    }, [])
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtermodalRef.current && !filtermodalRef.current.contains(event.target)) {
                setopenFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const breadcumsDetails = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: type == "search" ? (params[1] ? params[1] : "") : `All Categories By ${type}`,
            path: type == "search" ? "#" : "/Categories"
        },
        {
            title: data?.category_name ?? data?.brand_names,
            path: "#"
        },
    ]

    const fetchData = async (prids) => {
        try {
            setProductLoading(true);
            let response;
            if (type === 'category' || (type === 'category' && brandIds?.length > 0)) {
                const postdata = new FormData();
                postdata.append("brand_id", brandIds?.join(','));
                postdata.append("category_id", id);
                postdata.append("type", brandIds?.length > 0 && `"brand"`);
                response = await axios.post(`${baseUrl}/api/get-product-by-category`, postdata);
                if (response.data.responseCode === 200) {
                    setData(response.data.result);
                    setDataForFi(response.data.result?.products)
                    setProductLoading(false);
                } else {
                    setProductLoading(false);
                }

            }
            if (type === 'search' || (type === 'search' && brandIds?.length > 0)) {

                response = await axios.post(`${baseUrl}/api/get-product-by-query?product_name=${params[1]}${brandIds?.length > 0 ? "&brand_id=" + brandIds?.join(',') : ""}`);
                if (response.data.responseCode === 200) {
                    setData(response.data.result);
                    setDataForFi(response.data.result?.products)
                    setProductLoading(false);
                } else {
                    setProductLoading(false);
                }
            }


            if (type === 'brand' || (type === 'product' && brandIds?.length > 0)) {
                // console.log(brandIds , Number(id));
                const brand_id = { brand_id: prids ? Number(id) : brandIds?.join(',') };
                response = await axios.post(`${baseUrl}/api/get-product-by-brand`, brand_id);
                if (response.data.responseCode === 200) {
                    setData(response.data.result);
                    setDataForFi(response.data.result?.products)
                    setProductLoading(false);
                } else {
                    setProductLoading(false);
                }
            }
            if (type === 'product' && brandIds?.length == 0) {
                const product_id = { product_id: id };
                response = await axios.post(`${baseUrl}/api/get-product-by-product-id`, product_id);
                if (response.data.responseCode === 200) {
                    setData(response.data.result);
                    setDataForFi(response.data.result?.products)
                    setProductLoading(false);
                }
            }
        } catch (error) {
            // console.log(error);
            setProductLoading(false);
        }
    }

    const discountArr = [5, 20, 25, 50]
    const handleMultipleFilter = (brd, dis, priceA) => {
        const filteredData = dataForFi?.filter((item) => {
            const discountP = item?.product_attributes.length > 0 ? parseInt(item?.product_attributes[0]?.discount) : parseInt(item.discount)
            const findedprice = item?.product_attributes.length > 0 ? parseInt(item?.product_attributes[0]?.price) : parseInt(item.price)
            return (priceA && dis) ?
                ((discountP >= dis) && (findedprice >= Number(priceA?.min) && findedprice <= Number(priceA?.max))) :
                priceA ? (findedprice >= Number(priceA?.min) && findedprice <= Number(priceA?.max)) :
                    dis ? (discountP >= dis) : item
        })

        setData((preS) => ({ ...preS, products: filteredData }))

    }


    const priceRange = [
        { min: "50", max: "1500", id: 1 },
        { min: "1500", max: "10000", id: 2 },
        { min: "10000", max: "20000", id: 3 },
        { min: "20000", max: "100000", id: 4 },
    ]


    const sortData = (e) => {
        if (e != "") {
            data?.products?.sort((a, b) => {
                const attLengthB = b?.product_attributes.length > 0 ? parseInt(b?.product_attributes[0]?.price) : parseInt(b.price)
                const attLengthA = a?.product_attributes.length > 0 ? parseInt(a?.product_attributes[0]?.price) : parseInt(a.price)
                return e == "desc" ? attLengthB - attLengthA : attLengthA - attLengthB
            });
        }
    }

    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8" />
                <title>{c.APP_NAME}</title>
                <meta name="title" content={data?.relatedMetaTags?.meta_title || ""} />
                <meta name="description" content={data?.relatedMetaTags?.meta_description || ""} />
                <meta name="keywords" content={data?.relatedMetaTags?.meta_keywords || ""} />
                <meta name="author" content={c.APP_NAME} />
                <meta property="og:url" content={data?.relatedMetaTags?.og_url} />
                <meta property="og:title" content={data?.relatedMetaTags?.og_title} />
                <meta property="og:description" content={data?.relatedMetaTags?.og_description} />
                <meta property="og:image" content={data?.relatedMetaTags?.og_image} />
                <link rel="shortcut icon" href={`${c.BASE_URL}/favicon.png`} />
                <link rel="icon" href="/footer-logo.svg" />
                <link rel="canonical" href={`${c.BASE_URL}/category/${data?.relatedMetaTags?.slug?.replace(/ /g, "-")}?id=${id}`} />
                </Head>
            <Layout>
                <div>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col'>
                                <Breadcrums breadcumsDetails={breadcumsDetails} />
                            </div>
                        </div>
                    </div>
                    <div className="product-items" style={{ position: "relative" }}>
                        {loading && <LoaderSmall />}
                        <div className="container-fluid heading-main">
                            {
                                type == "search" ?
                                    <h1>{brandname?.length > 0 ? brandname.join(",") : params[1] || ""}</h1>
                                    : <h1>{brandname?.length > 0 ? brandname.join(",") : data?.category_name ?? data?.brand_names}</h1>
                            }
                        </div>
                        <div className="container-fluid main-cont">
                            <img src={BASE_URL + "/assets/icons/hamburger.svg"} onClick={() => { setopenFilter(!openFilter) }} alt="img" className="hamburger filter-ham" />
                            <div ref={filtermodalRef} className={`filter-sec ${openFilter ? "opnfiltr" : ""} `} id='filter-sec' >
                                <h6 className='d-flex justify-content-between align-items-center pr-3 filter-head'>Filter
                                    <i className="fa-solid fa-x cross-filter" onClick={() => { setopenFilter(false) }}></i>
                                </h6>

                                <p className='head'>BRAND
                                    {/* <span >Clear</span> */}
                                </p>
                                {
                                    brandIds?.length > 0 &&
                                    <span className='gray pb-2 cursor-pointer clear-span' onClick={() => {
                                        if (type == "brand") {
                                            router.push(`/brand/${brandname[0]?.replace(/ /g, "-") || brandname[0]?.replace(/ /g, "-")}?id=${brandIds[0] || brandIds[0]}`)
                                        }
                                        setBrandId([brandIds[0]])
                                        setBrandName([brandname[0]?.replace(/ /g, "-")])
                                    }} ><i className="fa-solid fa-x clear-button"></i> Clear</span>

                                }
                                {brandData?.brandData?.brands?.map((item, index) => (
                                    <div key={index} >
                                        <label htmlFor="check1"><input type="checkbox"
                                            defaultChecked={item?.id == id && type === 'brand'}
                                            checked={brandIds?.find((itm) => itm == item?.id)}
                                            value={item?.id}
                                            onChange={(e) => {
                                                if (e.target.checked && !brandIds?.find((itm) => itm == item?.id)) {
                                                    setBrandId((pre) => ([...pre, item?.id]))
                                                    setBrandName((pre) => ([...pre, item?.name?.replace(/ /g, "-")]))
                                                    if (type == "brand") {
                                                        let allb = [...brandIds, item?.id]?.join(",")
                                                        let allbn = [...brandname, item?.name?.replace(/ /g, "-")]?.join(",")
                                                        router.push(`/brand/${allbn}?id=${allb}`)
                                                    }

                                                } else {
                                                    if (type == "brand") {
                                                        let allb = [...brandIds?.filter((elm) => elm != item?.id)]?.join(",")
                                                        let allbn = [...brandname?.filter((elm) => elm != item?.name?.replace(/ /g, "-"))]?.join(",")
                                                        router.push(`/brand/${allbn}?id=${allb}`)
                                                    }
                                                    setBrandId((pre) => ([...pre.filter((elm) => elm != item?.id)]))
                                                    setBrandName((pre) => ([...pre.filter((elm) => elm != item?.name?.replace(/ /g, "-"))]))
                                                }

                                            }} name="check1" id="check1" /> <span>
                                                {item?.name}
                                            </span></label>
                                    </div>
                                ))}
                                <p className='head'>PRICE
                                </p>
                                {
                                    priceRangeArr &&
                                    <span className='gray pb-2 cursor-pointer clear-span' onClick={() => {
                                        setpriceRangeArr()
                                    }}><i className="fa-solid fa-x clear-button"></i>Clear</span>

                                }
                                {
                                    priceRange?.map((item, index) => {
                                        return (
                                            <label key={index} htmlFor="check4"><input type="radio" name="priceRange"
                                                checked={priceRangeArr?.id == item?.id}
                                                value={item?.id}
                                                onChange={(e) => {
                                                    setpriceRangeArr(item)
                                                }}
                                                id="check4" /> <span>Rs. {item?.min} to Rs. {item?.max} </span></label>
                                        )
                                    })
                                }
                                <p className='head'>DISCOUNT RANGE
                                </p>
                                {
                                    disCount &&
                                    <span className='gray pb-2 cursor-pointer clear-span' onClick={() => {
                                        setdisCount()
                                    }} ><i className="fa-solid fa-x clear-button"></i>Clear</span>
                                }
                                {
                                    discountArr?.map((dis, index) => {
                                        return (
                                            <label key={index} htmlFor="check7"><input type="radio"
                                                checked={dis == disCount}
                                                onChange={(e) => {
                                                    setdisCount(dis)
                                                }} value={dis} name="discount" id="check7" /> <span>{dis}% and above</span></label>
                                        )
                                    })
                                }
                            </div >
                            <div className="all-items">
                                <div className="sel-container">
                                    <span>Sort by :</span>
                                    <select onChange={(e) => {
                                        sortData(e.target.value)
                                        setitemshort(e.target.value)
                                    }}>
                                        <option value="">Select</option>
                                        <option value="desc">High-to-low</option>
                                        <option value="asc">Low-to-high</option>
                                    </select>
                                </div>
                                <>
                                    {data?.products?.length > 0 ? (
                                        data?.products?.map((product) => (
                                            <ProductCard key={product.id} pLength={data?.products?.length} product={product} hidebutton={true} />
                                        ))
                                    ) : (
                                        <p className='text-center'>{productLoading && <Loader /> ? 'Loading...' : ''}</p>
                                    )}
                                </>
                            </div>
                        </div >
                    </div >
                </div >
            </Layout >
        </React.Fragment >
    )
}

// Define propTypes correctly
Product.propTypes = {
    pagename: PropTypes.string,
    productData: PropTypes.object,
};


export async function getServerSideProps(context) {
    const { params = [] } = context.query;
    const dynamicId = context.query?.id;
    let type = params.length > 0 ? params[0] : "";
    let id = dynamicId;
    const { res } = context;

    let productData = [];

    // Fetch product data based on different conditions
    if (type && type == 'category') {
        const postdata = new FormData();
        postdata.append("category_id", id);
        let response = await axios.post(`${baseUrl}/api/get-product-by-category`, postdata);
        if (response.data.responseCode === 200) {
            productData = response.data.result;
        }
    }
    if (type && type == 'brand') {
        const brand_id = { brand_id: id };
        let response = await axios.post(`${baseUrl}/api/get-product-by-brand`, brand_id);
        if (response.data.responseCode === 200) {
            productData = response.data.result;
        }
    }
    if (type && type == 'product') {
        const product_id = { product_id: id };
        let response = await axios.post(`${baseUrl}/api/get-product-by-product-id`, product_id);
        if (response.data.responseCode === 200) {
            productData = response.data.result;
        }
    }
    if (type && type == 'search') {
        let response = await axios.post(`${baseUrl}/api/get-product-by-query?product_name=${id}`);
        if (response.data.responseCode === 200) {
            productData = response.data.result;
        }
    }

    // If product data is empty or not found, return a 404 response
    if (productData?.products?.length === 0) {
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
                        padding: 50px 20px;
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
                    <img src="${BASE_URL}/assets/images/page-not-found.webp" alt="Page Not Found">
                    <h1>404 - Data Not Found related to params</h1>
                    <p>Unfortunately, the product you are looking for has been moved or deleted.</p>
                    <a href="/">Go to Homepage</a>
                </div>
            </body>
            </html>
        `);
        return {
            props: {},
        };
    }

    return {
        props: {
            productData,
        },
    };
}

export default Product;