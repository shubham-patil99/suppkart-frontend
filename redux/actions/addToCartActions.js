// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';
import { getCartListCount } from './CartListCountActions';
import { getCartWishListCount } from './CartWishListCountActions';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "AddToCartSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getAddToCart = (config, endpoint, data, type ,setLoading ,setShowAddToCartListContent ) => {
    return (dispatch) => {
        if(setLoading){
            setLoading(true)
        }
        dispatch(fetchRequest());
        axios.request({
            ...config,
            url: `${baseUrl}${endpoint}`,
            method: 'post',
            data: data,
            responseType: type
        })
        .then((response) => {
            const res = JSON.parse(response.data)
            // console.log(config , "<<<<<<response");
            if(res?.responseCode === 200) {
                if(setLoading){setLoading(false)}
                dispatch(fetchSuccess(response.data.result));
                dispatch(getCartListCount(`/api/get-cart-list-count?user_id=${config?.userData?.id}` ,config?.token ,"CartListCountSuccess"));
                dispatch(getCartListCount(`/api/get-user-wishlist-count` ,config?.token, "CartWishListCountSuccess"));
                dispatch(getCartListCount(`/api/get-cart-list`, config?.token, "CartListSuccess"));
                dispatch(getCartListCount(`/api/get-user-wishlist`, config?.token, "WishListSuccess"))
                // toast.success(res?.message);
                if(setShowAddToCartListContent && type == "addToCart"){
                    setShowAddToCartListContent("Go To Cart")
                }
            } else {
                dispatch(fetchFailure(response.data));

                toast.error(res.result?.sku[0]|| res.result?.product_id[0]);
                if(setLoading){setLoading(false)}
            }
        })
        .catch((error) => {
            dispatch(fetchFailure(error)); 
            if(setLoading){setLoading(false)}
            toast.error('An error occurred. Please try again.');
        });
    };
};
