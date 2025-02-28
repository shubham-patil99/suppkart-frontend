import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { baseUrl } from '../../utils/urls';
import { toast } from 'react-toastify';
import { hasValidationError, validatedFields, validationError } from '../../helpers/frontend';
import LoaderSmall from './LoaderSmall';
import { BASE_URL } from '@constants/Common';

function UpdateProfile({ details, setShowpopup }) {
    const [isloading, setloading] = useState(false);
    const [newNumber, setnewNumber] = useState();
    const [formData, setFormData] = useState({
        phone: "",
    })
    const [otpsend, setotpsend] = useState("pass")
    const userData = useSelector((state) => state.userData);
    const [errors, setErrors] = useState([]);


    const handleSubmit = async () => {
        setloading(true)
        await axios.post(`${baseUrl}/api/generate-otp`, formData).then((res) => {
            if (res.data?.responseCode == 200) {
                setotpsend("otp")
                setloading(false)
                startTimer()
            } else {
                toast.error(res.data?.result)
                setloading(false)
            }
        }).catch((err) => {
            toast.error(err?.message)
            setloading(false)
        })
        // Handle form submission logic,https://ean.gocoolcare.com/api/change-phone-number use the 'token' parameter which is the reCAPTCHA response token
    };

    const validateInput = ["phone"]

    const verfyNumber = async () => {
        if (!validatedFields({ phone: newNumber }, validateInput, setErrors)) { return; }
        setloading(true)
        const data = new FormData()
        data.append("old_mobile", details?.number)
        data.append("new_mobile", newNumber)
        const config = {
            method: "post",
            url: `${baseUrl}/api/change-phone-number`,
            token: userData?.token,
            headers: {
                Authorization: `Bearer ${userData?.token}`,
            },
            data: data
        };
        await axios.request(config).then((res) => {
            if (res.data?.responseCode == 200) {
                toast.success(res.data?.message)
                setotpsend("otp")
                setloading(false)
                startTimer()
            } else {
                toast.error(res.data?.result)
                setloading(false)
            }
        }).catch((err) => {
            // console.log(err);
            toast.error(err?.response?.data?.result?.new_mobile || err?.response?.data?.result?.old_mobile || "")
            setloading(false)
        })
        // Handle form submission logic, use the 'token' parameter which is the reCAPTCHA response token
    };

    const [otpvalue, setotpValue] = useState("")

    useEffect(() => {
        setotpValue('');
    }, []);

    const verifyOtp = async () => {
        setloading(true)
        await axios.post(`${baseUrl}/api/verify-otp?phone=${newNumber}&otp=${otpvalue}`).then((res) => {
            if (res.data?.responseCode == 200) {
                setloading(false)
                toast.success(res.data?.message)
                setShowpopup({ isOpen: false })
            } else {
                setloading(false)
                toast.error(res.data?.result)
            }
        }).catch((err) => {
            setloading(false)
            toast.error(err?.message)
        })
    };

    let timer;
    let seconds = 60;
    function startTimer() {
        timer = setInterval(function () {
            seconds--;
            updateTimer();
            if (seconds <= 0) {
                clearInterval(timer);
                seconds = 60; // Reset to 60 seconds for the next countdown
            }
        }, 1000);
    }
    const [timershow, sertimershow] = useState()
    function updateTimer() {
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
        sertimershow('00:' + formattedSeconds)
    }

    return (
        <form className='login-details'>
            <div className="login" style={{ position: "relative" }}>
                {isloading && <LoaderSmall />}
                <span className='cross-icon'>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" onClick={() => setShowpopup({ isOpen: false })} >
                        <circle cx="12.5" cy="12.5" r="12.5" fill="#424242" />
                        <path d="M6.07504 18.9243C5.92007 18.7693 5.83301 18.5591 5.83301 18.3399C5.83301 18.1207 5.92007 17.9105 6.07504 17.7554L11.3358 12.4947L6.07504 7.23393C5.92446 7.07802 5.84114 6.86921 5.84302 6.65247C5.8449 6.43572 5.93184 6.22839 6.08511 6.07513C6.23837 5.92186 6.44571 5.83492 6.66245 5.83304C6.87919 5.83116 7.088 5.91448 7.24391 6.06506L12.5047 11.3258L17.7654 6.06506C17.9213 5.91448 18.1301 5.83116 18.3469 5.83304C18.5636 5.83492 18.771 5.92186 18.9242 6.07513C19.0775 6.22839 19.1644 6.43572 19.1663 6.65247C19.1682 6.86921 19.0849 7.07802 18.9343 7.23393L13.6735 12.4947L18.9343 17.7554C19.0849 17.9113 19.1682 18.1202 19.1663 18.3369C19.1644 18.5536 19.0775 18.761 18.9242 18.9142C18.771 19.0675 18.5636 19.1544 18.3469 19.1563C18.1301 19.1582 17.9213 19.0749 17.7654 18.9243L12.5047 13.6636L7.24391 18.9243C7.08889 19.0793 6.87867 19.1663 6.65947 19.1663C6.44028 19.1663 6.23006 19.0793 6.07504 18.9243Z" fill="white" />
                    </svg>
                </span>
                <div className="img">
                    <img src={BASE_URL + "/assets/icons/logo.svg"} alt="" />
                </div>
                {
                    otpsend == "otp" ?
                        <React.Fragment>
                            <p class="forgot-para">OTP has been sent to : {newNumber} </p>
                            <div className="form-contr">
                                <label htmlFor="name">OTP</label>
                                <input type="text" id='otp' name='otp' value={otpvalue} maxLength={6} onChange={(e) => { setotpValue(e.target.value) }} placeholder='Enter OTP' autoComplete='off' />
                                {/* {hasValidationError(errors, "otp") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{validationError(errors, "otp") ? validationError(errors, "otp") : ""}</span>) : null} */}
                            </div>
                            <button type='button' onClick={() => {
                                if (otpvalue == "") {
                                    toast.warning("Enter Otp")
                                } else { verifyOtp() }
                                // verifyOtpValidate()
                            }}> CONTINUE</button>
                            {/* <div className="not-acc">
                                <a style={timershow == "00:00" ? { textDecoration: "underline", cursor: "pointer" } : {}}
                                    onClick={() => {
                                        if (timershow == "00:00") {
                                            // onSubmitValidate()
                                        }
                                    }}
                                >Resend OTP  {timershow == "00:00" ? "" : timershow}</a>
                            </div> */}

                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="form-contr">
                                <label htmlFor="number">Old Mobile</label>
                                <input type="number" id='number' value={details?.number} disabled={true} placeholder='Enter Registerd Email' />
                            </div>
                            <div className="form-contr">
                                <label htmlFor="name">New Mobile </label>
                                <input type="number" id='name' name='phone' onChange={(e) => { setnewNumber(e.target.value) }} value={newNumber} placeholder='Enter New number' maxLength={10} />
                                {hasValidationError(errors, "phone") ? (<span style={{ color: "red", fontSize: "12px" }} className="has-cust-error">{validationError(errors, "phone") ? validationError(errors, "phone") : ""}</span>) : null}
                            </div>
                            <button type='button' onClick={() => {
                                if (newNumber) {
                                    verfyNumber()
                                } else {
                                    toast.warning("Please enter new number first")
                                }
                            }}>Send OTP</button>

                        </React.Fragment>
                }
            </div>
        </form>
    )
}

export default UpdateProfile
