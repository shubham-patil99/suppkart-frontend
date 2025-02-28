// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "UserOrderByIdSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getUserOrderById = (endpoint,token,data) => {
    return (dispatch) => {
        const config = {
            method: 'post',
            url: `${baseUrl}${endpoint}`,
            data:data,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
        dispatch(fetchRequest());
        axios.request(config)
            .then((response) => {
                if(response?.data.responseCode == 200){
                    dispatch(fetchSuccess(response?.data.result));
                    // console.log(response?.data.result);
                }
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
};
