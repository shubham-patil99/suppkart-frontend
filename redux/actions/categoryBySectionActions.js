import axios from 'axios';
import { Failed, Pending } from './action.types';
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "CategoryBySectionSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getCategoryBySection = (endpoint) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios
            .get(`${baseUrl}${endpoint}`)
            .then((response) => {
                if(response?.data.responseCode == 200){
                    dispatch(fetchSuccess(response?.data.result));
                }
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
};
