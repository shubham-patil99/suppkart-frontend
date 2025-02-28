import Breadcrums from '@components/Breadcrums/Breadcrums'
import Layout from '@components/Layouts/Layout'
import AddAddress from '@components/Modal/AddAddress'
import React, { useState } from 'react'

function Checkout() {
    const [showpopup, setshowPopup] = useState(false)
    const [isNewUser , setisNewUser ] = useState(true)
    const breadcumsDetails = [
        {
            title: "Home",
            path: "/"
        },
        {
            title: "Shopping Cart",

            path: "/"
        },
        {
            title: "Shopping Details",

            path: "/"
        },
    ]
    return (
        <Layout>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col'>
                        <Breadcrums breadcumsDetails={breadcumsDetails} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-8'>
                        <div className='user-address-detials'>
                            <div className='border-bottom-v d-flex justify-content-between align-items-center p-lg-3'>
                                <h5 className='text-dark'>
                                    CONTACT DETAILS
                                </h5>
                                <button className='c-btn  bg-light ' onClick={()=>{setshowPopup(true)}} >Add New Address</button>
                            </div>
                            <div className='border-bottom p-lg-3'>
                                <h6 className='gray'>DEFAULT ADDRESS</h6>
                                <div className='py-'>
                                    <div className='py-3 border-bottom-v '>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <input type='radio' name='useraddress' />
                                            <b> Mark jack </b>
                                            <p className='address-title'>Home</p>
                                        </div>
                                        <p className=' my-2 text-dark bold-600'>
                                            Harsh villa Near HDFC Bank Old DLF Sector 14,
                                            Gurugram.
                                        </p>
                                        <div className='w-100'>
                                            <div className='d-lg-flex justify-content-between align-items-center '>
                                                <p>
                                                    Mobile : <b>+91 6969696969</b>
                                                </p>
                                                <div className='d-flex  align-items-center gap-3'>
                                                    <button className='c-btn bg-light' onClick={()=>{setshowPopup(true)}}>Edit</button>
                                                    <button className='c-btn bg-light'>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='py-3'>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <input type='radio' name='useraddress' />
                                            <b> Mark jack </b>
                                            <p className='address-title'>Home</p>
                                        </div>
                                        <p className=' my-2 text-dark bold-600'>
                                            Harsh villa Near HDFC Bank Old DLF Sector 14,
                                            Gurugram.
                                        </p>
                                        <div className='w-100'>
                                            <div className='d-lg-flex justify-content-between align-items-center '>
                                                <p>
                                                    Mobile : <b>+91 6969696969</b>
                                                </p>
                                                <div className='d-flex  align-items-center gap-3'>
                                                    <button className='c-btn bg-light'>Edit</button>
                                                    <button className='c-btn bg-light'>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className='order-summery pt-1'>
                            <h5>Order Summary </h5>
                            <p className='d-flex justify-content-between py-1' ><b className='gray'>Item(s) Subtotal:</b>₹550.00 </p>
                            <p className='d-flex justify-content-between py-1' ><b className='gray'>Shipping:</b>₹50.00 </p>
                            <p className='d-flex justify-content-between py-1' ><b className='gray'>Total:</b>₹590.00 </p>
                            <p className='d-flex justify-content-between py-1' ><b className='gray'>Coupon Applied:</b>- ₹150.00 </p>
                            <p className='d-flex justify-content-between py-1' ><b className='gray'>Grand Total:</b>₹450.00 </p>
                            <button className='c-btn bg-voilet w-100 mt-3 text-light '>Proceed to Payment</button>
                        </div>

                    </div>
                </div>
            </div>
            {showpopup && <AddAddress setshowPopup={setshowPopup}/> }
        </Layout>
    )
}

export default Checkout
