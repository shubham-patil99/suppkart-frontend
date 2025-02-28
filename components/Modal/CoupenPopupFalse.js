import React, { useState, useEffect } from "react";

function CoupenPopupFalse({ setshowPopup, metadata }) {
  useEffect(() => {
    setTimeout(() => {
      setshowPopup({isOpen:false});
    }, 3000);

  }, []);


  return (
    <>
  
      <div className="coupon-popup">
        <div className="coupon-item">
          {metadata?.data == "FAILED" ? (
            <>
              <i class="fa-solid fa-x"></i>
              <h4 className="text-center pt-3">
                {metadata?.message}
              </h4>
            </>
          ) : (
            <>
              <i className="fa-solid fa-check"></i>
              <h4 className="text-center pt-3">
                Coupen applied Successfully..!!
              </h4>
            </>
           )} 
        </div>
      </div>
      {/* )} */}
    </>
  );
}

export default CoupenPopupFalse;
