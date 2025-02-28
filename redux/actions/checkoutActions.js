// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "checkoutSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getCheckout = (config, data,  setShowOrderPopup = false) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios.request({
            ...config,
            data: data,
        })
        .then((response) => {
            if(response.data?.responseCode === 200) {
                dispatch(fetchSuccess(response.data.result));
            } else {
                dispatch(fetchFailure(response.data));
                // toast.error(response.data.result);
            }
        })
        .catch((error) => {
            dispatch(fetchFailure(error)); 
            toast.error(error?.response?.data?.error);
        });
    };
};
