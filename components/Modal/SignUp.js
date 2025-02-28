import React, { useState } from 'react'
import { hasValidationError, validatedFields, validationError } from '../../helpers/frontend';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFailure, userRegister } from '../../redux/actions/userAuthActions';
import LoaderSmall from './LoaderSmall';
import { closeModal, openModal } from '@redux/actions/modalActions';
import { BASE_URL } from '@constants/Common';
import Image from 'next/image';

function SignUp({ setShowpopup }) {
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch()
    const [isPassText, setIsPassText] = useState(false);
    const [isPassText2, setIsPassText2] = useState(false);
    const [isloading, setloading] = useState(false);
    const error = useSelector((state) => state?.userData.error);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        cpassword: "",
    })

    const onChangeHandle = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    }

    const validateInput = ["name", "email", "phone", "password", "cpassword"]

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validatedFields(formData, validateInput, setErrors)) {
            return;
        }
        dispatch(userRegister("/api/resgister-user", formData, setloading))
    }

    setTimeout(() => {
        if (error?.result || error?.response?.data?.error) {
            dispatch(fetchFailure({}))
        }
    }, 3000);
    console.log(error, "<<<<<<<<error");

    return (
        <form className='login-details' onSubmit={onSubmit}>
            <div className="login">
               
                <span className='cross-icon' onClick={() => {
                    dispatch(closeModal())
                }}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12.5" cy="12.5" r="12.5" fill="#424242" />
                        <path d="M6.07504 18.9243C5.92007 18.7693 5.83301 18.5591 5.83301 18.3399C5.83301 18.1207 5.92007 17.9105 6.07504 17.7554L11.3358 12.4947L6.07504 7.23393C5.92446 7.07802 5.84114 6.86921 5.84302 6.65247C5.8449 6.43572 5.93184 6.22839 6.08511 6.07513C6.23837 5.92186 6.44571 5.83492 6.66245 5.83304C6.87919 5.83116 7.088 5.91448 7.24391 6.06506L12.5047 11.3258L17.7654 6.06506C17.9213 5.91448 18.1301 5.83116 18.3469 5.83304C18.5636 5.83492 18.771 5.92186 18.9242 6.07513C19.0775 6.22839 19.1644 6.43572 19.1663 6.65247C19.1682 6.86921 19.0849 7.07802 18.9343 7.23393L13.6735 12.4947L18.9343 17.7554C19.0849 17.9113 19.1682 18.1202 19.1663 18.3369C19.1644 18.5536 19.0775 18.761 18.9242 18.9142C18.771 19.0675 18.5636 19.1544 18.3469 19.1563C18.1301 19.1582 17.9213 19.0749 17.7654 18.9243L12.5047 13.6636L7.24391 18.9243C7.08889 19.0793 6.87867 19.1663 6.65947 19.1663C6.44028 19.1663 6.23006 19.0793 6.07504 18.9243Z" fill="white" />
                    </svg>
                </span>
        <div className="img">
          <Image src={BASE_URL+"/assets/icons/logo.svg"} alt="" width={100} height={100} />
        </div>
                <div className="form-contr">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id='name' name='name' value={formData?.name} onChange={(e) => onChangeHandle(e)} placeholder='Enter your Name' style={hasValidationError(errors, "name") ? { borderBottom: "2px solid red" } : {}} />
                    {hasValidationError(errors, "name") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.name == "" && validationError(errors, "name")}</span>) : null}
                </div>
                <div className="form-contr">
                    <label htmlFor="number">Mobile Number</label>
                    <input type="number" id='number' name='phone' value={formData?.phone} onChange={(e) => onChangeHandle(e)} placeholder='Enter your Mobile Number' style={hasValidationError(errors, "phone") ? { borderBottom: "2px solid red" } : {}} />
                    {hasValidationError(errors, "phone") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{validationError(errors, "phone") ? validationError(errors, "phone") : ""}</span>) : null}
                </div>
                <div className="form-contr">
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' autoComplete='off' name='email' value={formData?.email} onChange={(e) => onChangeHandle(e)} placeholder='Enter your email' style={hasValidationError(errors, "email") ? { borderBottom: "2px solid red" } : {}} />
                    {hasValidationError(errors, "email") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{formData?.email == "" && validationError(errors, "email")}</span>) : null}
                </div>
                <div className="form-contr">
                    <label htmlFor="password">Password</label>
                    <input type={isPassText ? "text" : "password"} autoComplete='off' id='password' name='password' value={formData?.password} onChange={(e) => onChangeHandle(e)} placeholder='Enter your password' style={hasValidationError(errors, "password") ? { borderBottom: "2px solid red" } : {}} />
                    {hasValidationError(errors, "password") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{validationError(errors, "password") ? validationError(errors, "password") : ""}</span>) : null}
                    <span className='eye-icon' onClick={() => {
                        setIsPassText(!isPassText)
                    }}>
                        {
                            !isPassText ?
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="#590462"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>
                                : <svg viewBox="0 0 24 24" width="24" height="24" fill="#590462"><path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path></svg>
                        }
                    </span>
                </div>
                <div className="form-contr">
                    <label htmlFor="confirm">Confirm Password</label>
                    <input type={isPassText2 ? "text" : "password"} id='confirm' name='cpassword' value={formData?.cpassword} onChange={(e) => onChangeHandle(e)} placeholder='Confirm your password' style={hasValidationError(errors, "cpassword") ? { borderBottom: "2px solid red" } : {}} />
                    {hasValidationError(errors, "cpassword") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{(formData?.cpassword == "" || formData?.cpassword != formData?.password) && validationError(errors, "cpassword")}</span>) : null}
                    <span className='eye-icon' onClick={() => {
                        setIsPassText2(!isPassText2)
                    }}>
                        {
                            !isPassText2 ?
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="#590462"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>
                                : <svg viewBox="0 0 24 24" width="24" height="24" fill="#590462"><path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path></svg>
                        }
                    </span>
                </div>
                <div>
                    <p className="errs">{error?.result ? error?.result : error?.response?.data?.error ? error?.response?.data?.error : ""}</p>
                </div>
                <button type='submit'>REGISTER</button>
                <div className="not-acc">
                    <a onClick={() => {
                        dispatch(openModal('Signin', {}))
                    }}

                    >Login</a>
                </div>
            </div>
        </form>
    )
}

export default SignUp
