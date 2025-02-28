import React from 'react'

import { baseUrl } from '@utils/urls'
import Layout from '@components/Layouts/Layout'
import Breadcrums from '@components/Breadcrums/Breadcrums'
import Head from 'next/head'

function Aboutus() {
    const breadcumsDetails = [
        { title: "Home", path: "/" },
        { title: "About us", path: "/" },
    ]
    const testArr = [
        {
            id: 1,
            title: "OUR STORY",
            heading: "About US",
            description: `Welcome to Suppkart, your ultimate destination for authentic supplements. At Suppkart, we're more than just a company; we're athletes ourselves, driven by the passion to provide fellow athletes with genuine, top-quality products. Our commitment to authenticity is unwavering; we import directly to ensure 100% genuine products, sparing our customers the risk of counterfeit supplements
            
            We understand the importance of trust in the products you use. That's why we guarantee that all our supplements are 100% authentic and genuine. We cater specifically to athletes, offering only 100% doping-free products. None of our offerings are banned by WADA, ensuring that you can perform at your best without any concerns about banned substances.

            Having experienced the struggle firsthand, we empathize with athletes' quest for authenticity amidst a sea of fake supplements. That's why we've embarked on this journey, offering genuine supplements at affordable prices, because we believe that every athlete deserves access to quality without breaking the bank. Our mission extends beyond profit margins; it's about empowering athletes to achieve their goals and representing India on the global stage with pride.
            `,
            sideImage: [
                'assets/images/back2A.png', 'assets/images/front2A.png'
            ],
        }
    ]
    
    
    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8" />
                <title>About Us</title>
                <link rel="canonical" href={`${baseUrl}`} />
            </Head>
           
            <Layout>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col'>
                            <Breadcrums breadcumsDetails={breadcumsDetails} />
                        </div>
                    </div>
                </div>
                <div className='banner-container'>
                    <div className='container-fluid d-flex align-items-center '>
                        <div>
                            <h2 className='text-light pb-3' > Welcome to Suppkart</h2>
                            <p className='text-light'> At Suppkart, we're more than just a company; we're athletes ourselves, driven by the passion to provide fellow athletes with genuine, top-quality products.</p>
                        </div>
                    </div>
                </div>
                <div className='container-fluid '>
                    <div>
                        {
                            testArr?.map((item, index) => {
                                return (
                                    <div key={index.toString()} className="all">
                                        <div key={index} className={`row py-3 align-items-center ${item?.id == 2 ? "flex-row-reverse" : ""}`}>
                                            <div className='col-lg-6 d-flex justify-content-center text-center'>
                                                <div className='left-content'>
                                                    <img src='assets/images/back2A.png' className='about-image1' />
                                                    <img src='assets/images/front2A.png' className='about-image2' />
                                                </div>
                                            </div>
                                            <div className='col-lg-6'>
                                                <div className='right-content'>
                                                    <div className='about-title gray bold-600'>
                                                        {item?.title}
                                                    </div>
                                                    <h2 className='bold-600 text-dark'>
                                                        {item?.heading}
                                                    </h2>
                                                    <p className='commen-text py-1 text-start'>
                                                    " Welcome to Suppkart, your ultimate destination for authentic supplements. At Suppkart, we're more than just a company; we're athletes ourselves, driven by the passion to provide fellow athletes with genuine, top-quality products. Our commitment to authenticity is unwavering; we import directly to ensure 100% genuine products, sparing our customers the risk of counterfeit supplements.
                                            
                                                    </p>
                                                    <p className='commen-text py-1 text-start'>
                                                        
                                                        We understand the importance of trust in the products you use. That's why we guarantee that all our supplements are 100% authentic and genuine. We cater specifically to athletes, offering only 100% doping-free products. None of our offerings are banned by WADA, ensuring that you can perform at your best without any concerns about banned substances.
                                                    
                                                    </p>
                                                    <p className='commen-text py-1 text-start'>
                                                        Having experienced the struggle firsthand, we empathize with athletes' quest for authenticity amidst a sea of fake supplements. That's why we've embarked on this journey, offering genuine supplements at affordable prices, because we believe that every athlete deserves access to quality without breaking the bank. Our mission extends beyond profit margins; it's about empowering athletes to achieve their goals and representing India on the global stage with pride.

                                                    </p>
                                                    <p className='commen-text py-1 text-start'>
                                                   <b> <i> Join us on this journey, where authenticity meets affordability, and together, let's elevate Indian sports to new heights. </i></b>"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="our-certification">
                                            <p className='about-title gray bold-600'>Our</p>
                                            <h2 className="bold-600 text-dark">Certifications</h2>
                                            <div className="d-flex all-imhgs">
                                                <img
                                                    src={"/footer/fssai.png"}
                                                    alt="logo"
                                                    className="logo-img"
                                                />
                                                <img
                                                    src={"/footer/secure.png"}
                                                    alt="logo"
                                                    className="logo-img"
                                                />
                                                <img
                                                    src={"/footer/authentic.png"}
                                                    alt="logo"
                                                    className="logo-img"
                                                />
                                                <img
                                                    src={"/footer/certified-Icon.png"}
                                                    alt="logo"
                                                    className="logo-img"
                                                />
                                                <img
                                                    src={"/footer/last-icn.png"}
                                                    alt="logo"
                                                    className="logo-img"
                                                />
                                                </div>
                                            </div>
                                        </div>
                                    
                                )
                            })
                        }
                    </div>
                   
                </div>
                {/* <div className='container-fluid background-light'>
                    <div className='row justify-content-center'>
                        <div className='text-center py-2'>
                            <h2>#Elite Athlete Nutrition ON INSTAGRAM</h2>
                            <p className='commen-text py-3 text-center'>The best thing about a monochrome product scheme</p>
                        </div>
                        <div className='row '>
                            <div className='Elite-item-contianer'>
                                {
                                    imageArray?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <img src={item} alt='img' />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div> */}
            </Layout>
        </React.Fragment>
    )
}
export default Aboutus