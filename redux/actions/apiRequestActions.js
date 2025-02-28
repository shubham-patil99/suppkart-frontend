// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
const baseUrl = "http://localhost:5500/api"
const userData = localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")):null

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: Success,
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});

export const postCategoryRequest = (endpoint ,data) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios
            .post(`${baseUrl}${endpoint}`, {
                ...data,
                userId: userData?.userId
            })
            .then((response) => {
                dispatch(fetchSuccess(response.data));
            })
            .catch((error) => {
                dispatch(fetchFailure(error.message));
            });
    };
};


export const userLogin = (endpoint, data) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios.post(`${baseUrl}${endpoint}`, data).then((response) => {
            if (response?.status == 200) {
                toast.success(response?.data?.message)
                localStorage.setItem("userDetails", JSON.stringify(response?.data))
                window.location = "/"
            }else{
                toast.error("Please check your email !")
            }
            // console.log(res ,"<<<<<<res");

        })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
}




export const getRequest = (endpoint) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios
            .get(`${baseUrl}${endpoint}`)
            .then((response) => {
                // console.log(response , "<<<<");
                dispatch(fetchSuccess(response.data.users));
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
};
export const deleteRequest = (endpoint, id, token) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        axios
            .delete(`${baseUrl}${endpoint}/${id}`)
            .then((response) => {
                // console.log(response, "<<<<");
                if (response.status == 200) {
                    toast.success(response?.data.message)
                }
                dispatch(getRequest("/all-user"))
            })
            .catch((error) => {
                dispatch(fetchFailure(error));
            });
    };
};
