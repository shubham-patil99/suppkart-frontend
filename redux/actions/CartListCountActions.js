// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts, actiontype) => ({
    type: actiontype,
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});



export const getCartListCount = (endpoint, token, type, setLoadingS) => {
    return (dispatch) => {
        const config = {
            method: 'get',
            url: `${baseUrl}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
        dispatch(fetchRequest());
        axios.request(config)
            .then((response) => {
                // console.log(response);
                if (response?.data.responseCode === 200) {
                    dispatch(fetchSuccess(response?.data.result, type));
                    if (setLoadingS) { setLoadingS(false) }
                } else {
                    if (setLoadingS) { setLoadingS(false) }
                    if (response?.data?.result == "User does not exist!") {
                        toast.error(response?.data?.result || "")
                        window.localStorage.clear()
                        window.location = "/"
                    }
                }
            })
            .catch((error) => {
                if (setLoadingS) { setLoadingS(false) }
                dispatch(fetchFailure(error));
            });
    };
};