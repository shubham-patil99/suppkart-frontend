// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';
import { getAddToCart } from './addToCartActions';
import Cookies from 'js-cookie';
import { getUserdata } from './userDataActions';
import { showPopup } from './popupActions';
import { closeModal, openModal, updateMetadata } from './modalActions';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: Success,
    payload: posts,
});
export const updateUserDetailsAction = (posts) => ({
    type: "updateuser",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const userRegister = (endpoint, data, setloading) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        setloading(true)
        axios
            .post(`${baseUrl}${endpoint}`, data)
            .then((response) => {
                if (response.data?.responseCode == 200) {
                    toast.success(response.data?.message)
                    dispatch(openModal('forgotPassword', {...response.data.result, password: data?.password , newRegister: true}))
                    // dispatch(showPopup({metaDate:{...response.data.result, password: data?.password , newRegister: true}},"forgotPassword" , true))
                    setloading(false)
                } else {
                    setloading(false)
                    dispatch(fetchFailure(response.data));
                    toast.error(response.data?.result)
                }
            })
            .catch((error) => {
                // console.log(error);
                setloading(false)
                toast.error(error?.response?.data?.error)
                dispatch(fetchFailure(error));
            });
    };
};

const clearCartCookies = () => {
    Cookies.remove('addToCartData');
    Cookies.remove('cartLength');
};

export const userLogin = (endpoint, data, setloading) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        if (setloading) { setloading(true) }
        axios.post(`${baseUrl}${endpoint}`, data).then((response) => {
            // console.log("response>>>>>>" ,response);
            if (response?.status == 200) {
                if (response?.data?.responseCode >= 400) {
                    toast.error(response?.data?.result)
                }
                if (response?.data?.status == false) {
                    // dispatch(fetchFailure(response?.data))
                    dispatch(updateMetadata(response?.data));
                    if (setloading) { setloading(false) }
                } else {
                    toast.success(response?.data?.message)
                    dispatch(closeModal());
                    dispatch(fetchSuccess(response?.data?.result))
                    dispatch(getUserdata(response?.data?.result.token))
                    if (setloading) { setloading(false) }
                    var cookieValue = (Cookies.get('addToCartData'));
                    var addToCartData = JSON.parse(cookieValue);
                    // console.log("addToCartData" ,addToCartData);
                    
                    if (addToCartData) {
                        const cartData = addToCartData?.map((citem) => {
                            return {
                                product_id: citem?.product_id,
                                product_name: citem?.product_name,
                                product_image: citem?.product_image,
                                sku: citem?.sku,
                                price: citem?.price,
                                qty: citem?.qty,
                                variant_id: citem?.variant_id,
                                product_hcn: citem?.product_hcn,
                                old_price: citem?.old_price,
                                discount: citem?.discount,
                            }
                        })

                        const setLoading = false;
                        // console.log(response?.data?.result.token);
                        const config = {
                            method: 'post',
                            token: response?.data?.result.token,
                            userData: response?.data?.result?.user,
                            headers: {
                                'Authorization': `Bearer ${response?.data?.result.token}`,
                            },
                        }
                        cartData?.map((itemforP) => {
                            dispatch(getAddToCart(config, '/api/add-to-cart', itemforP, 'addToCart', setLoading));
                        })

                        clearCartCookies();
                    }
                    // window.location.reload()

                }
            } else {
                if (setloading) { setloading(false) }
                toast.error("Please check your email !")
            };

        })
            .catch((error) => {
                // console.log(error , ">>>");
                dispatch(fetchFailure(error));
                dispatch(updateMetadata(error));
                if (setloading) { setloading(false) }
                if (error?.response?.data?.data) {
                    dispatch(openModal('forgotPassword', {genrateOtp: "true",
                        ...error?.response?.data?.data, password: data?.password ,}));
                }
                // console.log(error, "<<<<<<<<<Adfsaf");
                toast.error(error?.response?.data?.errors)
            });
    };
}




export const getRequest = (endpoint) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios
            .get(`${baseUrl}${endpoint}`)
            .then((response) => {
                dispatch(fetchSuccess(response.data.users));
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
};


