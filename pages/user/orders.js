import React, { useEffect, useState } from "react";
import SectionsHeading from "@components/Cards/SectionsHeading";
import Layout from "@components/Layouts/Layout";;
import { getUserOrder } from "@redux/actions/getUserOrderActions";
import { useSelector, useDispatch } from "react-redux";
import dynamic from 'next/dynamic';

const PurchaseHistory = dynamic(() => import('@components/User/PurchaseHistory'), {
    ssr: false, // Disable SSR for this component
  });
const UserAdList = dynamic(() => import('@components/User/UserAdList'), {
    ssr: false, // Disable SSR for this component
  });
const UserProfile = dynamic(() => import('@components/User/UserProfile'), {
    ssr: false, // Disable SSR for this component
  });


function orders() {
  const userData  = useSelector((state) => state?.userData);
    const  userData2  = useSelector((state) => state?.userData2);
    const userOrderData = useSelector((state) => state.userOrderData?.userOrderData);
    const dispatch = useDispatch();
    const [showpopup, setshowPopup] = useState(false);
    // const pathN = window.location.pathname
    
    const [sidebartabs, setsidebartabs] = useState("Purchase History")
    const [showProfs, setshowProfs] = useState("false");
    const [userUpdatedDetails, setuserUpdatedDetails] = useState(); 

    useEffect(() => {
        dispatch(getUserOrder(`/api/get-user-orders`, userData?.token));
    }, []);

    return (
        <Layout showpopup={showpopup}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col bg-light">
                        <SectionsHeading title="User Dashboard" />
                    </div>
                </div>
                <div className="row mb-lg-2">
                    <div className="user-dash-container my-4">
                        <div className="p-3">
                            <h4>Profile Name</h4>
                            <p className="gray">{userData2?.data?.name || ""}</p>
                            <i
                                className="fa-solid fa-chevron-down"
                                id="profile-dropdown"
                                onClick={() => {
                                    setshowProfs(!showProfs);
                                }}
                            ></i>
                        </div>
                        <div className="row border-top-v">
                            <div
                                className={`col-lg-3 p-0 border-right-v ${showProfs ? "" : "show-alls"
                                    }`}
                            >
                                <div className="dashboard-sidebar border-bottom-g">
                                    <div className="sidebar-items">
                                        <p className="light-gray">ACCOUNT</p>
                                        <ul className="item-list p-0 m-0">
                                            <li>
                                                <a
                                                    href="#"
                                                    onClick={() => {
                                                        setsidebartabs("Profile");
                                                    }}
                                                    className={`${sidebartabs == "Profile" ? "isactive" : ""
                                                        }`}
                                                >
                                                    Profile
                                                </a>{" "}
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    onClick={() => {
                                                        setsidebartabs("Address");
                                                    }}
                                                    className={`${sidebartabs == "Address" ? "isactive" : ""
                                                        }`}
                                                >
                                                    Address
                                                </a>{" "}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="dashboard-sidebar">
                                    <div className="sidebar-items">
                                        <p className="light-gray">ORDERS</p>
                                        <ul className="item-list p-0 m-0">
                                            <li>
                                                <a
                                                    href="#"
                                                    onClick={() => {
                                                        setsidebartabs("Purchase History");
                                                    }}
                                                    className={`${sidebartabs == "Purchase History" ? "isactive" : ""
                                                        }`}
                                                >
                                                    Purchase History
                                                </a>{" "}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 p-lg-3">
                                {sidebartabs == "Address" ? (
                                    <UserAdList />
                                ) : sidebartabs == "Profile" ? (
                                    <UserProfile setuserUpdatedDetails={setuserUpdatedDetails} />
                                ) : sidebartabs == "Purchase History" ? (
                                    <PurchaseHistory userOrderData={userOrderData} />
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default orders