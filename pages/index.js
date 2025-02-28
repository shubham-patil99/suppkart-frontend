import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import c from "@constants/Common";
import Layout from '@components/Layouts/Layout';
import { baseUrl } from '@utils/urls';
import axios from 'axios';
import Loader from '@components/Modal/Loader';
import dynamic from 'next/dynamic';
import { formatCurrency } from '@helpers/frontend'

// Dynamically imported components
const TopBrands = dynamic(() => import('@components/Modal/TopBrands'), { ssr: false });
const ShopebyGoal = dynamic(() => import('@components/ShopebyGoal'), { ssr: false });
const ProductSlide = dynamic(() => import('@components/ProductContent/ProductSlide'), { ssr: false });
const HomeBanner = dynamic(() => import('@components/ProductContent/HomeBanner'), { ssr: false });
const TopBrandsSection = dynamic(() => import('@components/TopBrandsSection'), { ssr: false });
const TopdealSection = dynamic(() => import('@components/TopdealSection'), { ssr: false });


const HomePage = ({ topdealdata, homeBannerdata, shopbydata, starsdata }) => {
    const [productSection, setProductSection] = useState(shopbydata || []);
    const [loading, setLoading] = useState(true);
    const [visibleComponents, setVisibleComponents] = useState({
        homeBanner: false,
        topDeal: false,
        shopByGoal: false,
        productSlide: false,
        topBrandsSection: false,
        topBrands: false
    });
    // Fetching data for product section asynchronously
    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/get-product-sections-with-item-count`);
            if (res.status === 200) {
                setProductSection(res.data.result);
            }
            setLoading(false);
            loadComponentsSequentially();
        } catch (err) {
            setLoading(false);
            // console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0); // Ensure the page scrolls to the top on load
    }, [fetchData]);

    const loadComponentsSequentially = () => {
        const componentLoadOrder = [
            'homeBanner', 'topDeal', 'shopByGoal', 'productSlide', 'topBrandsSection', 'topBrands'
        ];

        componentLoadOrder.forEach((component, index) => {
            setTimeout(() => {
                setVisibleComponents(prevState => ({ ...prevState, [component]: true }));
            }, index * 300); // Sequentially load each component with a delay
        });
    };

    return (
        <React.Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title>{`Home - ${c.APP_NAME}`}</title>
                <meta name="description" content="Suppkart offers premium, 100% original gym supplements directly from global brands to customers in India. Shop top-quality supplements for bodybuilding, fitness, and endurance, guaranteed original and imported." />
                <meta name="keywords" content="Home" />
                <meta name="author" content={c.APP_NAME} />
                <link rel="canonical" href={`${c.BASE_URL}`} />
            </Head>

            <Layout>
                {/* Show loader only if loading is true */}
                {loading && <Loader />}

                {/* Render main content after data is loaded */}
                {homeBannerdata && topdealdata && productSection && starsdata ? (
                    <>
                        {/* Dynamically loaded components */}
                        <div style={{ minHeight: '400px' }}>
                            {visibleComponents.homeBanner && <HomeBanner homeBannerdata={homeBannerdata} />}
                        </div>

                        <div style={{ minHeight: '300px' }}>
                            {visibleComponents.topDeal && <TopdealSection topdealdata={topdealdata} />}
                        </div>

                        <div style={{ minHeight: '350px' }}>
                            {visibleComponents.shopByGoal && <ShopebyGoal productSection={productSection[0]} />}
                        </div>

                        <div style={{ minHeight: '350px' }}>
                            {visibleComponents.productSlide && <ProductSlide />}
                        </div>

                        {/* Render other product sections */}
                        {productSection.slice(1).map((item) => (
                            <div key={item.id} style={{ minHeight: '350px' }}>
                                {visibleComponents.shopByGoal && <ShopebyGoal productSection={item} />}
                            </div>
                        ))}

                        <div style={{ minHeight: '400px' }}>
                            {visibleComponents.topBrandsSection && <TopBrandsSection starsdata={starsdata} />}
                        </div>

                        <div style={{ minHeight: '200px' }}>
                            {visibleComponents.topBrands && <TopBrands />}
                        </div>
                    </>
                ) : null}
            </Layout>
        </React.Fragment>
    );
};

// Server-side data fetching for SEO and initial content
export async function getServerSideProps(context) {
    let homeBannerdata = [];
    let topdealdata = [];
    let shopbydata = [];
    let starsdata = [];

    try {
        // Parallelize API requests for better performance
        const [homeBannerRes, topDealRes, starsRes, shopByRes] = await Promise.all([
            axios.get(`${baseUrl}/api/get-slider`),
            axios.get(`${baseUrl}/api/get-all-products-by-top-deal`),
            axios.get(`${baseUrl}/api/get-sport-stars`),
            axios.get(`${baseUrl}/api/get-product-sections-with-item-count`)
        ]);

        // Handle successful data fetching
        homeBannerdata = homeBannerRes.data.result || [];
        topdealdata = topDealRes.data.result || [];
        starsdata = starsRes.data.result || [];
        shopbydata = shopByRes.data.result || [];
    } catch (err) {
        // console.log(err);
    }

    // Return the data as props for server-side rendering
    return {
        props: {
            homeBannerdata,
            topdealdata,
            shopbydata,
            starsdata
        }
    };
}

export default HomePage;