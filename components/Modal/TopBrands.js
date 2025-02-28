import React, { useEffect, useState } from 'react';
import SectionsHeading from '../Cards/SectionsHeading';
import { baseUrl } from '../../utils/urls';
import { getbrand} from '../../redux/actions/brandActions';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';

function TopBrands() {
    const dispatch = useDispatch()
    const brandData  = useSelector((state) => state.brandData)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getbrand(`/api/get-brands?page=${currentPage}`))
            }, []);    

    return (
        <div className="top-brands container-fluid">
            <SectionsHeading title="Top Brands"/>
            <div className="all-brands ">
                {brandData?.brandData?.brands?.map((item, index) => (
                    <div key={index} className="img"> 
                        <Link href={`/brand/${item?.slug}?id=${item.id}`}>
                            <Image
                             src={`${baseUrl}/${item?.logo}`} 
                             className='img-fluid' 
                             width={100}
                             height={100}
                             style={{border:"1px solid #ccc",maxWidth:"151px"}}
                              alt={item.name}
                              priority />
                              
                        </Link>
                    </div>
                ))}
            </div>
            
        </div>
    );
}

export default TopBrands;
