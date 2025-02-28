import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { baseUrl } from "../../utils/urls";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { getCartListCount } from "@redux/actions/CartListCountActions";
import { getAddToCart } from "@redux/actions/addToCartActions";
import StarRating from "@components/StarRating";
import { formatCurrency } from "@helpers/frontend";
import { openModal } from "@redux/actions/modalActions";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

function ProductCard({ pLength, product, setLoading, hidebutton, setisLoading }) {
  const getCartListData = useSelector((state) => state.getCartListData);
  const getWishListData = useSelector((state) => state.getWishListData);
  const userData = useSelector((state) => state.userData);
  const navigate = useRouter()
  const dispatch = useDispatch();
  const [quntity, setQuantity] = useState(1);
  const [showWishListContent, setShowWishListContent] = useState(
    <span className="svg-img-icon">
      <svg
        width="15"
        height="14"
        viewBox="0 0 15 14"
      >
        <path d="M10.9091 0.333344C9.47727 0.333344 8.23227 1.00489 7.5 2.13027C6.76773 1.00489 5.52273 0.333344 4.09091 0.333344C3.00632 0.334657 1.96652 0.783347 1.19959 1.58098C0.432674 2.37862 0.00126314 3.46007 0 4.5881C0 6.65875 1.24091 8.81379 3.68864 10.9922C4.81026 11.9863 6.02183 12.8649 7.30636 13.616C7.36589 13.6493 7.43242 13.6667 7.5 13.6667C7.56758 13.6667 7.63411 13.6493 7.69364 13.616C8.97817 12.8649 10.1897 11.9863 11.3114 10.9922C13.7591 8.81379 15 6.65875 15 4.5881C14.9987 3.46007 14.5673 2.37862 13.8004 1.58098C13.0335 0.783347 11.9937 0.334657 10.9091 0.333344ZM7.5 12.7509C6.38114 12.0793 0.818182 8.53936 0.818182 4.5881C0.819084 3.68565 1.16418 2.82042 1.77774 2.18228C2.3913 1.54415 3.2232 1.18523 4.09091 1.1843C5.47364 1.1843 6.63477 1.95228 7.12159 3.189C7.15241 3.26703 7.20484 3.33378 7.27222 3.38075C7.3396 3.42773 7.41888 3.45281 7.5 3.45281C7.58112 3.45281 7.6604 3.42773 7.72778 3.38075C7.79516 3.33378 7.84759 3.26703 7.87841 3.189C8.36523 1.95228 9.52636 1.1843 10.9091 1.1843C11.7768 1.18523 12.6087 1.54415 13.2223 2.18228C13.8358 2.82042 14.1809 3.68565 14.1818 4.5881C14.1818 8.53936 8.61886 12.0793 7.5 12.7509Z" />
      </svg>
    </span>
  );

  const checkCartExist = getCartListData?.getCartListData.cart_list?.some(
    (item) =>
      item?.product_id == product?.id || item?.product_id == product?.product_id
  );

  const [showAddToCartListContent, setShowAddToCartListContent] = useState(
    checkCartExist ? "Go To cart" : "Add To Cart"
  );


  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const config = {
    method: "post",
    token: userData?.token,
    userData: userData?.userDetails,
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
  const addToCartItem = () => {
    let cartData = {};
    if (product?.product_attributes?.length > 0 &&
      product?.product_attributes[0]?.id) {
      cartData = {
        product_id: product?.product_attributes[0]?.product_id,
        price: product?.product_attributes[0]?.price,
        qty: quntity,
        product_hcn: product?.product_hcn,
        sku: product?.sku || "",
        variant_id: product?.product_attributes[0]?.id,
        old_price: product?.product_attributes[0]?.old_price,
        discount: product?.product_attributes[0]?.discount,
      };
    } else {
      cartData = {
        product_id: product?.id || product?.product_id,
        variant_id: product?.product_attributes[0]?.id,
        old_price: product?.old_price,
        qty: quntity,
        product_hcn: product?.product_hcn,
        discount: product?.discount,
        price: product?.price,
        sku: product?.sku || "",
      };
    }
    cartData.product_name = product?.product_name;
    cartData.product_image = product?.thumbnail;
    cartData.qty = quntity;


    if (userData?.token) {
      dispatch(
        getAddToCart(
          config,
          "/api/add-to-cart",
          cartData,
          "addToCart",
          setLoading
        )
      );
    } else {
      var cookieValueNew = (Cookies.get("addToCartData"));
      if (cookieValueNew !== undefined && cookieValueNew !== "undefined") {
        var addToCartData = JSON.parse(cookieValueNew);

        const cartDataArray = [...addToCartData];
        const isIdExist = cartDataArray.some(item => item.product_id === cartData.product_id);
        if (!isIdExist) {
          cartDataArray.push(cartData);
          Cookies.set("addToCartData", JSON.stringify(cartDataArray));
          Cookies.set("cartLength", cartDataArray.length.toString());
        }
        setShowAddToCartListContent("Go To Cart");
        if (showAddToCartListContent === "Go To Cart") {
          dispatch(openModal('Signin', {}));
        }
      } else {
        const cartDataArray = [cartData];
        Cookies.set("addToCartData", JSON.stringify(cartDataArray));
        Cookies.set("cartLength", cartDataArray.length.toString());
        setShowAddToCartListContent("Go To Cart");
      }
      if (showAddToCartListContent === "Go To Cart") {
        dispatch(openModal('Signin', {}));
      }
    }
  };

  const addToWishListItem = () => {
    if (userData?.token) {
      dispatch(
        getAddToCart(
          config,
          "/api/add-item-to-user-wishlist",
          {
            product_id: product?.id ? product.id : product?.product_id,
            variant_id:
              product?.product_attributes?.length > 0
                ? product?.product_attributes[0]?.id
                : "",
          },
          "wishlist",
          setLoading
        )
      );
    } else {
      dispatch(openModal('Signin', {}));
    }
  };

  const deleteToWishList = (id) => {
    if (setisLoading) { setisLoading(true) }
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: baseUrl + "/api/delete-item-from-user-wishlist/" + id,
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
      data: { whistlist_id: id },
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data?.responseCode == 200) {
          if (setisLoading) { setisLoading(false) }
          dispatch(
            getCartListCount(
              `/api/get-user-wishlist`,
              userData?.token,
              "WishListSuccess"
            )
          );
          dispatch(
            getCartListCount(
              `/api/get-user-wishlist-count`,
              userData?.token,
              "CartWishListCountSuccess"
            )
          );
        } else {
          if (setisLoading) { setisLoading(false) }
        }
      })
      .catch((error) => {
        if (setisLoading) { setisLoading(false) }
        toast.error(error?.response?.data?.message || "");
      });
  };

  useEffect(() => {
    const cookieValue = (Cookies.get("addToCartData"));
    if (cookieValue) {
      try {
        const addToCartData = JSON.parse(cookieValue);
        if (product && addToCartData && addToCartData[0]?.product_id) {
          const foundProduct = addToCartData.find(
            (item) =>
              item.product_id ===
              (product?.id ? product.id : product?.product_id)
          );
          if (foundProduct) {
            setShowAddToCartListContent("Go To Cart");
            return;
          }
        }
      } catch (error) {
        // console.error("Error parsing cookie:", error);
      }
    }
    if (
      product &&
      getCartListData.getCartListData &&
      getCartListData.getCartListData.cart_list
    ) {
      const cartList = getCartListData.getCartListData.cart_list;
      const foundProduct = cartList.find(
        (item) =>
          item.product_id == (product?.id ? product.id : product?.product_id)
      );
      if (foundProduct) {
        setShowAddToCartListContent("Go To Cart");
      }
    }
    if (
      product &&
      getWishListData.getWishListData &&
      getWishListData.getWishListData
    ) {
      const cartWishList = getWishListData.getWishListData;
      const foundWishListProduct = cartWishList.find(
        (item) =>
          item.product_id == (product?.id ? product.id : product?.product_id)
      );
      if (foundWishListProduct) {
        setShowWishListContent(
          <span
            className="svg-img-icon"
            onClick={() => {
              deleteToWishList(product?.wishlist_id || foundWishListProduct?.wishlist_id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 22"
              width="15"
            >
              <path
                fill="red"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </span>
        );
      } else {
        setShowWishListContent(
          <span className="svg-img-icon" onClick={() => {
            addToWishListItem();
          }}>
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"

            >
              <path d="M10.9091 0.333344C9.47727 0.333344 8.23227 1.00489 7.5 2.13027C6.76773 1.00489 5.52273 0.333344 4.09091 0.333344C3.00632 0.334657 1.96652 0.783347 1.19959 1.58098C0.432674 2.37862 0.00126314 3.46007 0 4.5881C0 6.65875 1.24091 8.81379 3.68864 10.9922C4.81026 11.9863 6.02183 12.8649 7.30636 13.616C7.36589 13.6493 7.43242 13.6667 7.5 13.6667C7.56758 13.6667 7.63411 13.6493 7.69364 13.616C8.97817 12.8649 10.1897 11.9863 11.3114 10.9922C13.7591 8.81379 15 6.65875 15 4.5881C14.9987 3.46007 14.5673 2.37862 13.8004 1.58098C13.0335 0.783347 11.9937 0.334657 10.9091 0.333344ZM7.5 12.7509C6.38114 12.0793 0.818182 8.53936 0.818182 4.5881C0.819084 3.68565 1.16418 2.82042 1.77774 2.18228C2.3913 1.54415 3.2232 1.18523 4.09091 1.1843C5.47364 1.1843 6.63477 1.95228 7.12159 3.189C7.15241 3.26703 7.20484 3.33378 7.27222 3.38075C7.3396 3.42773 7.41888 3.45281 7.5 3.45281C7.58112 3.45281 7.6604 3.42773 7.72778 3.38075C7.79516 3.33378 7.84759 3.26703 7.87841 3.189C8.36523 1.95228 9.52636 1.1843 10.9091 1.1843C11.7768 1.18523 12.6087 1.54415 13.2223 2.18228C13.8358 2.82042 14.1809 3.68565 14.1818 4.5881C14.1818 8.53936 8.61886 12.0793 7.5 12.7509Z" />
            </svg>
          </span>
        );
      }
    }
  }, [product, getCartListData, getWishListData]);

  return (
    <div className={`${pLength && pLength == 1 ? "item card-itm single-item" : "item card-itm"}`}>
      {/* <LoaderSmall/> */}
      <div className="img sv-img">
        {!hidebutton && (
          <span
            className="wish-list-remove"
            onClick={() => {
              deleteToWishList(product?.wishlist_id);
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#424242" />
              <path
                d="M4.86013 15.1398C4.73615 15.0158 4.6665 14.8476 4.6665 14.6722C4.6665 14.4969 4.73615 14.3287 4.86013 14.2047L9.06873 9.99609L4.86013 5.78748C4.73966 5.66276 4.67301 5.49571 4.67451 5.32232C4.67602 5.14892 4.74557 4.98306 4.86818 4.86044C4.9908 4.73783 5.15666 4.66828 5.33006 4.66677C5.50345 4.66527 5.6705 4.73192 5.79523 4.85239L10.0038 9.06099L14.2124 4.85239C14.3372 4.73192 14.5042 4.66527 14.6776 4.66677C14.851 4.66828 15.0169 4.73783 15.1395 4.86044C15.2621 4.98306 15.3316 5.14892 15.3331 5.32232C15.3347 5.49571 15.268 5.66276 15.1475 5.78748L10.9389 9.99609L15.1475 14.2047C15.268 14.3294 15.3347 14.4965 15.3331 14.6699C15.3316 14.8433 15.2621 15.0091 15.1395 15.1317C15.0169 15.2543 14.851 15.3239 14.6776 15.3254C14.5042 15.3269 14.3372 15.2603 14.2124 15.1398L10.0038 10.9312L5.79523 15.1398C5.67121 15.2638 5.50303 15.3334 5.32768 15.3334C5.15232 15.3334 4.98414 15.2638 4.86013 15.1398Z"
                fill="white"
              />
            </svg>
          </span>
        )}
        {/* {product?.images && product.images.split(",").length > 1 ? ( */}
        {product?.thumbnail && product.thumbnail.split(",").length > 1 ? (
          <Slider {...settings}>
            {product.thumbnail?.split(",").map((imageUrl, index) => (
              <div key={index}>
                <Link className="product-imgggg"
          href={`/products/${product?.slug.toLowerCase()}-${product?.product_attributes[0]?.attribute_name ? product?.product_attributes[0]?.attribute_name?.replace(/ /g, "-") : ""}?id=${product?.id ? product.id : product?.product_id}`}
          >
                  <Image
                    src={`${baseUrl}/${imageUrl.trim()}`}
                    className="img-fluid category-image"
                    alt={product?.product_name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <Link
          href={`/products/${product?.slug.toLowerCase()}-${product?.product_attributes[0]?.attribute_name ? product?.product_attributes[0]?.attribute_name?.replace(/ /g, "-") : ""}?id=${product?.id ? product.id : product?.product_id}`}
            >
            <Image
              src={`${baseUrl}/${product.thumbnail}`}
              className="img-fluid category-image"
              fetchPriority="high"
              alt={product?.product_name}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </Link>
        )}
      </div>
      <div className="second-sec">
        {
          product?.rating_count == "0" ? "" :
            <StarRating
              averageRatio={product?.avg_rating}
              productReviewCount={product?.rating_count}
            />

        }
        <Link
          href={`/products/${product?.slug.toLowerCase()}-${product?.product_attributes[0]?.attribute_name ? product?.product_attributes[0]?.attribute_name?.replace(/ /g, "-") : ""}?id=${product?.id ? product.id : product?.product_id}`}
        >
          {product?.brand_name?.name && <p className="head"> {product?.brand_name?.name}</p>}

          <p className=" gray bold">{product?.product_name?.substring(0, 35)}</p>
        </Link>

        {product?.product_attributes?.length > 0 ? (
          <>
            <small>{product?.product_attributes[0]?.attribute_name} </small>
            <div className="rate">
              {parseInt(product?.product_attributes[0]?.discount) > 0 ? (
                <>
                  <span
                    style={{
                      color: "#388e3c",
                      fontSize: "15px",
                      letterSpacing: "-.2px",
                      fontWeight: "500",
                    }}
                  >
                    {parseInt(product?.product_attributes[0]?.discount)}% Off{" "}
                  </span> {" "}
                  <span style={{ textDecoration: "line-through" }}>
                    {" "}
                    {formatCurrency(
                      Number(product?.product_attributes[0]?.old_price)
                    )}{" "}
                  </span>
                </>
              ) : (
                ""
              )}
              <p className="">
                {" "} {formatCurrency(Number(product?.product_attributes[0]?.price))}{" "}
              </p>{" "}
            </div>
          </>
        ) : (
          <div className="rate">
            <p className="">{formatCurrency(Number(product?.price))} </p>{" "}
            {parseInt(product?.old_price) > 0 && (
              <span style={{ textDecoration: "line-through" }}>
                {" "}
                {formatCurrency(Number(product?.old_price))}{" "}
              </span>
            )}
            {parseInt(product?.discount) > 0 && (
              <span
                style={{
                  color: "#388e3c",
                  fontSize: "13px",
                  letterSpacing: "-.2px",
                  fontWeight: "500",
                }}
              >
                {" "} {parseInt(product?.discount)}% Off
              </span>
            )}
            {parseInt(product?.discounted_price) > 0 && (
              <span
                style={{
                  color: "#388e3c",
                }}
              >
                Saved {parseInt(product?.discounted_price)}
              </span>
            )}
          </div>
        )}
        {
          ((product.product_attributes?.length > 0 &&
            (product.product_attributes[0]?.price == null || product.product_attributes[0]?.price == "0.00"))
            || (product.product_attributes?.length == "0" && (product?.price == "null" || product?.price == "0.00"))) || (
              (product.product_attributes?.length > 0 && (product.product_attributes[0]?.quantity == null || product.product_attributes[0]?.quantity == "0"))
              || (product.product_attributes?.length == "0" && (product?.quantity == "null" || product?.quantity == "0"))
            ) ?
            "" :
            <div className="hover-btn">
              <i className="fa-solid fa-cart-shopping"></i>
              <span
                onClick={() => {
                  if (userData?.token) {
                    if (checkCartExist) {
                      navigate.push("/UserCart");
                    } else {
                      addToCartItem();
                    }
                  } else {
                    addToCartItem();
                  }
                }}
              >
                {userData?.token ? (
                  <>{checkCartExist ? "Go To cart" : "Add To Cart"}</>
                ) : (
                  <>{showAddToCartListContent} </>
                )}
              </span>
            </div>
        }
      </div>
      {
        window.location.pathname == "/WishList" ? "" :
          <div className="hover-icons">
            {showWishListContent}
          </div>
      }
    </div>
  );
}

export default ProductCard;
