import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCartListCount } from '@redux/actions/CartListCountActions';
import Layout from '@components/Layouts/Layout';
import Breadcrums from '@components/Breadcrums/Breadcrums';
import LoaderSmall from '@components/Modal/LoaderSmall';
import Head from 'next/head';
import { baseUrl } from '@utils/urls';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const ProductCard = dynamic(() => import('@components/Cards/ProductCard'), {
    ssr: false, 
  });

  
function WishList() {
    const data  = useSelector((state) => state.getWishListData?.getWishListData)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const userData  = useSelector((state) => state.userData);
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        dispatch(getCartListCount(`/api/get-user-wishlist`, userData?.token, "WishListSuccess"));
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [])

    

    const breadcumsDetails = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: "Wish List",
            path: "#"
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
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col'>
                            <Breadcrums breadcumsDetails={breadcumsDetails} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='all-items wish-list-container' style={{ position: "relative" }}>
                            {isLoading || loading&& 
                            <LoaderSmall />
                            }
                            {data?.length > 0 ? (
                                data.map((product,index) => (
                                    <div key={index.toString()} className='wish-list-item'>
                                        <ProductCard setLoading={setLoading} setisLoading={setisLoading} key={product.id} product={product} isWishlistCard={true} />
                                    </div>
                                ))
                            ) : (
                                <p className='text-center d-flex w-100 alig-items-center justify-content-center no-prod' style={{ minHeight: "100px" }}>
                                    <span>No products found</span>
                                    <Link href='/'>Add Now</Link>
                                </p>
                            )}

                        </div>

                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default WishList
