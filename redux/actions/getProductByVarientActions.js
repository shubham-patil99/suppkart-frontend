// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "ProductByVarientSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getProductByVarient = (config,endpoint,data,setisLoading ) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        if(setisLoading){setisLoading(true)}
        const dataFor = new FormData()
        dataFor.append("product_id",data?.product_id)
        // data?.attribute_name?.split("\",\"")
        data?.attribute_name?.split("\",\"")?.map((item)=>{
            dataFor.append("attribute_name[]",item)
        })

        // console.log(data,data?.attribute_name?.split("\",\""), "<<<<<<<<data");
        axios.request({
            ...config,
            url: `${baseUrl}${endpoint}`,
            method: 'post',
            data: dataFor,
        })
        .then((response) => {
            if(setisLoading){setisLoading(false)}
            if(response.data?.responseCode === 200) {
                dispatch(fetchSuccess(response.data.result));
            } else {
                dispatch(fetchSuccess({result:"Not found"}));
             
            }
        })
        .catch((error) => {
            dispatch(fetchFailure(error)); 
            if(setisLoading){setisLoading(false)}
            toast.error('An error occurred. Please try again.');
        });
    };
};
