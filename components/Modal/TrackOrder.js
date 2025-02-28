import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { getUserOrder } from '@redux/actions/getUserOrderActions'
import { handlePopup } from '@redux/actions/popupActions'
import LoaderSmall from './LoaderSmall'
import { baseUrl } from '@utils/urls'
import ProgressBar from './ProgressBar'
import { formatCurrency } from '@helpers/frontend'

function TrackOrder() {
    const dispatch = useDispatch()
    const popUpData  = useSelector((state) => state.popUpData)
    const userdetail = useSelector((state) => state?.userData)
    const [orderData, setOrderData] = useState()


    const trackorderData = async (id) => {
        const formData = new FormData()
        formData.append('order_id', popUpData?.popupdata?.productDetials?.order_id);
        const config = {
            method: 'post',
            url: `${baseUrl}/api/get-user-single-order`,
            headers: {
                'Authorization': `Bearer ${userdetail?.token}`,
            },
            data: formData
        }
        await axios.request(config).then((res) => {
            // console.log(res);
            if (res.data.responseCode == 200) {
                setOrderData(res.data?.result[0])
            }
        }).catch((err) => {
            // console.log(err);
        })

    }

    useEffect(() => {
        trackorderData(popUpData?.productDetials?.id)
    }, [])

    const cancelOrder = async (orId) => {
        let data = new FormData()
        data.append('order_id', orId);
        const config = {
            method: "post",
            url: `${baseUrl}/api/cancel-order-by-user`,
            token: userdetail?.token,
            headers: {
                Authorization: `Bearer ${userdetail?.token}`,
            },
            data: data
        };
        await axios.request(config).then((res) => {
            if (res.status == 200) {
                toast.success(res.data?.message)
                dispatch(getUserOrder(`/api/get-user-orders`, userdetail?.token))
                dispatch(handlePopup({ data: "test" }, "Add_Review", false))
            }
        }).catch((err) => {
            // console.log(err);
        })

    }

    const checkCancel = orderData?.order_items?.some(orderItems => 
        orderItems.trackings?.every(track => track.status === "0")
    );
    

    return (
        <div className='model-container '>
            <div className='model-content gap-2 ' style={{ position: "relative" }}>
                {!orderData ? <LoaderSmall /> :
                    <div className='d-flex justify-content-between'>
                        <b>Order Id #{orderData?.receipt_no}</b>
                        <span className='cursor-pointer' onClick={() => { dispatch(handlePopup({ data: "test" }, "Add_Review", false)) }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.38552 0.392699L7.99966 6.00684L13.5847 0.421788C13.7081 0.290477 13.8567 0.185433 14.0216 0.112955C14.1866 0.0404768 14.3645 0.00205708 14.5446 0C14.9304 0 15.3003 0.153235 15.5731 0.425996C15.8459 0.698756 15.9991 1.0687 15.9991 1.45444C16.0025 1.63276 15.9694 1.80989 15.9019 1.97496C15.8343 2.14003 15.7338 2.28956 15.6064 2.41437L9.94861 7.99943L15.6064 13.6572C15.8461 13.8917 15.9867 14.2093 15.9991 14.5444C15.9991 14.9302 15.8459 15.3001 15.5731 15.5729C15.3003 15.8456 14.9304 15.9989 14.5446 15.9989C14.3593 16.0065 14.1744 15.9756 14.0016 15.908C13.8288 15.8404 13.672 15.7376 13.5411 15.6062L7.99966 9.99201L2.40006 15.5916C2.27717 15.7185 2.13036 15.8199 1.9681 15.8898C1.80584 15.9597 1.63134 15.9967 1.45468 15.9989C1.06894 15.9989 0.698993 15.8456 0.426233 15.5729C0.153472 15.3001 0.000236647 14.9302 0.000236647 14.5444C-0.00315437 14.3661 0.0299297 14.189 0.0974587 14.0239C0.164988 13.8588 0.265537 13.7093 0.392936 13.5845L6.05071 7.99943L0.392936 2.34165C0.153222 2.10713 0.012657 1.78956 0.000236647 1.45444C0.000236647 1.0687 0.153472 0.698756 0.426233 0.425996C0.698993 0.153235 1.06894 0 1.45468 0C1.80374 0.00436332 2.13827 0.145444 2.38552 0.392699Z" fill="black" />
                            </svg>
                        </span>
                    </div>
                }
                {
                    orderData ?
                        <>
                            {
                                orderData?.order_items?.map((item, index) => {
                                    const checkReview = item?.product_reviews?.find((itemr) => itemr?.product_id == item?.product_id)
                                    return (
                                        <React.Fragment>
                                            <div className='d-flex gap-3 align-items-center' key={index} >
                                                <div className='purchase-image p-3' onClick={() => {
                                                    window.location.href = `/products/${item?.product_name?.replace(/ /g , "-")}-${item?.variant_name ?item?.variant_name?.replace(/ /g ,"-") : ""}?id=${item?.product_id}`
                                                }} >
                                                    <img src={baseUrl + "/" + item?.product_image} className='img-fluid' />
                                                </div>
                                                <div className='d-flex flex-column gap-2 '>
                                                    <p className='gray'><b> {item?.product_name?.substring(0, 35)}... </b> </p>
                                                    <p>{item?.variant_name || ""}</p>
                                                    <p className='commen-text ' style={{ textAlign: "start" }}>Price: {item?.product_price}</p>
                                                    <div className='d-flex justify-content-between align-items-center all-stars'>
                                                        {
                                                            checkReview &&
                                                            <span className='py-1'>
                                                                {[...Array(5)].map((_, index) => {
                                                                    const starValue = index + 1;
                                                                    return (
                                                                        <span
                                                                            key={index}
                                                                            style={{ cursor: 'pointer', color: starValue <= Number(checkReview?.rating) ? 'gold' : 'gray', fontSize: "30px" }}
                                                                        >
                                                                            ★
                                                                        </span>
                                                                    );
                                                                })}
                                                            </span>
                                                        }
                                                        {
                                                          checkReview ? "" :
                                                          item.order_status == "6" ?  <button className='btn border-none bg-white ' onClick={() => { dispatch(handlePopup({ ...item }, "Add_Review", true)) }}><b>Write Review</b></button>:""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                                <div>
                                                    <b>Tracking</b>
                                                    <ProgressBar tracking={item?.trackings} />
                                                </div>
                                        </React.Fragment>

                                    )
                                })
                            }
                            <div className='row border-bottom-g'>
                                <div className='col-lg-6 p-3 d-flex flex-column gap-2'>
                                    <p> <b>Shipping Details</b>  </p>
                                    <p className='gray bold-600'>{orderData?.address} </p>
                                    <p className='gray bold-600 '>{orderData?.city} <br />
                                        {orderData?.city} ,({orderData?.pincode}) -{orderData?.state} , {orderData?.country}
                                        {/* Sector 8, Noida, Uttar Pradesh, India, 110010 */}
                                    </p>

                                </div>
                                <div className='col-lg-6 p-3 d-flex flex-column gap-2'>
                                    <p> <b>Payment Methods</b>  </p>
                                    <p className='gray bold-600 '>
                                        {
                                            orderData?.payment_method == "cod" ? "Cash on Dilivery" : orderData?.payment_method
                                        }
                                        {/* == "cod" ? "Cash on Dilivery" :
                                    "Via Visa Card ending with 1889" */}
                                    </p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <div className='order-summery pt-1'>
                                        <h5>Order Summary </h5>
                                        <p className='d-flex justify-content-between py-1' ><b className='gray'>{orderData?.order_items?.length} Item(s) Subtotal:</b>{formatCurrency(Number(orderData?.subtotal),)} </p>
                                        <p className='d-flex justify-content-between py-1' ><b className='gray'>Shipping:</b> {orderData?.shipping_charges == "0" ? <span style={{ color: "green" }}> Free</span> : formatCurrency(Number(orderData?.shipping_charges),)}  </p>
                                        {
                                            orderData?.coupon_amount &&
                                            <>
                                                <p className='d-flex justify-content-between py-1' ><b className='gray'>Coupon Amount:</b> <span style={{ color: "green" }}> - {formatCurrency(Number(orderData?.coupon_amount),)} </span></p>
                                            </>
                                        }
                                        <p className='d-flex justify-content-between py-1' ><b className='gray'>Total:</b>{formatCurrency(Number(orderData?.grand_total),)} </p>
                                    </div>
                                </div>

                            </div>
                            <div className='d-flex justify-content-end gap-3'>
                                {
                                   checkCancel &&  <button className='c-btn bg-voilet text-light' onClick={() => {
                                        cancelOrder(orderData?.id)
                                    }}>Cancel Order</button>
                                }
                            </div>

                        </> :
                        ""
                }
            </div>
        </div>
    )
}

export default TrackOrder