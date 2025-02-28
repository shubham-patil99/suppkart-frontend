// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "NewsLetterSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getNewsLetter = (endpoint ,data,setIsButtonDisabled) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios
            .post(`${baseUrl}${endpoint}`, data)
            .then((response) => {
                if(response.data?.responseCode == 200){
                    dispatch(fetchSuccess(response?.data.result));
                    toast.success(response?.data?.message);
                    setIsButtonDisabled(false);
                }else{ 
                    toast.error(response?.data?.result?.email[0]);
                    setIsButtonDisabled(false);
                }
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
                setIsButtonDisabled(false);
            });
    };
};
