import Breadcrums from '@components/Breadcrums/Breadcrums';
import Layout from '@components/Layouts/Layout';
import Loader from '@components/Modal/Loader';
import { getbrand } from '@redux/actions/brandActions';
import { baseUrl } from '@utils/urls';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function Brand() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch()
    const brands = useSelector((state) => state.brandData?.brandData?.brands)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getbrand(`/api/get-brands?page=${currentPage}`))
        setLoading(false)
    }, [currentPage]);


    const breadcumsDetails = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: "All Brands"
        },
    ]

    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8" />
                <title>Suppkart</title>
                <link rel="canonical" href={`${baseUrl}`} />
            </Head>
            <Layout>
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        <div className='container-fluid brnds-pg'>
                            <div className='row'>
                                <div className='col'>
                                    <Breadcrums breadcumsDetails={breadcumsDetails} />
                                </div>
                            </div>
                        </div>
                        <div className="top-brands container-fluid">

                            <div className="all-brands ">
                                {brands?.map((item, index) => (
                                    <div key={index} className="img">
                                        <a href={`/brand/${item?.slug?.replace(/ /g, "-")}?id=${item?.id}`}>
                                            <img src={`${baseUrl}/${item?.logo}`} className='img-fluid' alt={item.name} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Layout>
        </React.Fragment>
    )
}

export default Brand