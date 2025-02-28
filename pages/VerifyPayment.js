
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '@components/Layouts/Layout';
import { baseUrl } from '@utils/urls';
import { getUserOrderById } from '@redux/actions/getUserOrderByIdActions';

function VerifyPayment() {
    const location = window.location || {};
    const dispatch = useDispatch()
    const userData  = useSelector((state) => state.userData)
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (location.search && location.search.includes('razorpay_payment_id') && location.search.includes('razorpay_payment_link_id') && location.search.includes('razorpay_payment_link_reference_id') && location.search.includes('razorpay_signature')) {
            const Data = {
                razorpay_signature: searchParams.get('razorpay_signature'),
                razorpay_payment_id: searchParams.get('razorpay_payment_id'),
                razorpay_payment_link_id: searchParams.get('razorpay_payment_link_id'),
                razorpay_payment_link_reference_id: searchParams.get('razorpay_payment_link_reference_id'),
                payment_method:'online',
                order_id:localStorage.getItem('order_id'),
            };
            verifyPayment(Data)

        }
        if (location.search && location.search.includes('order_id')) {
            dispatch(getUserOrderById(`/api/get-user-single-order`, userData?.token, {}))
            const codData = { payment_method:searchParams.get('payment_method'), order_id:searchParams.get('order_id'), currency:searchParams.get('currency'),status:searchParams.get('status') };
            verifyPayment(codData)

        }
    }, [location.search]);




    const verifyPayment = async (Data) => {
        axios.post(`${baseUrl}/api/verify-order-payment`, Data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                if (response.data.result) {
                    window.location = (response.data.result);
                }
            })
            .catch(error => {
                // console.error("Error verifying payment:", error);
            });
    }

    return (
        <>
        <Layout>
            <div className="about-section">
                <section className="about-section ptb-100">
                    <div className="container">
                        <div className="row align-items-center verify-p">
                                    <p className="text-center py-5 ">{("We are verifying your payment please do not press the back button.")}</p>
                            
                        </div>
                    </div>
                </section>
            </div>
            </Layout>
        </>
    )
}

export default VerifyPayment
