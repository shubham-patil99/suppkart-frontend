import React, { useState, useEffect } from 'react';
import "../../styles/style.css";

function CouponPopup() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPopup && (
        <div className="coupon-popup">
          <div className="coupon-item">
            <i className="fa-solid fa-check"></i>
            <h4 className='text-center pt-3'>Coupen applied Successfully..!!</h4>
          </div>
        </div>
      )}
    </>
  );
}

export default CouponPopup;
