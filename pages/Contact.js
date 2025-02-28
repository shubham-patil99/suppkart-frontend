import React, { useState } from 'react'
import axios from 'axios'
import { hasValidationError, validatedFields } from '@helpers/frontend';
import Layout from '@components/Layouts/Layout';
import { baseUrl } from '@utils/urls';
import { toast } from 'react-toastify';
import Head from 'next/head';
import c from "@constants/Common";

function Contact() {
    const [formdata, setFormdata] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    })
    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormdata((pres) => ({
            ...pres,
            [name]: value
        }))
    }

    const validateInput = ["name", "email", "phone", "message"]

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validatedFields(formdata, validateInput, setErrors)) {
            return;
        }
        submitData()
    }


    const submitData = async () => {
        // document.getElementById("custom-loader-ssr").style.display = "block";

        const checkoutConfig = {
            method: "post",
            url: `${baseUrl}/api/contact-form`,
            headers: {
                //   Authorization: `Bearer ${userData?.token}`,
            },
            data: formdata
        };
        await axios.request(checkoutConfig).then((Res) => {
            // console.log(Res);
            if (Res?.data?.responseCode == 200) {
                toast.success(Res?.data?.message)
                setTimeout(() => {
                    setFormdata({
                        name: "",
                        phone: "",
                        email: "",
                        message: "",
                    })
                }, 50);

            } else {
                toast.error(Res?.data?.message)
            }
            // document.getElementById("custom-loader-ssr").style.display = "none";
        }).catch((err) => {
            toast.error(err?.message)
            // document.getElementById("custom-loader-ssr").style.display = "none";
            // console.log(err, "<<<<<<");
        })
    }


    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8" />
                <title>Contact US - {c.APP_NAME}</title>
                <meta name="author" content={c.APP_NAME} />
                <meta property="og:url" content={c.BASE_URL} />
                <meta property="og:site_name" content={c.APP_NAME} />
                <link rel="shortcut icon" href={`/favicon.png`} />
                <link rel="icon" href="/footer-logo.svg" />
                <link rel="canonical" href={`${c.BASE_URL}`} />
            </Head>
            <Layout>
                <div className="main-content-form section-pad">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="right">
                                    <h3>Love to hear from you,
                                        Get in touch 👋</h3>
                                    <form id="ContactFORM" method="post" onSubmit={onSubmit}>
                                        <div className="form-ctrl">
                                            <label htmlFor="name">Your Name</label>
                                            <input type="text" name="name" value={formdata?.name} onChange={handleChange} style={hasValidationError(errors, "name") ? { borderBottom: "2px solid red" } : {}} placeholder="Enter your name" required="" />
                                        </div>

                                        <div className="form-ctrl select-form">
                                            <label htmlFor="phone">Phone No.</label>
                                            <div className="phn-num">
                                                <input type="tel" name="phone" value={formdata?.phone} onChange={handleChange} style={hasValidationError(errors, "phone") ? { borderBottom: "2px solid red" } : {}} placeholder="Enter Phone Number" required="" id="num" pattern="[0-9]{10}" maxLength="10" />
                                            </div>
                                        </div>
                                        <div className="form-ctrl emil-sec">
                                            <label htmlFor="email">Your Email</label>
                                            <input type="email" name="email" value={formdata?.email} onChange={handleChange} style={hasValidationError(errors, "email") ? { borderBottom: "2px solid red" } : {}} placeholder="Enter your mail" required="" />
                                        </div>

                                        <div className="form-ctrl textarea-form">
                                            <label htmlFor="textarea">Message</label>
                                            <textarea rows="5" name="message" value={formdata?.message} onChange={handleChange} style={hasValidationError(errors, "message") ? { borderBottom: "2px solid red" } : {}} placeholder="Let tell us know your project about" required=""></textarea>
                                        </div>
                                        <button type="submit" id="sendButton" className="submit">Send message <i className="fa-solid fa-arrow-right"></i></button>
                                    </form>
                                    <div id="error"></div>
                                    <div id="response"></div>
                                </div>
                            </div>
                            <div className="col-lg-4 left-contect">
                                <div className="main-dv">
                                    <h4>Other ways to connect</h4>
                                    <p className="ligt-text">We' love to hear from you. Our friendly team is always here to assist you.</p>
                                    <div className="d-flex icon-cont">
                                        <i className="fa-regular fa-envelope"></i>
                                        <ul className="p-0 pt-2">
                                            <a href="#" className="d-flex">
                                                <p className="main-text">Reach us on email</p>
                                            </a>

                                            <li>
                                                <p className="ligt-text">Our friendly team is here to help.</p>
                                            </li>
                                            <li>
                                                <p className="dark-text">customercare@suppkart.com</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="d-flex icon-cont">
                                        <i className="fa-solid fa-phone"></i>
                                        <ul className="p-0 pt-2">
                                            <a href="#" className="d-flex">

                                                <p className="main-text">Phone</p>
                                            </a>

                                            <li>
                                                <p className="ligt-text">Mon-Fri from 8am to 5pm.</p>
                                            </li>
                                            <li>
                                                <p className="dark-text">+91 9085857070</p>
                                            </li>

                                        </ul>
                                    </div>
                                    <div className="d-flex icon-cont">
                                        <i className="fa-solid fa-location-dot"></i>
                                        <ul className="p-0 pt-2">
                                            <a href="#" className="d-flex">

                                                <p className="main-text">Office</p>
                                            </a>

                                            <li>
                                                <p className="ligt-text">Come say hello at our office HQ.</p>
                                            </li>
                                            <li>
                                                <p className="dark-text">SHOP NO- 3 , Shree Ram Market , Bilaspur chowk,  GURUGRAM, Haryana 122413
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Contact
