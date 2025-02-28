import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "@utils/urls";
import { formatCurrency, formatDate } from "@helpers/frontend";
import { getCartListCount } from "@redux/actions/CartListCountActions";
import Loader from "@components/Modal/Loader";
import Layout from "@components/Layouts/Layout";
import Breadcrums from "@components/Breadcrums/Breadcrums";
import SelectAddressPopup from "@components/Modal/SelectAddressPopup";
import CoupenPopupFalse from "@components/Modal/CoupenPopupFalse";
const AddAddress = dynamic(() => import('@components/Modal/AddAddress'), {
  ssr: false, // Disable SSR for this component
});
// import AddAddress from "@components/Modal/AddAddress";
import { getUserAddress } from "@redux/actions/userDetailsActions";
import LoaderSmall from "@components/Modal/LoaderSmall";
import dynamic from "next/dynamic";
import Link from "next/link";
function UserCart() {
  const userData = useSelector((state) => state?.userData);
  const userDetails = useSelector((state) => state?.userDetails);
  const getCartListData  = useSelector((state) => state.getCartListData);
  const totalA = Number(getCartListData.getCartListData?.cart_total);
 

  const [coupon, setCoupon] = useState("");
  const [couponPrice, setCouponPrice] = useState();
  const [showCouponPopupFalse, setShowCouponPopupFalse] = useState({
    isOpen: false,
    data: "",
  });

  const [data, setData] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState();
  const shippingCharges = data?.reduce((acc, currentItem) => {
    return acc + parseInt(currentItem?.shipping_cost || 0);
  }, 0);
  // proceedToCheckout

  const [shipingPrice, setShipingPrice] = useState(
    totalA > 2000 ? 0 : shippingCharges || 50
  );

  const [errorMessage, setErrorMessage] = useState();
  const [showpopup, setshowPopup] = useState({ isOpen: false, data: {} });
  const [cartTotal, setCartTotal] = useState();
  const [grandTotal, setGrandTotal] = useState();
  const [subTotal, setSubTotal] = useState();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);

 
  const [error, setError] = useState("");
  const breadcumsDetails = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Cart",
      path: "/",
    },
  ];

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const checkoutConfig = {
    method: "post",
    url: `${baseUrl}/api/create-user-order`,
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const appliedCoupon = async () => {
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/get-coupon-info`,
        { coupon_code: coupon },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      // console.log(response , "<<<<<<response");
      if (response?.data?.responseCode === 200) {
        // setcopenDetails()

        const couponDetail = response.data.result;
        const dateRangeParts = couponDetail?.date_range?.split(" to ");
        const startDate = new Date(
          formatDate(dateRangeParts[0]?.split(" ")[0])
        );
        const endDate = new Date(formatDate(dateRangeParts[1]?.split(" ")[0]));

        const currentDate = new Date();
        const formattedDate = `${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${currentDate.getFullYear()}`;
        const currentDate2 = new Date(formatDate(formattedDate));
        setIsButtonDisabled(false);
        // console.log(response.data.result?.coupon_type ,response, "<<<<<<<<response.data.result?.coupon_type");
        if (response.data.result?.coupon_type == "for_welcome") {
          // setErrorMessage(`${couponDetail?.coupon_code} Coupon Applied`)
          const checkUsageResponse = await axios.post(
            `${baseUrl}/api/check-coupon-usage`,
            { coupon_code: coupon },
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );
          // console.log(checkUsageResponse?.data , "<<<<<response?.data");
          if (checkUsageResponse?.data?.responseCode === 200) {
            setIsButtonDisabled(false);
            if (couponDetail.min_buy <= cartTotal) {
              let discountedAmount;
              if (couponDetail.discount_type === "percentage") {
                discountedAmount =
                  (parseFloat(couponDetail.discount) / 100) * Number(subTotal) >
                  parseFloat(couponDetail.max_discount)
                    ? parseFloat(couponDetail.max_discount)
                    : (parseFloat(couponDetail.discount) / 100) *
                      Number(subTotal);
                // console.log(discountedAmount, parseFloat(couponDetail.max_discount));
                setDiscountedPrice(subTotal - discountedAmount);
                setGrandTotal(subTotal - discountedAmount + shipingPrice);
                if (
                  (parseFloat(couponDetail.discount) / 100) * Number(subTotal) >
                  parseFloat(couponDetail.max_discount)
                ) {
                  toast.warning(
                    `Maximum Discount ${formatCurrency(
                      Number(couponDetail.max_discount)
                    )} `
                  );
                }
                toast.success(
                  `Discount applied: ${formatCurrency(
                    Number(discountedAmount)
                  )}`
                );
              } else if (couponDetail.discount_type === "amount") {
                discountedAmount = parseFloat(couponDetail.discount);
                setDiscountedPrice(subTotal - discountedAmount);
                setGrandTotal(subTotal - discountedAmount + shipingPrice);
                toast.success(`Discount applied: ${discountedAmount}`);
              }
              setShowCouponPopupFalse({
                isOpen: true,
                data: "SUCCESS",
                message: checkUsageResponse.data.message,
              });
            } else {
              setErrorMessage("Minimum purchase amount not met");
              setTimeout(() => {
                setErrorMessage("");
              }, 2000);
            }
            setCouponPrice(response.data.result.discount);
            setCoupon("");
          } else {
            setShowCouponPopupFalse({
              isOpen: true,
              data: "FAILED",
              message: checkUsageResponse.data.result,
            });
            return;
          }
        } else if (response.data.result?.coupon_type == "for_products") {
          // console.log(currentDate2 >= startDate && currentDate2 <= endDate, "<<<<<<<<currentDate2 <= endDate");
          if (currentDate2 >= startDate && currentDate2 <= endDate) {
            const cartitems = getCartListData.getCartListData.cart_list;
            const isCoupenAllow = cartitems.find((item) =>
              couponDetail?.product_id?.includes(item?.product_id)
            );
            // console.log(isCoupenAllow, "<<<<<isCoupenAllow");
            if (couponDetail?.min_buy <= cartTotal) {
              const productDiscount = cartitems?.reduce(
                (accumulator, currentItem) => {
                  if (
                    couponDetail.discount_type.toLowerCase() === "percentage"
                  ) {
                    const calculatedDis = couponDetail?.product_id?.includes(
                      currentItem?.product_id
                    )
                      ? (parseFloat(couponDetail.discount) / 100) *
                        Number(currentItem?.price)
                      : 0;
                    return accumulator + calculatedDis;
                  }
                  if (couponDetail.discount_type.toLowerCase() === "amount") {
                    const calculatedDis = couponDetail?.product_id?.includes(
                      currentItem?.product_id
                    )
                      ? Number(couponDetail?.discount)
                      : 0;
                    // console.log(calculatedDis , "<<<<calculatedDis" ,currentItem);
                    return accumulator + calculatedDis;
                  }
                },
                0
              );
              // console.log(productDiscount , "<<<<<<productDiscount")
              if (isCoupenAllow) {
                toast.success(
                  `Discount applied: ${formatCurrency(Number(productDiscount))}`
                );
                setDiscountedPrice(subTotal - (productDiscount || 0));
                // console.log("for_products coupen case",couponDetail ,productDiscount );
                setCouponPrice(response.data.result.discount);
                setErrorMessage(`${couponDetail?.coupon_code} Coupon Applied`);
                // setErrorMessage("");
                setTimeout(() => {
                  // setErrorMessage("")
                }, 2000);
              } else {
                toast.warning("Coupen is allowed for this product");
              }
            } else {
              setErrorMessage("Minimum purchase amount not met");
              // setTimeout(() => {
              //   setErrorMessage("")
              // }, 2000);
            }
          } else {
            setErrorMessage("Coupon is expired");
            setShowCouponPopupFalse({
              isOpen: true,
              data: "FAILED",
              message: "Coupon is expired",
            });
            // setTimeout(() => {
            //   setErrorMessage("")
            // }, 2000);
          }
        } else {
          // console.log(currentDate2 >= startDate && currentDate2 <= endDate, "<<<<<<<<currentDate2 <= endDate");
          if (currentDate2 >= startDate && currentDate2 <= endDate) {
            if (couponDetail.min_buy <= cartTotal) {
              let discountedAmount;
              if (couponDetail.discount_type.toLowerCase() === "percentage") {
                discountedAmount =
                  (parseFloat(couponDetail.discount) / 100) *
                    Number(subTotal) || 0;
                 setDiscountedPrice(subTotal - discountedAmount);
                setGrandTotal(subTotal - discountedAmount + shipingPrice);
                // if (((parseFloat(couponDetail.discount)) / 100) * Number(subTotal) > parseFloat(couponDetail.max_discount)) {
                //   toast.warning(`Maximum Discount ${formatCurrency(Number(couponDetail.max_discount),)} `);
                // }
                toast.success(
                  `Discount applied: ${formatCurrency(
                    Number(discountedAmount)
                  )}`
                );
                setCoupon("");
              } else if (couponDetail.discount_type === "amount") {
                discountedAmount = parseFloat(couponDetail.discount);
                setDiscountedPrice(subTotal - discountedAmount);
                setGrandTotal(subTotal - discountedAmount + shipingPrice);
                toast.success(`Discount applied: ${discountedAmount}`);
              }
              setErrorMessage(`${couponDetail?.coupon_code} Coupon Applied`);
              // setErrorMessage("");
              setTimeout(() => {
                // setErrorMessage("")
              }, 2000);
            } else {
              setErrorMessage("Minimum purchase amount not met");
              setTimeout(() => {
                setErrorMessage("");
              }, 2000);
            }
          } else {
            setErrorMessage("Coupon is expired");
            setTimeout(() => {
              setErrorMessage("");
            }, 5000);
          }
        }
      } else {
        setShowCouponPopupFalse({
          isOpen: true,
          data: "FAILED",
          message: response?.data?.result,
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      // console.error("Error applying coupon:", error);
      setIsButtonDisabled(false);
    }
  };

  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
    setError("");
  };
  let config = {
    method: "get",
    url: `${baseUrl}/api/get-user-address`,
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
  useEffect(() => {
    dispatch(getUserAddress(config));
  }, []);

  const checkItemInCart = async () => {
    const cartList = getCartListData.getCartListData.cart_list;
    const hasUnavailableProduct = cartList.some((item) => Number(item?.max_quantity) === 0);
    
    if (hasUnavailableProduct) {
      setError("Out of stock product remove from cart");
      return true;
    }
  };

  const proceedToCheckout = async (userAddressD) => {
    if (!paymentMethod) {
      setError("Please choose a payment method.");
      return;
    }
    const itemInCart = await checkItemInCart();
    if (itemInCart) {
      return;
    }

    if (
      userDetails?.userAddress?.length > 0 &&
      userData?.userDetails &&
      userDetails?.userAddress[0]?.is_default === "yes"
    ) {
     
      let formData = {
        email: userData?.userDetails?.email,
        name: userData?.userDetails?.name,
        address: userAddressD?.address,
        city: userAddressD.city,
        state: userAddressD.state,
        pincode: userAddressD.pincode,
        country: userAddressD.country,
        mobile: userAddressD.mobile,
        coupon_code: coupon,
        subtotal: subTotal,
        coupon_amount: discountedPrice
          ? Number(subTotal - discountedPrice)
          : couponPrice,
        shipping_charges: shipingPrice,
        extra_charges: "",
        gst_value: 18,
        grand_total: discountedPrice
          ? discountedPrice + (totalA > 2000 ? 0 : shipingPrice)
          : grandTotal,
        payment_method: paymentMethod,
        items: data,
      };

      await axios
        .request({
          ...checkoutConfig,
          data: formData,
        })
        .then((response) => {
          setisLoading(false);
          if (response.data?.responseCode === 200) {
            const addToCheckout = response.data?.result;
            if (addToCheckout?.id) {
              if (paymentMethod === "online") {
                proceedToPayment();
                localStorage.setItem("order_id", addToCheckout.id);
              } else if (paymentMethod === "cod") {
                window.location.href = `/VerifyPayment?payment_method=${addToCheckout.payment_method}&order_id=${addToCheckout?.id}&currency=INR&status=captured`;
              }
            }
          } else {
            toast.error(response.data.result);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
          setisLoading(false);
        });
    } else if (
      userDetails?.userAddress?.length > 0 &&
      userData?.userDetails &&
      userDetails?.userAddress[0]?.is_default === "no"
    ) {
      setshowPopup({
        isOpen: true,
        data: userDetails?.userAddress[0],
      });
    } else {
      setshowPopup({ isOpen: true });
    }
  };

  const proceedToPayment = async () => {
    setisLoading(true);
    try {
      const data = {
        amount: Math.round(grandTotal),
        currency: "INR",
        description: "Payment for policy no #23456",
        name: userData?.userDetails.name,
        contact: userDetails?.userAddress[0].mobile,
        email: userData?.userDetails.email,
      };

      const response = await axios.post(`${baseUrl}/api/payment/create`, data, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response, "<<<<<<<<<<response");
      if (response?.data?.responseCode == 200) {
        setisLoading(false);
        window.location.href = response.data.result[1].short_url;
        // window.open(response.data.result[1].short_url);
      } else {
        setisLoading(false);
        toast.error("Server Error");
      }
    } catch (error) {
      toast.error("Server Error");
      // console.error("Error creating order:", error);
      setisLoading(false);
    }
  };

  const [secLoad, setsecload] = useState({});
  const deleteCartItem = async (id) => {
    // setLoading(true);
    setsecload((pre) => ({ ...pre, [id]: true }));
    if (userData?.token) {
      let data = { cart_id: id };
      let url = `${baseUrl}/api/delete-cart-item`;
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response?.status === 200) {
        if (response?.data?.responseCode === 200) {
          // toast.success(response?.data?.result);
          dispatch(
            getCartListCount(
              `/api/get-cart-list`,
              userData?.token,
              "CartListSuccess"
            )
          );
          dispatch(
            getCartListCount(
              `/api/get-user-wishlist`,
              userData?.token,
              "WishListSuccess"
            )
          );
          dispatch(
            getCartListCount(
              `/api/get-cart-list-count?user_id=${userData?.userDetails?.id}`,
              userData?.token,
              "CartListCountSuccess"
            )
          );
          dispatch(
            getCartListCount(
              `/api/get-user-wishlist-count`,
              userData?.token,
              "CartWishListCountSuccess"
            )
          );
          // dispatch(getCartList(cartConfig));
          setDiscountedPrice();
        }
        setLoading(false);
        setTimeout(() => {
          setsecload((pre) => ({ ...pre, [id]: false }));
        }, 500);
      }
    }
  };

  const [loadingS, setLoadingS] = useState(true);
  const updateCartItemQuantity = async (
    variant_id,
    id,
    quantity,
    p_Id,
    index,
    aT,skuCode
  ) => {
    setLoadingS({ [p_Id]: true });
    if (userData && userData.token) {
      try {
        let formData = "";
        if (variant_id) {
          formData = { qty: quantity, cart_id: p_Id, varient_id: variant_id ,sku :skuCode };
        } else {
          formData = { qty: quantity, cart_id: p_Id, product_id: id,sku :skuCode };
        }
        const response = await axios.post(
          `${baseUrl}/api/update-cart-item-quantity`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        if (response?.data?.responseCode === 200) {
          // toast.success(response?.data?.result);
          const updatedData = [...data];
          updatedData[index].qty =
            aT == "plus"
              ? Number(updatedData[index].qty) + 1
              : Number(updatedData[index].qty) - 1;
          setData([...updatedData]);
          dispatch(
            getCartListCount(
              `/api/get-cart-list`,
              userData?.token,
              "CartListSuccess",
              setLoadingS
            )
          );
          // setLoadingS(false);
        } else {
          setLoadingS({ [p_Id]: false });
        }
      } catch (error) {
        // console.log(error);
        setLoadingS({ [p_Id]: false });
      }
    }
  };

  useEffect(() => {
    dispatch(
      getCartListCount(`/api/get-cart-list`, userData?.token, "CartListSuccess" ,setLoadingS)
    );
  }, []);

  // console.log("loadingS" ,loadingS);
  

  useEffect(() => {
    setData(getCartListData.getCartListData.cart_list);
  }, [deleteCartItem]);

  function removeDuplicatesByProductId(data) {
    const seen = new Set();
    return (
      data?.filter((entry) => {
        const duplicate = seen.has(entry.product_id);
        seen.add(entry.product_id);
        return !duplicate;
      }) || []
    );
  }

  useEffect(() => {
    const shipping_cost = removeDuplicatesByProductId(data)?.reduce(
      (cur, item) => {
        return cur + Number(item?.shipping_cost || 0);
      },
      0
    );
    setShipingPrice(
      totalA > 2000
        ? 0
        : shipping_cost
        ? shipping_cost
        : shipping_cost == 0
        ? shipping_cost
        : 50
    );
  }, [data]);

  useEffect(() => {

    setSubTotal(getCartListData.getCartListData.cart_total);
    setCartTotal(
      parseFloat(getCartListData.getCartListData.cart_total) +
        (totalA > 0 ? 0 : shipingPrice)
    );
    setGrandTotal(
      parseFloat(getCartListData.getCartListData.cart_total) +
        (totalA > 2000 ? 0 : shipingPrice) +
        (couponPrice ? -parseFloat(couponPrice) : 0)
    );
    setLoading(false);
  }, [couponPrice, data, getCartListData.getCartListData]);
  const [checkAddress, setCheckAddress] = useState(false);

  return (
    <Layout>
      {" "}
      {isLoading  ? (
        <Loader />
      ) : (
        <div className="container-fluid user-cart">
          <div className="row">
            <div className="col">
              <Breadcrums breadcumsDetails={breadcumsDetails} />
            </div>
          </div>
          <div></div>
          {data?.length > 0 ? (
            <div className="row">
              <div className="user-cart-container">
                <div className="product-table-mobile">
                  {data?.length > 0 ? (
                    data?.map((item, index) => {
                      return (
                        <div
                          className="item-wrapper"
                          style={{
                            position: "relative",
                            cursor:
                              Number(item?.max_quantity) === 0
                                ? "not-allowed"
                                : "auto",
                            background:
                              Number(item?.max_quantity) === 0
                                ? "#dcdcdc40"
                                : "",
                          }}
                          key={index}
                        >
                          {secLoad[item?.id] && <LoaderSmall />}
                          <div className="row">
                            <div className="col-lg-3 col-4">
                              <div className="cart-images ">
                                <a
                                  href={`/products/${item?.product_name?.replace(/ /g , "-")}/${
                                    item?.product_attributes
                                      ? item?.product_attributes[0]
                                          ?.attribute_name?.replace(/ /g ,"-")
                                      : ""
                                  }?id=${
                                    item?.product_id
                                  }`}
                                >
                                  <img
                                    src={
                                      baseUrl +
                                      "/" +
                                      (item?.product_image || "")
                                    }
                                    alt="img"
                                  />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-9 col-8 ">
                              <div className="row">
                                <div className="col-lg-4 col-12">
                                  <div className="">
                                    <div className="product-details-container cart-item-details">
                                      <h5 className="bold product-name">
                                        {item.product_name?.substring(0, 35)}{" "}
                                        <br />
                                        {item.variant_name || ""}
                                      </h5>
                                      <div className="d-flex align-items-center gap-2"></div>
                                      {Number(item?.max_quantity) === 0 ? (
                                        <p style={{ color: "red" }}>
                                          Out of stock
                                        </p>
                                      ) : Number(item.qty) ==
                                        Number(item?.max_quantity) ? (
                                        <p style={{ color: "red" }}>
                                          {item?.max_quantity} Quantity
                                          Available Only
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                      <p style={{ color: "red" }}>
                                        {item?.is_cod == "0"
                                          ? "COD is not available for this product"
                                          : ""}{" "}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-2 col-12 rate-quant">
                                  <div className="enter-quntity d-flex gap-2 align-items-center">
                                    {loadingS?.[item.id] && (
                                      <span className="qty-load">
                                        <svg
                                          viewBox="0 0 38 38"
                                          width="20"
                                          height="20"
                                          stroke="#000"
                                        >
                                          <g fill="none" fillRule="evenodd">
                                            <g
                                              transform="translate(1 1)"
                                              strokeWidth="2"
                                            >
                                              <circle
                                                strokeOpacity=".25"
                                                cx="18"
                                                cy="18"
                                                r="18"
                                              ></circle>
                                              <path d="M36 18c0-9.94-8.06-18-18-18">
                                                <animateTransform
                                                  attributeName="transform"
                                                  type="rotate"
                                                  from="0 18 18"
                                                  to="360 18 18"
                                                  dur="0.8s"
                                                  repeatCount="indefinite"
                                                ></animateTransform>
                                              </path>
                                            </g>
                                          </g>
                                        </svg>
                                      </span>
                                    )}

                                    <div className="quntity-arrow-btns">
                                      <i
                                        className="fa-solid fa-minus"
                                        onClick={() => {                                          
                                          if (Number(item?.qty) > 1) {
                                            updateCartItemQuantity(
                                              item.variant_id,
                                              item.product_id,
                                              parseInt(item.qty) - 1,
                                              item.id,
                                              index,
                                              "minus",
                                              item?.sku
                                            );
                                          }
                                        }}
                                      ></i>
                                    </div>
                                    <input
                                      type="number"
                                      placeholder="1"
                                      defaultValue={item?.qty}
                                      value={item.qty}
                                    />
                                    <div className="quntity-arrow-btns">
                                      <i
                                        className="fa-solid fa-plus"
                                        onClick={() => {
                                          if (
                                            Number(item?.max_quantity) >
                                            Number(item.qty)
                                          ) {
                                            updateCartItemQuantity(
                                              item.variant_id,
                                              item.product_id,
                                              parseInt(item.qty) + 1,
                                              item.id,
                                              index,
                                              "plus",
                                              item?.sku
                                            );
                                          }
                                        }}
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-12">
                                  <div className="cart-price-title">
                                    <p>{formatCurrency(Number(item?.price))}</p>
                                    {item.old_price > 0 && (
                                      <p className="price-title">
                                        M.R.P{" "}
                                        <span>
                                          {formatCurrency(
                                            Number(item.old_price)
                                          )}
                                        </span>
                                      </p>
                                    )}
                                    {item.discount > 0 && (
                                      <span
                                        style={{
                                          color: "#388e3c",
                                          fontSize: "13px",
                                          letterSpacing: "-.2px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {parseInt(item?.discount)}% Off{" "}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-3 col-12">
                                  <button
                                    className="c-btn bg-light text-dark "
                                    onClick={() => deleteCartItem(item.id)}
                                  >
                                    {" "}
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-prod">
                      <span>No products found</span>
                      <Link href="/">Add Now</Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center"></p>
          )}
          {data?.length > 0 ? (
            <div className="row mb-3">
              <div className="col-lg-4">
                <div className="copen-apply">
                  <span className="icon">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.7455 7.41493L7.58366 0.253104C7.5035 0.172635 7.40819 0.10884 7.30324 0.0653993C7.19829 0.0219583 7.08577 -0.000268222 6.97218 2.44257e-06H0.288437C0.211939 2.44257e-06 0.138575 0.030391 0.084483 0.084483C0.030391 0.138575 2.44257e-06 0.211939 2.44257e-06 0.288437V6.97219C-0.000268222 7.08577 0.0219583 7.19829 0.0653993 7.30324C0.10884 7.40819 0.172635 7.5035 0.253104 7.58367L7.41493 14.7455C7.49532 14.8262 7.59084 14.8902 7.69602 14.9338C7.8012 14.9775 7.91397 15 8.02785 15C8.14174 15 8.25451 14.9775 8.35968 14.9338C8.46486 14.8902 8.56039 14.8262 8.64078 14.7455L14.7477 8.63862C14.8283 8.55823 14.8923 8.4627 14.936 8.35752C14.9797 8.25234 15.0022 8.13958 15.0022 8.02569C15.0022 7.91181 14.9797 7.79904 14.936 7.69386C14.8923 7.58868 14.8283 7.49316 14.7477 7.41277L14.7455 7.41493ZM14.3374 8.23048L8.23048 14.3374C8.17641 14.3913 8.10315 14.4216 8.02677 14.4216C7.9504 14.4216 7.87714 14.3913 7.82307 14.3374L0.661238 7.17553C0.607337 7.12157 0.577002 7.04846 0.576871 6.97219V0.576872H6.97218C7.04845 0.577002 7.12157 0.607337 7.17553 0.661238L14.3374 7.82307C14.3913 7.87714 14.4216 7.9504 14.4216 8.02677C14.4216 8.10315 14.3913 8.17641 14.3374 8.23048ZM4.03808 3.46122C4.03808 3.57531 4.00425 3.68684 3.94086 3.78171C3.87748 3.87657 3.78738 3.95051 3.68197 3.99417C3.57657 4.03784 3.46058 4.04926 3.34867 4.027C3.23677 4.00474 3.13398 3.9498 3.05331 3.86912C2.97263 3.78845 2.91769 3.68566 2.89543 3.57376C2.87317 3.46186 2.8846 3.34587 2.92826 3.24046C2.97192 3.13505 3.04586 3.04495 3.14072 2.98157C3.23559 2.91818 3.34712 2.88435 3.46122 2.88435C3.61421 2.88435 3.76094 2.94512 3.86912 3.05331C3.97731 3.16149 4.03808 3.30822 4.03808 3.46122Z"
                        fill="#5A0563"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={coupon}
                    onChange={handleCouponChange}
                    required
                  />
                  <button
                    type="submit"
                    onClick={() => {
                      if (!isButtonDisabled) {
                        appliedCoupon();
                      }
                    }}
                    disabled={coupon == "" ? true : false}
                  >
                    Apply
                  </button>
                 
                </div>
                {couponPrice && (
                  <p className="d-flex justify-content-between py-1">
                    <b
                      className="gray"
                      style={
                        errorMessage == "Coupon is expired"
                          ? { color: "red" }
                          : { color: "#0ab70a" }
                      }
                    >
                      {errorMessage}
                    </b>
                  </p>
                )}
              </div>
              <div className="col-lg-4 radio-btns">
                <div>
                  <label
                    style={{
                      color: getCartListData.getCartListData.cart_list.some(
                        (item) => item.is_cod == "1"
                      )
                        ? "grey"
                        : "black",
                    }}
                  >
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={handlePaymentMethodChange}
                      disabled={
                        getCartListData.getCartListData.cart_list.some(
                          item => item.is_cod == "0"
                        )
                      }
                    />
                    Cash on Delivery
                  </label>
                  <label>
                    <input
                     type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={handlePaymentMethodChange}
                    />
                    Online Payment
                  </label>
                  {error && <div style={{ color: "red" }}>{error}</div>}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="order-summery pt-1">
                  <h5>Order Summary </h5>
                  <p className="d-flex justify-content-between py-1">
                    <b className="gray"> Subtotal Price:</b>{" "}
                    {formatCurrency(Number(subTotal))}
                  </p>

                  {discountedPrice ? (
                    <p className="d-flex justify-content-between py-1">
                      <b className="gray">Coupon Discount Price:</b>{" "}
                      <span style={{ color: "#0ab70a" }}>
                        {" "}
                        {formatCurrency(
                          Number(discountedPrice - subTotal)
                        )}{" "}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}

                  {discountedPrice ? (
                    <p className="d-flex justify-content-between py-1">
                      <b className="gray">Discounted Price:</b>{" "}
                      <span style={{ color: "#0ab70a" }}>
                        {" "}
                        {formatCurrency(Number(discountedPrice))}{" "}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
                  <p className="d-flex justify-content-between py-1">
                    <b className="gray">Shipping Fee:</b>
                    {totalA > 2000 || shipingPrice == 0 ? (
                      <span style={{ color: "#0ab70a" }}>FREE</span>
                    ) : (
                      <span>
                        {" "}
                        + {formatCurrency(Number(shipingPrice || 50))}{" "}
                      </span>
                    )}
                  </p>

                  {discountedPrice ? (
                    <p className="d-flex justify-content-between py-1">
                      <b className="gray">Total Price:</b>
                      {formatCurrency(
                        Number(
                          discountedPrice + (totalA > 2000 ? 0 : shipingPrice)
                        )
                      )}{" "}
                    </p>
                  ) : (
                    <p className="d-flex justify-content-between py-1">
                      <b className="gray">Total Price:</b>
                      {formatCurrency(
                        Number(cartTotal + (totalA > 2000 ? 0 : shipingPrice))
                      )}{" "}
                    </p>
                  )}
                  <button
                    className="c-btn bg-voilet w-100 mt-3 text-light"
                    onClick={() => {
                      dispatch(
                        getCartListCount(
                          `/api/get-cart-list`,
                          userData?.token,
                          "CartListSuccess"
                        )
                      );
                      setTimeout(() => {
                        checkItemInCart();
                        setCheckAddress(true);
                      }, 50);
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <p className="text-center no-prod">
                <span>No products found</span>
                <a href="/">Add Now</a>
              </p>
            </React.Fragment>
          )}
          <br></br>
        </div>
      )}
      {showpopup?.isOpen && (
        <AddAddress metadata={showpopup} setshowPopup={setshowPopup} />
      )}
      {/* {showOrderPopup?.isOpen && <OrderSuccess metadata={showOrderPopup} setshowPopup={showOrderPopup} />} */}
      {showCouponPopupFalse?.isOpen && (
        <CoupenPopupFalse
          metadata={showCouponPopupFalse}
          setshowPopup={setShowCouponPopupFalse}
        />
      )}
      {checkAddress && (
        <SelectAddressPopup
          setCheckAddress={setCheckAddress}
          // setuserAddress={setuserAddress}
          addressData={userDetails?.userAddress}
          metadata={showpopup}
          proceedToCheckout={proceedToCheckout}
          setshowPopup={setshowPopup}
        />
      )}
    </Layout>
  );
}

export default UserCart;
