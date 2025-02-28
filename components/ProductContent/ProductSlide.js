import { baseUrl } from '@utils/urls'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function ProductSlide() {

    const [silderData, setsliderData] = useState([])
    const fetchData = async () => {
        await axios.get(`${baseUrl}/api/get-banner`).then((res) => {
            setsliderData(res.data.result)
        }).catch((err) => {
        })
    }
    useEffect(() => { fetchData() }, [])

    return (
        <div className="product-slide">
            <div className={`container-fluid items ${silderData?.length <= 2 && ""}`}>
                {
                    silderData?.map((item, index) => {
                        return (
                            <div className={`${(((index + 1) / 2) == 1) ? "a-product p-0" : "b-product p-0"} `} key={index}>
                                <Image
                                    src={item?.banner_image ? baseUrl + "/" + item?.banner_image : "#"}
                                    fetchPriority='high' alt={item?.alt_title}
                                    // fill
                                    height={100}
                                    width={400}
                                    style={{ maxHeight:"270px",width:"100%" }}
                                    unoptimized
                                    className=' img-fluid slider-banner-img' onClick={() => {
                                        window.location = item?.banner_url
                                    }} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ProductSlide
