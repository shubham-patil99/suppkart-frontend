import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';
import axios from 'axios';
import Login from '@components/Modal/Login';
import { getCartListCount } from '@redux/actions/CartListCountActions';
import { getCartList } from '@redux/actions/CartListAction';
import { getUserdata } from '@redux/actions/userDataActions';
import { baseUrl } from '@utils/urls';
import { fetchSuccess } from '@redux/actions/userAuthActions';
import SignUp from '@components/Modal/SignUp';
import ResetPassword from '@components/Modal/ResetPassword';
import { openModal } from '@redux/actions/modalActions';
import Link from 'next/link';
import { BASE_URL } from '@constants/Common';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { persistor } from '../../redux/store';
import { getcategory } from '@redux/actions/categoryActions';
import Image from 'next/image';

const Sidebar = dynamic(() => import('./Sidebar'), {
  ssr: false, 
});

function Header() {
  const userData = useSelector((state) => state?.userData);
  const userData2 = useSelector((state) => state?.userData2);
  const categoryData = useSelector((state) => state?.categoryData);
  const dispatch = useDispatch()
  const [showPop, setShowpopup] = useState(false)
  const [cartCount, setCartCount] = useState()
  const [showProfile, setShowprofile] = useState(false)
  const [openSidebar, setopenSidebar] = useState(false)
  const { cartListCountData } = useSelector((state) => state.cartListCountData)
  const { cartWishListCountData } = useSelector((state) => state?.cartWishListCountData)
  const [loading, setLoading] = useState(false);
  const [searchSuggestionsData, setsearchSuggestions] = useState([])
  const [searchvalue, setsearchvalue] = useState("")
  const [serachKeyName, setserachKeyName] = useState();
  const modalData = useSelector((state) => state?.modalData)
  const navigate = useRouter()
  const [selectedCatID, setselectedCatID] = useState()



  const modalRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowprofile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (userData?.token) {
      dispatch(getUserdata(userData?.token))
    }
    if(categoryData?.categoryData?.length == 0){
      dispatch(getcategory("/api/get-all-categories"))
    }
  }, [])



  useEffect(() => {
    if (userData?.token) {
      const fetchCounts = async () => {
        try {
          if(!userData2?.data?.name){
            dispatch(getUserdata(userData?.token));
          }
          await Promise.all([
            dispatch(getCartList(`/api/get-cart-list`, userData?.token, "CartListSuccess")),
            dispatch(getCartListCount(`/api/get-cart-list-count?user_id=${userData?.userDetails?.id}`, userData?.token, "CartListCountSuccess")),
            dispatch(getCartListCount(`/api/get-user-wishlist-count`, userData?.token, "CartWishListCountSuccess")),
          ]);
        } catch (err) {
          // console.error("Error fetching counts:", err);
        }
      };
      fetchCounts();
    }
  }, [userData?.token]);


  const handleProductChange = (event) => {
    setselectedCatID(event?.id);
    const slug = event?.slug || event?.name?.replace(/ /g, "-").toLowerCase();
    navigate.push(`/category/${slug}?id=${event?.id}`);  
  };

  const searchSuggestions = async (e) => {
    setsearchvalue(e.target.value)
    if (e.target.value.length >= 1) {
      await axios.get(`${baseUrl}/api/suggest-product?query=${e.target.value.toString()}`).then((res) => {
        if (res?.status == 200) {
          setsearchSuggestions(res?.data?.data)
          setserachKeyName(res?.data?.name)
        }

      }).catch((err) => {
        // console.log(err);
      })
    }
  }



  return (
    <React.Fragment>
      {openSidebar && <Sidebar setopenSidebar={setopenSidebar} />}
      <header className="py-2">
        <div className="container-fluid">
          <div className="left">
            <Link href="/"><Image
              src={`${BASE_URL}/assets/icons/logo.webp`}
              alt="logo"
              width={72}
              height={72}
              layout="intrinsic"
              priority
            /></Link>
          </div>
          <div className="middle">
            <Image width={100} height={100} src={BASE_URL + "/assets/icons/hamburger.svg"} onClick={() => { setopenSidebar(true) }} style={{ width: "14px" }} alt="img" className="hamburger" />
            <div className="search-container">
              <i className="fa-solid fa-magnifying-glass serchc"></i>
              <select
                value={selectedCatID || ""}
                onChange={(event) => {
                  const selectedItem = categoryData?.categoryData?.find(
                    (item) => item.id === parseInt(event.target.value)
                  );
                  if (selectedItem) {
                    handleProductChange(selectedItem);
                  }
                }}
              >
                <option value="">All Categories</option>
                {categoryData?.categoryData?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.name}
                  </option>
                ))}
              </select>

              <div className='sugges_search' >
                <input type="search" value={searchvalue} onKeyPress={(e) => {
                  if (e.key == "Enter") {
                    navigate.push(`/search/${searchvalue?.replace(/ /g, "-")}`)
                    setsearchvalue("")
                  }
                }} onChange={(e) => {
                  searchSuggestions(e)
                }} placeholder="I’m shopping for..." />
                {
                  searchvalue != "" &&
                  <ul className='sugges_dev'>
                    {
                      searchSuggestionsData?.length > 0 ?
                        searchSuggestionsData?.map((item, index) => {
                          return (
                            <li className='cursor-pointer' key={index} onClick={() => {
                              navigate.push(`/${serachKeyName}/${item?.name?.replace(/ /g, "-")}?id=${item?.id}`)
                              setsearchvalue("")
                            }} >
                              <p> {item?.name || ""}</p>
                            </li>
                          )
                        }) : <li>Item Not found</li>
                    }
                  </ul>
                }
              </div>
            </div>
          </div>

          <div className="right">

            <a onClick={() => {
              if (userData.token) {
                navigate.push("/UserCart")
              } else {
                dispatch(openModal('Signin', {}));
              }
            }}>
              <i className="fa-solid fa-cart-shopping"></i>
              {userData.token && Number(cartListCountData) > 0 ? (
                <span>{cartListCountData}</span>
              ) : (
                Number(cartCount) > 0 ? <span>{cartCount}</span> : ""
              )}
            </a>

            <a onClick={() => {
              if (userData.token) {
                navigate.push("/WishList")
              } else {
                dispatch(openModal('Signin', {}));
              }
            }}>
              <i className="fa-solid fa-heart"></i>
              {userData.token && Number(cartWishListCountData) > 0 ? (
                <span> {cartWishListCountData}</span>
              ) : ""}
            </a>
            {userData.token ?
              <a onClick={() => {
                setShowprofile(!showProfile)
              }} className="sign-in"><i className="fa-solid fa-user"></i> <i className="fa-solid fa-chevron-down"></i></a> :
              <a onClick={() => {
                dispatch(openModal('Signin', {}));
              }} className="sign-in"><i className="fa-solid fa-user"></i> </a>
            }
          </div>
        </div>
        <div ref={modalRef} className={`profile-menu ${showProfile ? "show-profile" : ""} `}>
          <div className="name-num">
            <p className="name">Hello <span>
              {userData2?.data?.name || ""}
            </span></p>
            <p>+91 {userData2?.data?.phone}</p>
          </div>
          <div className="items">

            <Link href="/WishList"><Image width={100} height={100} style={{ height: "15px" }} src={BASE_URL + "/assets/icons/menu1.svg"} alt="img" /> Wishlist</Link>
            <Link href='/user/orders' ><Image width={100} height={100} style={{ height: "15px" }} src={BASE_URL + "/assets/icons/menu2.svg"} alt="img" /> Order</Link>
            <Link href="/UserDashboard"><Image width={100} height={100} style={{ height: "15px" }} src={BASE_URL + "/assets/icons/menu3.svg"} alt="img" /> Edit Profile</Link>
            <a
              onClick={() => {
                localStorage.removeItem('persist:root'); 
                persistor.purge(); 
                dispatch({ type: 'USER_LOGOUT' }); 
                dispatch(fetchSuccess({ user: "", token: "" })); 
                navigate.push("/");
                setShowprofile(false);
              }}
            >
              <Image width={100} height={100} style={{ height: "15px" }} src={BASE_URL + "/assets/icons/menu4.svg"} alt="img" /> Logout
            </a>
          </div>
        </div>
        <div className="blank"></div>
      </header>
      {
        (modalData.modalName == "Signin" && !userData.token) &&
        <Login setShowpopup={setShowpopup} />
      }
      {
        (modalData.modalName == "Signup" && !userData.token) &&
        <SignUp setShowpopup={setShowpopup} />}
      {
        modalData.modalName == "forgotPassword" &&
        <ResetPassword setShowpopup={setShowpopup} />
      }

    </React.Fragment>
  );
}

export default Header;
