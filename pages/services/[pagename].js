import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '@components/Layouts/Layout';
import Breadcrums from '@components/Breadcrums/Breadcrums';
import PropTypes from 'prop-types';
import c from "@constants/Common";
import Head from 'next/head';
import { baseUrl } from '@utils/urls';

function PrivacyPolicy({ pageDataS }) {
    const [pageData, setpageData] = useState(pageDataS || {})
    
    // console.log("pageDataS" ,pageDataS);
    
    useEffect(()=>{
        setpageData(pageDataS)
    },[pageDataS])

    const breadcumsDetails = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: pageData?.title,
            path: "#"
        },
    ]
    useEffect(()=>{
        // document.getElementById("custom-loader-ssr").style.display = pageData? "none":"block"
    },[])

    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8" />
                <title>{pageData?.title}</title>
                <meta name="author" content={c.APP_NAME} />
                <meta property="og:url" content={c.BASE_URL} />
                <meta property="og:site_name" content={c.APP_NAME} />
                <link rel="shortcut icon" href={`/favicon.png`} />
                <link rel="icon" href="/footer-logo.svg"/>
                <link rel="canonical" href={`${c.BASE_URL}`} />
            </Head>
            <Layout>
                <div className='row container-fluid'>
                    <div className='col'>
                        <Breadcrums breadcumsDetails={breadcumsDetails} />
                    </div>
                </div>
                <div className='container-fluid d-flex align-items-center '>
                    <div className='banner-container mb-4 bg-blue w-100'>
                        <h2 className='text-light py-2 text-center w-100' >{pageData?.title}</h2>
                    </div>
                </div>
                <div className='container-fluid' style={{ position: "relative", minHeight: "300px" }}>
                    <div>
                        <div className='priv-policy'>
                            <div
                                dangerouslySetInnerHTML={{ __html: pageData?.content }}
                            ></div>
                        </div>
                    </div>
                </div>
            </Layout >
        </React.Fragment>
    )
}

PrivacyPolicy.propTypes = {
    pagename: PropTypes.string,
};



export async function getServerSideProps(context) {
    const { query } = context;
    // console.log(query);
    const pagename = query.pagename || '';
    var pageDataS;
    await axios.get(baseUrl + "/api/get-all-pages").then((res) => {
        if (res.data?.responseCode == 200) {
            pageDataS = res.data?.result?.find((item) => item?.slug == pagename)
        }
    }).catch((err) => {
        // console.log(err);
    })
    return { props: { pageDataS } }
}

export default PrivacyPolicy