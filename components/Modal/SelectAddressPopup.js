import { deleteUserAddress } from "@redux/actions/userDetailsActions";
import { baseUrl } from "@utils/urls";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function SelectAddressPopup({
  proceedToCheckout,
  setCheckAddress,
  addressData,
  metadata,
  setshowPopup,
}) {
  const [showPopup, setShowPopup] = useState(true);
  const userData  = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [userAddressD, setuserAddress] = useState(addressData?.find((item)=> item?.is_default == "yes"));

  useEffect(()=>{
    setuserAddress(addressData?.find((item)=> item?.is_default == "yes"))
  },[addressData])
 
  const deleteUserAdd = async (id) => {
    let data = new FormData();
    data.append("address_id", id);
    let config = {
      method: "post",
      url: `${baseUrl}/api/delete-user-address`,
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
      data: data,
    };
    dispatch(deleteUserAddress(config));
  };

  return (
    <>
      {showPopup && (
        <div className="coupon-popup adress-popup">
          <div
            className="coupon-item"
            style={{ minWidth: "550px", position: "relative" }}
          >
            <div className="itmss">
              <span
                className="cross-icon"
                onClick={() => {
                  setCheckAddress(false);
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.38552 0.392699L7.99966 6.00684L13.5847 0.421788C13.7081 0.290477 13.8567 0.185433 14.0216 0.112955C14.1866 0.0404768 14.3645 0.00205708 14.5446 0C14.9304 0 15.3003 0.153235 15.5731 0.425996C15.8459 0.698756 15.9991 1.0687 15.9991 1.45444C16.0025 1.63276 15.9694 1.80989 15.9019 1.97496C15.8343 2.14003 15.7338 2.28956 15.6064 2.41437L9.94861 7.99943L15.6064 13.6572C15.8461 13.8917 15.9867 14.2093 15.9991 14.5444C15.9991 14.9302 15.8459 15.3001 15.5731 15.5729C15.3003 15.8456 14.9304 15.9989 14.5446 15.9989C14.3593 16.0065 14.1744 15.9756 14.0016 15.908C13.8288 15.8404 13.672 15.7376 13.5411 15.6062L7.99966 9.99201L2.40006 15.5916C2.27717 15.7185 2.13036 15.8199 1.9681 15.8898C1.80584 15.9597 1.63134 15.9967 1.45468 15.9989C1.06894 15.9989 0.698993 15.8456 0.426233 15.5729C0.153472 15.3001 0.000236647 14.9302 0.000236647 14.5444C-0.00315437 14.3661 0.0299297 14.189 0.0974587 14.0239C0.164988 13.8588 0.265537 13.7093 0.392936 13.5845L6.05071 7.99943L0.392936 2.34165C0.153222 2.10713 0.012657 1.78956 0.000236647 1.45444C0.000236647 1.0687 0.153472 0.698756 0.426233 0.425996C0.698993 0.153235 1.06894 0 1.45468 0C1.80374 0.00436332 2.13827 0.145444 2.38552 0.392699Z"
                    fill="black"
                  />
                </svg>
              </span>
              <div className="d-flex justify-content-between align-items-center w-100">
                <p>Choose Address </p>
                <button
                  className="c-btn bg-light "
                  onClick={() => {
                    setshowPopup({
                      isOpen: true,
                    });
                  }}
                >
                  Add New
                </button>
              </div>
              {addressData?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`py-3 w-100 ${
                      item.is_default == "yes" ? "border-bottom-v" : ""
                    }  `}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="radio"
                        name="useraddress"
                        defaultChecked={item?.is_default == "yes"}
                        onClick={() => {
                          setuserAddress(item);
                        }}
                      />
                      <b> {item?.name} </b>
                      <p className="address-title">{item?.address_type}</p>
                    </div>
                    <p className=" my-2 text-dark bold-600">
                      {item?.address} {item?.locality}- ({item?.pincode}),{" "}
                      {item?.city}, {item?.state}
                    </p>
                    <div className="w-100">
                      <div className="d-lg-flex justify-content-between align-items-center ">
                        <p>
                          Mobile : <b>+91 {item?.mobile}</b>
                        </p>
                        <div className="d-flex  align-items-center gap-3">
                          <button
                            className="c-btn bg-light"
                            onClick={() => {
                              setshowPopup({
                                isOpen: true,
                                data: item,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="c-btn bg-light"
                            onClick={() => {
                              deleteUserAdd(item?.id);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            </div>
            <div className="d-flex justify-content-center align-items-center w-100">
                {userAddressD && (
                  <button
                    className={`c-btn ${
                      userAddressD ? "bg-voilet" : "bg-light"
                    }  text-light `}
                    onClick={() => {
                      if (userAddressD) {
                        proceedToCheckout(userAddressD);
                      } else {
                        toast.warning("Please select a valid address !");
                      }
                    }}
                  >
                    Continue
                  </button>
                )}
              </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SelectAddressPopup;
