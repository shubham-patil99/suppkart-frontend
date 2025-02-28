// actions/postActions.js
import axios from 'axios';
import { Failed, Pending, Success } from './action.types';
import { toast } from "react-toastify"
import { NewServiceCall } from '../../utils/config';
import { baseUrl } from '../../utils/urls';

export const fetchRequest = () => ({
    type: Pending,
});


export const fetchuserSuccess = (posts) => ({
    type: "RequestuserSuccess",
    payload: posts,
});

export const fetchFailure = (error) => ({
    type: Failed,
    payload: error,
});


export const getUserdata =  (token) => {
    return (dispatch) => {
        dispatch(fetchRequest());
        // setisLoading(true)
        let config = {
            method: 'get',
            url: `${baseUrl}/api/user-detail`,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
         NewServiceCall(config).then((res) => {
            if (res?.responseCode == 200) {
                dispatch(fetchuserSuccess(res?.result));
  
            }
            // setisLoading(false)
        }).catch((err) => {
            // setisLoading(false)
            // dispatch(fetchSuccess([...res?.result?.defalt_address, ...res?.result?.other_address]));
            dispatch(fetchFailure(err));
        })
       
    }
}
