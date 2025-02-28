import moment from 'moment';
import React from 'react'

function ProgressBar({  tracking }) {

    const placed = tracking?.find((item) => item?.status == '0' )
    const shipped = tracking?.find((item) => item?.status == '5' )
    const packed = tracking?.find((item) => item?.status == '4' )
    const delivered = tracking?.find((item) => item?.status == '6' )
    const canceledCustomer = tracking?.find((item) => item?.status == '2' )
    const canceledadmin = tracking?.find((item) => item?.status == '1' )

    return (
        <div className="progress-bar container-fluid">
            <div className="tracking-title">
                <div className="point active " id="order-placed">Order Placed</div>
                {
                    !(canceledCustomer || canceledadmin) &&
                    <>
                        <div className={`point packedSet ${placed ? 'active' : ''}`} id="shipped">Packed</div>
                        <div className={`point ${shipped ? 'active' : ''}`} id="out-delivery">Shipped</div>
                    </>
                }
                {
                    canceledCustomer ?
                        <div className={`point ${delivered ? 'active' : ''}`} id="delivered">Canceled</div> :
                        canceledadmin ?
                            <div className={`point ${delivered ? 'active' : ''}`} id="delivered">Cancel By admin</div> :
                            <div className={`point ${delivered ? 'active' : ''}`} id="delivered">Delivered</div>


                }
            </div>
            <div className={`tracking-bar ${(canceledCustomer || canceledadmin) ? "cancel":""} `}>
                <div className={`one oneActive activetick  ${packed ? 'active' : ''} `}></div>
                <div className={`two  ${packed  ? 'activetick oneActive' : ''} ${shipped  ? ' active' : ''}`}></div>
                <div className={`three threeA   ${shipped ? ' activetick oneActive ' : ''} ${ delivered ? ' threeA active' : ''}`}></div>
            </div>
            <div className="tracking-date">
                {
                    placed &&
                    <div className="date">
                        {moment(placed?.Order_Placed_at).format("MM/DD/YYYY") || "..."} <br /> at  {moment(placed?.Order_Placed_at).format("HH:MM") || "..."}
                    </div>
                }
                {
                    packed &&
                    <div className="date dateSet"> {moment(packed?.Order_Packed_at).format("MM/DD/YYYY ") || "..."}
                        <br /> at  {moment(packed?.Order_Packed_at).format("HH:MM") || "..."}
                    </div>}
                {
                    shipped &&
                    <div className="date">{moment(shipped?.Order_Shipped_at).format("MM/DD/YYYY ") || "..."}
                        <br /> at  {moment(shipped?.Order_Shipped_at).format("HH:MM") || "..."}
                    </div>}
                {
                    delivered &&
                    <div className="date">{moment(delivered?.Order_Delivered_at).format("MM/DD/YYYY ") || "..."}
                        <br /> at  {moment(delivered?.Order_Delivered_at).format("HH:MM") || "..."}
                    </div>}
                {
                    canceledCustomer &&
                    <div className="date">{moment(canceledCustomer?.Cancelled_by_Customer_at).format("MM/DD/YYYY ") || "..."}
                        <br /> at  {moment(canceledCustomer?.Cancelled_by_Customer_at).format("HH:MM") || "..."}
                    </div>}
                {
                    canceledadmin &&
                    <div className="date">{moment(canceledadmin?.Cancelled_by_Admin_at).format("MM/DD/YYYY ") || "..."}
                        <br /> at  {moment(canceledadmin?.Cancelled_by_Admin_at).format("HH:MM") || "..."}
                    </div>}
            </div>


            {/* for cancel  */}

            
        </div>
    );
}

export default ProgressBar
