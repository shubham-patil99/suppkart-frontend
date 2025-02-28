import React from 'react'

function SectionsHeading({ title, subTitle }) {
    return (

        <div className='col top-deals py-3 flex-column align-items-center '>
            <div className="heading">
                <h2 className='text-center'>{title}</h2>
                <div className="u-line"></div>
            </div>
                {
                    subTitle &&
                    <p className='commen-text py-2'>
                        {subTitle}
                    </p>
                }
        </div>
    )
}

export default SectionsHeading