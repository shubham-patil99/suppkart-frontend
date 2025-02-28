import React from 'react'
function Loader() {
    return (
        <div id='all-load' className='all-load'>
        <div className="loader-main">
            <div className="spinning">
                <img src="/assets/images/gainer.png" alt="" className="one" />
                <img src="/assets/images/gainer2.png" alt="" className="two" />
                <img src="/assets/images/davai.png" alt="" className="three" />
                <img src="/assets/images/top-deal-1.png" alt="" className="four" />
                <img src="/assets/images/top-deal-1.png" alt="" className="eight" />
            </div>
            <div className="cart">
                <img
                    src="/assets/images/loader-cart.webp"
                    width="100px"
                    height="100px"
                />
            </div>
        </div>
    </div>
    )
}

export default Loader