import { formatCurrency } from '@helpers/frontend'
import { baseUrl } from '@utils/urls'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopdealsCard({ details }) {

  // Function to format price and avoid rendering the price if it is zero
  const formatPrice = (price) => (price && price > 0 ? formatCurrency(Number(price)) : null);

  const renderDiscount = (price, oldPrice, discount, discountedPrice) => {
    if (discount > 0) {
      return (
        <div className="rate">
          <p>{discount}% off</p>
          <p>Save {formatPrice(discountedPrice || oldPrice)}</p>
        </div>
      );
    }
    return null;
  };

  const renderOldPrice = (price, oldPrice) => {
    if (oldPrice && oldPrice > price) {
      return <span>{formatPrice(oldPrice)}</span>;
    }
    return null;
  };

  const price = details?.product_attributes?.length > 0
    ? details?.product_attributes[0]?.price
    : details?.price;

  const oldPrice = details?.product_attributes?.length > 0
    ? details?.product_attributes[0]?.old_price
    : details?.old_price;

  const discount = details?.product_attributes?.length > 0
    ? parseInt(details?.product_attributes[0]?.discount)
    : parseInt(details?.discount);

  const discountedPrice = details?.product_attributes?.length > 0
    ? details?.product_attributes[0]?.discounted_price
    : details?.discounted_price;

  return (
    <div className="top-deals p-2">
      <div className="complt px-2">
        <h5>{details?.product_name}</h5>
        <div className="item-slider">
          <div className="left">
            <p className="cap"></p>
            {details?.product_attributes?.length > 0 && (
              <small>{details?.product_attributes[0]?.attribute_name}</small>
            )}
            <p>
              {formatPrice(price)}
              {renderOldPrice(price, oldPrice)}
            </p>
            {renderDiscount(price, oldPrice, discount, discountedPrice)}
            <Link href={details?.id ? `/products/${details?.slug?.toLowerCase()}-${
              details?.product_attributes[0]?.attribute_name?.replace(/ /g, "-") || ""}?id=${details?.id}` : ""}>
              View Product <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="right">
            <div className="bg"></div>
            <Image
              src={baseUrl + "/" + details?.thumbnail}
              fetchPriority="high"
              alt={details?.product_name}
              height={200}
              width={100}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopdealsCard;
