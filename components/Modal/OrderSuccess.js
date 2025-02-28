import React, { useState } from 'react'


function OrderSuccess({ setShowpopup }) {
    
    return (
       <div className='popup-success'>
            <div className='popup'>
                <i className="fa-solid fa-check"></i>
                <h2>Order Placed Successfully</h2>
            </div>
       </div>
    )
}

export default OrderSuccess
