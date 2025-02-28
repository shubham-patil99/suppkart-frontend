// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "CartListSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getCartList = (config,type ) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios.request({
            ...config,
            responseType: type
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
            toast.error('An error occurred. Please try again.');
        });
    };
};
