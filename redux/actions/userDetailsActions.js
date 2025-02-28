// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { NewServiceCall } from '../../utils/config';
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});

export const fetchSuccess = (posts) => ({
    type: "RequestSuccess",
    payload: posts,
});


export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getUserAddress = (config) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        NewServiceCall(config).then((res) => {
            if (res?.responseCode == 200) {
                dispatch(fetchSuccess([...res?.result?.defalt_address, ...res?.result?.other_address]));
            }
        }).catch((err) => {
            console.log(err, "<<");
            dispatch(fetchFailure(err));
        })

    }
}

export const addUserAddress = (config, setshowPopup) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        NewServiceCall(config).then((res) => {
            if (res?.responseCode == 200) {
                setshowPopup({
                    isOpen: false,
                })
                // toast.success(res.message)
                dispatch(getUserAddress({ ...config, method: 'get', url: `${baseUrl}/api/get-user-address`, data: "" }))
            } else {
                toast.error(res?.message)
             dispatch(fetchFailure(res))
            }
        }).catch((err) => {
            console.log(err, "<<");
            toast.error(err.message)
            dispatch(fetchFailure(err));
        })

    }
}

export const deleteUserAddress = (config) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        NewServiceCall(config).then((res) => {
            // console.log(res, "<<<Sdc");
            if (res?.responseCode == 200) {
                toast.success(res.message)
                dispatch(getUserAddress({ ...config, method: 'get', url: `${baseUrl}/api/get-user-address`, data: "" }))
            } else {
                toast.error(res.message)
            }
        }).catch((err) => {
            console.log(err, "<<");
            toast.error(err.message)
            dispatch(fetchFailure(err));
        })

    }
}



