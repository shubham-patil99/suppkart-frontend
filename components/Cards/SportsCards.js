import React from 'react'
import { baseUrl } from '../../utils/urls';
import Image from 'next/image';

function SportsCards({ detials }) {
    return (
        <div className='sports-Cards p-3 d-flex gap-4 align-items-center '>
            <div>
                <Image
                    src={baseUrl + "/" + detials?.image}
                    alt='img'
                    height={200}
                    width={100}
                    unoptimized
                />
            </div>
            <div className='position-relative'>
                <h3 className='heading-one white-col'>
                    {detials?.name}
                </h3>
                <p className='text-one py-2 light-black'>
                    {detials?.expertise}
                </p >
                <p className='text-description'>
                    {detials?.description}
                </p>
                <div className='bg'></div>
            </div>
        </div>
    )
}

export default SportsCards