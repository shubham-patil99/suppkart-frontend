import { BASE_URL } from '@constants/Common';
import { getCategoryBySection } from '@redux/actions/categoryBySectionActions';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';

function Sidebar({ setopenSidebar }) {
    const dispatch = useDispatch()
    const  brandData = useSelector((state) => state.brandData)
    const  categoryData = useSelector((state) => state.categoryData)
    const  categoryBySectionData = useSelector((state) => state.categoryBySectionData)
    const [showSidebar, setShowSidebar] = useState(false)
    const [showSidebar2, setShowSidebar2] = useState(false)
    const [showSidebar3, setShowSidebar3] = useState({})
    const modalRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setopenSidebar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if(categoryBySectionData?.categoryBySectionData?.length ==0){
            dispatch(getCategoryBySection("/api/get-category-by-section"))
        }
    }, [])    

    return (
        <div ref={modalRef} className="main-sidebar">
            <div className="logo" >
                <Image src={BASE_URL + "/assets/icons/footer-logo.svg"} alt="logo" className="logo-img" width={100} height={100} />
                <i className="fa-solid fa-x" onClick={() => { setopenSidebar(false) }}></i>
            </div>
            <ul className="main-list">

                <li className={`has-dropdown ${showSidebar ? "showSidebar" : ""}`} onClick={() => { setShowSidebar(!showSidebar) }}>
                    <a href="#" className='main-a'><span>Brands</span> <span><i className="fa-solid fa-chevron-down"></i></span></a>
                    {brandData?.brandData?.brands?.map((item, index) => (
                        <ul key={index} >
                            <li  ><Link  onClick={() => { setopenSidebar(false) }} href={`/brand/${item?.slug}?id=${item.id}`}>{item.name}</Link></li>
                        </ul>
                    ))}
                </li>
                <li className={`has-dropdown ${showSidebar2 ? "showSidebar" : ""}`} onClick={() => { setShowSidebar2(!showSidebar2) }}>
                    <a href="#" className='main-a'><span>Categories</span> <span><i className="fa-solid fa-chevron-down"></i></span></a>
                    {categoryData?.categoryData?.map((item, index) => (
                        <ul key={index} >
                            <li onClick={() => { setopenSidebar(false) }}><Link href={`/category/${item.slug}?id=${item.id}`}>{item.name}</Link>
                            </li>
                        </ul>
                    ))}
                </li>
                {categoryBySectionData?.categoryBySectionData?.map((item, index) => (
                    <li className={`has-dropdown ${showSidebar3[`showSidebar3${index}`] ? "showSidebar" : ""}`} onClick={() => {
                        setShowSidebar3(() => ({
                            [`showSidebar3${index}`]: showSidebar3[`showSidebar3${index}`] && showSidebar3[`showSidebar3${index}`] == true ? false : true
                        }))
                    }} key={index}>
                        <a href="#" className='main-a'>
                            <span>{item?.product_section_name}</span>
                            <span><i className="fa-solid fa-chevron-down"></i></span>
                        </a>
                        {item.categories?.map((cate, index) => (
                            <ul key={index}>
                                <li onClick={() => { setopenSidebar(false) }}>
                                    <Link href={`/category/${cate?.slug}?id=${cate?.id}`}>
                                        {cate.name}
                                    </Link>
                                </li>
                            </ul>
                        ))}
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default Sidebar
