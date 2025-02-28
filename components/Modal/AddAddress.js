import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '@utils/urls';
import { addUserAddress } from '@redux/actions/userDetailsActions';
import { hasValidationError, validatedFields, validationError } from '@helpers/frontend';

function AddAddress({ setshowPopup, metadata }) {
    const [errors, setErrors] = useState([]);
    const userData = useSelector((state) => state.userData)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        name: metadata?.data?.name || metadata?.data?.name || "",
        pincode: metadata?.data?.pincode || "",
        mobile: metadata?.data?.mobile || "",
        address: metadata?.data?.address || "",
        locality: metadata?.data?.locality || "",
        country: metadata?.data?.country || "",
        city: metadata?.data?.city || "",
        state: metadata?.data?.state || "",
        address_type: metadata?.data?.address_type || "",
        is_default: metadata?.data?.is_default || "",
        address_id: metadata?.data?.id || "",
    })

    let config = {
        method: 'post',
        url: `${baseUrl}/api/${metadata?.data?.id ? "update" : "add"}-user-address`,
        headers: {
            'Authorization': `Bearer ${userData?.token}`,
        },
        data: formData
    }

    const onChangeHandle = (e) => {
        const { name, value } = e.target
        if (e.target.type == "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: e.target.checked == false ? "no" : "yes" }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const validateInput = ["name", "pincode", "mobile", "city", "state", "address"]
    const onSubmit = (e) => {
        e.preventDefault();
        if (!validatedFields(formData, validateInput, setErrors)) { return; }
        dispatch(addUserAddress(config, setshowPopup))
    }

    const [addData, setaddDaata] = useState()
    const handlePincode = async (e) => {
        const { name, value } = e.target
        if (value?.length >= 6) {
            await axios.get(`https://api.postalpincode.in/pincode/${value}`).then((res) => {
                if (res.status == 200) {
                    let resN = res.data[0]
                    if (resN?.Status == 404 || resN?.Status == "Error") {
                        toast.error(resN?.Message)
                    } else {
                        setaddDaata(resN)
                        setTimeout(() => {
                            setFormData((preD) => ({
                                ...preD,
                                city: resN?.PostOffice[0]?.District,
                                state: resN?.PostOffice[0]?.State,
                                country: resN?.PostOffice[0]?.Country,
                            }))
                        }, 50);

                    }
                }
            }).catch((err) => {
                // console.log(err);
            })

        }

    }

    useEffect(()=>{
        if(metadata?.data?.pincode){
            handlePincode({target:{value:metadata?.data?.pincode}})
        }
    },[])

    return (
        <form className='login-details add-address' onSubmit={(e) => { onSubmit(e) }} >
            {/* {userDetails?.loading && <Loader />} */}
            <div className="login">
                <div className=" py-2 d-flex justify-content-between">
                    <h4 className='heading bold-600'>
                        {
                            metadata?.data?.id ? "Update Address " : "Add Address"
                        }

                    </h4>
                    {/* <hr/> */}
                    <span className='cursor-pointer' onClick={() => {
                        if (setshowPopup) {
                            setshowPopup({
                                isOpen: false,
                            })
                        }
                    }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.38552 0.392699L7.99966 6.00684L13.5847 0.421788C13.7081 0.290477 13.8567 0.185433 14.0216 0.112955C14.1866 0.0404768 14.3645 0.00205708 14.5446 0C14.9304 0 15.3003 0.153235 15.5731 0.425996C15.8459 0.698756 15.9991 1.0687 15.9991 1.45444C16.0025 1.63276 15.9694 1.80989 15.9019 1.97496C15.8343 2.14003 15.7338 2.28956 15.6064 2.41437L9.94861 7.99943L15.6064 13.6572C15.8461 13.8917 15.9867 14.2093 15.9991 14.5444C15.9991 14.9302 15.8459 15.3001 15.5731 15.5729C15.3003 15.8456 14.9304 15.9989 14.5446 15.9989C14.3593 16.0065 14.1744 15.9756 14.0016 15.908C13.8288 15.8404 13.672 15.7376 13.5411 15.6062L7.99966 9.99201L2.40006 15.5916C2.27717 15.7185 2.13036 15.8199 1.9681 15.8898C1.80584 15.9597 1.63134 15.9967 1.45468 15.9989C1.06894 15.9989 0.698993 15.8456 0.426233 15.5729C0.153472 15.3001 0.000236647 14.9302 0.000236647 14.5444C-0.00315437 14.3661 0.0299297 14.189 0.0974587 14.0239C0.164988 13.8588 0.265537 13.7093 0.392936 13.5845L6.05071 7.99943L0.392936 2.34165C0.153222 2.10713 0.012657 1.78956 0.000236647 1.45444C0.000236647 1.0687 0.153472 0.698756 0.426233 0.425996C0.698993 0.153235 1.06894 0 1.45468 0C1.80374 0.00436332 2.13827 0.145444 2.38552 0.392699Z" fill="black" />
                        </svg>
                    </span>
                </div>
                <div className='row'>
                    <hr />
                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="name">Full Name*</label>
                            <input type="text" id='name' name='name' value={formData?.name} onChange={(e) => onChangeHandle(e)} placeholder='Enter your Name' />
                            {hasValidationError(errors, "name") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.name == "" && validationError(errors, "name")}</span>) : null}
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="number">Mobile Number*</label>
                            <input type="number" id='number' name='mobile' value={formData?.mobile} onChange={(e) => {
                                if(e.target.value?.length <= 10){onChangeHandle(e)}
                            }} placeholder='Enter your Mobile Number'  />
                            {hasValidationError(errors, "mobile") && (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{ validationError(errors, "mobile")}</span>) }
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="email">Pincode*</label>
                            <input type="number" id='email' name='pincode' value={formData?.pincode} onChange={(e) => {
                                if(e.target.value?.length <= 6){
                                    onChangeHandle(e)
                                    handlePincode(e)
                                }
                            }} placeholder='Enter your pincode' maxLength={6} />
                            {hasValidationError(errors, "pincode") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.pincode == "" && validationError(errors, "pincode")}</span>) : null}
                        </div>
                    </div>
                </div>
                <div className="form-contr py-lg-2">
                    <label htmlFor="password">Address*</label>
                    <input type="text" id='password' name='address' value={formData?.address} onChange={(e) => onChangeHandle(e)} placeholder='Enter your Address' />
                    {hasValidationError(errors, "address") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.address == "" && validationError(errors, "address")}</span>) : null}
                </div>
                <div className='row py-lg-2'>
                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="email">Locality/Town*</label>
                            <select id='email' name='locality' value={formData?.locality} onChange={(e) => onChangeHandle(e)}>
                                <option value="" selected >Select </option>
                                {
                                    addData?.PostOffice?.map((item , index)=>{
                                        return(
                                            <option value={item?.Name} key={index}>{item?.Name}</option>
                                        )
                                    })
                                }
                            </select>
                            {/* <input type="text" id='email' name='locality' value={formData?.locality} onChange={(e) => onChangeHandle(e)} placeholder='Enter your Town' /> */}
                            {/* {hasValidationError(errors, "locality") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.locality == "" && validationError(errors, "locality")}</span>) : null} */}

                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="number">City*</label>
                            <input type="text" id='number' name='city' value={formData?.city} onChange={(e) => onChangeHandle(e)} placeholder='Enter your City' />
                            {hasValidationError(errors, "city") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.city == "" && validationError(errors, "city")}</span>) : null}

                        </div>
                    </div>

                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="email">Country*</label>
                            <input type="text" id='email' name='country' value={formData?.country} onChange={(e) => onChangeHandle(e)} placeholder='Enter your Country' />
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className="form-contr">
                            <label htmlFor="name">State*</label>
                            <input type="text" id='name' name='state' value={formData?.state} onChange={(e) => onChangeHandle(e)} placeholder='Enter your State' />
                            {hasValidationError(errors, "state") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.state == "" && validationError(errors, "state")}</span>) : null}

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-lg-12'>
                        <h5 className='py-2'>Type Of Address</h5>
                    </div>
                    <div>
                        <ul className='d-flex gap-2 p-0 pt-2'>
                            <li className='d-flex gap-2'>
                                <input type='radio' name='address_type' checked={formData?.address_type == "Home" ? true : false} value={"Home"} onChange={(e) => onChangeHandle(e)} />
                                <p>Home</p>
                            </li>
                            <li className='d-flex gap-2'>
                                <input type='radio' name='address_type' checked={formData?.address_type == "Office" ? true : false} value={"Office"} onChange={(e) => onChangeHandle(e)} />
                                <p>Office</p>
                            </li>
                        </ul>
                        {
                            formData?.address_type == "Home" || formData?.address_type == "" ? "" :
                                <ul className=' p-0'>
                                    <li className='my-1 py-2 d-flex gap-2'>
                                        <input type='checkbox' name='isOpenOnSunday' value={formData?.isOpenOnSunday} onChange={(e) => onChangeHandle(e)} />
                                        <p>
                                            Is your office open on sunday
                                        </p>
                                    </li>
                                    <li className='my-1 py-2 d-flex gap-2'>
                                        <input type='checkbox' name='isOpenOnSaturday' value={formData?.isOpenOnSaturday} onChange={(e) => onChangeHandle(e)} />
                                        <p>
                                            Is your office open on saturday
                                        </p>
                                    </li>
                                </ul>

                        }
                        <hr />
                        <div className='d-flex gap-2'>
                            <input type='checkbox' name='is_default' checked={formData?.is_default == "yes" ? true : false} value={"yes"} onChange={(e) => onChangeHandle(e)} />
                            <p>   Set default </p>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-end gap-3'>
                    <button type='button' onClick={() => {
                        if (setshowPopup) {
                            setshowPopup({
                                isOpen: false,
                            })
                        }
                    }} className='c-btn btn-black'>Cancel</button>
                    <button type='submit' className='c-btn btn-voilet' onClick={() => {

                    }}>
                        {metadata?.data?.id ? "Save" : "Add "}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default AddAddress
