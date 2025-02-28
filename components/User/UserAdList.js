import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { deleteUserAddress, getUserAddress } from '@redux/actions/userDetailsActions'
import AddAddress from '@components/Modal/AddAddress'
import { baseUrl } from '@utils/urls'
import { NewServiceCall } from '@utils/config'

function UserAdList() {
    const [showpopup, setshowPopup] = useState({
        isOpen: false,
        data: {}
    })
    const dispatch = useDispatch()
    const  userDetails = useSelector((state) => state.userDetails)
    const  userData = useSelector((state) => state.userData)

    let config = {
        method: 'get',
        url: `${baseUrl}/api/get-user-address`,
        headers: {
            'Authorization': `Bearer ${userData?.token}`,
        }
    }
    useEffect(() => { dispatch(getUserAddress(config)) }, [])
    const deleteUserAdd = async (id) => {
        let data = new FormData();
        data.append('address_id', id);
        let config = {
            method: 'post',
            url: `${baseUrl}/api/delete-user-address`,
            headers: {
                'Authorization': `Bearer ${userData?.token}`,
            },
            data: data
        }
        dispatch(deleteUserAddress(config))
    }
    const makeDefault = async (id) => {
        let data = new FormData();
        data.append('address_id', id);
        let config = {
            method: 'post',
            url: `${baseUrl}/api/make-user-address-default`,
            headers: {
                'Authorization': `Bearer ${userData?.token}`,
            },
            data: data
        }
        NewServiceCall(config).then((res) => {
            if (res?.responseCode == 200) {
                toast.success(res.message)
                dispatch(getUserAddress({ ...config, method: 'get', url: `${baseUrl}/api/get-user-address`, data: "" }))
            } else {
                toast.error(res?.result)
            }
        }).catch((err) => {

        })
    }

    return (
        <React.Fragment>
            <div className='section-details p-1'>
                <div className='border-bottom pb-3 d-flex align-items-center justify-content-between '>
                    <h4>Saved Address</h4>
                    <button className='c-btn bg-voilet text-light' onClick={() => {
                        setshowPopup({
                            isOpen: true,
                            data: ""
                        })
                    }}>Add New Address</button>
                </div>
                <div className='row p-2'>
                    {
                        userDetails?.userAddress.length == 0 &&
                        <p className='commen-text mb-2 text-center'>
                            You have not saved any addresses yet.<br />
                            <a href='#' onClick={() => {
                                setshowPopup({
                                    isOpen: true,
                                    data: ""
                                })
                            }}>
                                Add now
                            </a>
                        </p>
                    }
                    {
                        userDetails?.userAddress?.map((item, index) => {
                            return (
                                <div key={index} className='dashboard-address-list p-lg-3'>
                                    <h6 className='text-dark'><b>
                                        {item?.is_default == "yes" ? "DEFAULT ADDRESS" : "Others Address"}
                                    </b></h6>
                                    <div className='address-container'>
                                        <div className='py-3'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <b> {item?.name} </b>
                                                <p className=' bg-voilet text-light py-1 px-2 bold-600'> {item?.address_type}</p>
                                            </div>
                                            <p className=' my-2 text-dark bold-600'>
                                                {item?.address} <br />
                                                {item?.locality}{"  -"} {item?.city}<br />
                                                {item?.state}
                                                ({item?.pincode})
                                            </p>
                                            <div className='w-100'>
                                                <div className=' '>
                                                    <p>
                                                        Mobile : <b>+91 {item?.mobile}</b>
                                                    </p>
                                                    {
                                                        item.is_default == "yes" ?
                                                            <div className='d-flex  align-items-center gap-3 pt-3'>
                                                                <button className='c-btn bg-dark text-light' onClick={() => {
                                                                    setshowPopup({
                                                                        isOpen: true,
                                                                        data: item
                                                                    })
                                                                }}>Edit</button>
                                                                <button className='c-btn bg-voilet text-light' onClick={() => {
                                                                    deleteUserAdd(item?.id)
                                                                }} >Delete</button>
                                                            </div> :
                                                            <div className='d-lg-flex justify-content-between align-items-center pt-3'>
                                                                <div className='d-flex  align-items-center gap-3 '>
                                                                    <button className='c-btn bg-dark text-light' onClick={() => {
                                                                        setshowPopup({
                                                                            isOpen: true,
                                                                            data: item
                                                                        })
                                                                    }}>Edit</button>
                                                                    <button className='c-btn bg-voilet text-light' onClick={() => {
                                                                        deleteUserAdd(item?.id)
                                                                    }}>Delete</button>
                                                                </div>
                                                                <div className='d-flex  align-items-center gap-2'>
                                                                    <input type='checkbox' checked={item.is_default == "yes"} onClick={() => {
                                                                        makeDefault(item.id)
                                                                    }} />
                                                                    <p>Make this default address</p>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            )
                        })
                    }
                    {showpopup?.isOpen && <AddAddress metadata={showpopup} setshowPopup={setshowPopup} />}
                </div>
            </div>
            {/* <Loader /> */}
        </React.Fragment>
    )
}

export default UserAdList
