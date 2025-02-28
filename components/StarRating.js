import React from 'react';

function StarRating({ productReviewCount, averageRatio }) {
  const yellowStar = "#FFD700";
  const greyStar = "#808080";
  const starColor = index => index < Math.floor(averageRatio) ? yellowStar : (index === Math.floor(averageRatio) ? `url(#half-${averageRatio})` : greyStar);

  return (
    <div className='d-flex align-items-center gap-2'>
      <span className='py-'>

        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              style={{ cursor: 'pointer', color: starValue <= averageRatio ? 'gold' : 'gray', fontSize: "27px" }} >
              ★
            </span>
          );
        })}
      </span>
      {/* <p className='gray bold-600'> - ({productReviewCount ? productReviewCount : 0}) Reviews </p> */}
    </div>
  );
}

export default StarRating;
