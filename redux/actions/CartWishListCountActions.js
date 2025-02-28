// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "CartWishListCountSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getCartWishListCount = (config) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios.request(config)
            .then((response) => {
                if (response?.data.responseCode === 200) {
                    dispatch(fetchSuccess(response?.data.result));
                    // toast.success(response.data?.message);
                }
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
};
