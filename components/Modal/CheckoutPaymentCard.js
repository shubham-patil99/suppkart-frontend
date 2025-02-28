import React from 'react'

function CheckoutPaymentCard() {
    return (
        <div className='order-summery pt-1'>
            <h5>Order Summary </h5>
            <p className='d-flex justify-content-between py-1' ><b className='gray'>Item(s) Subtotal:</b>₹550.00 </p>
            <p className='d-flex justify-content-between py-1' ><b className='gray'>Shipping:</b>₹50.00 </p>
            <p className='d-flex justify-content-between py-1' ><b className='gray'>Total:</b>₹590.00 </p>
            <p className='d-flex justify-content-between py-1' ><b className='gray'>Coupon Applied:</b>- ₹150.00 </p>
            <p className='d-flex justify-content-between py-1' ><b className='gray'>Grand Total:</b>₹450.00 </p>
            <button className='c-btn bg-voilet w-100 mt-3 text-light '>Proceed to Payment</button>
        </div>
    )
}

export default CheckoutPaymentCard