import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NewServiceCall } from '../../utils/config';
import { baseUrl } from '../../utils/urls';
import { toast } from 'react-toastify';
import UpdateProfile from '../Modal/UpdateProfile';
import LoaderSmall from '../Modal/LoaderSmall';
import { useDispatch } from "react-redux";
import { getUserdata } from '../../redux/actions/userDataActions';

function UserProfile() {
    const  userData = useSelector((state) => state.userData)
    const  userData2 = useSelector((state) => state.userData2)
    const [formdataedit, setFormDataedit] = useState({})
    const [isLoading, setisLoading] = useState(false)
    const [showpopup, setShowpopup] = useState({
        isOpen: false,
        data: ""
    })
    const [formdata, setFormData] = useState({
        alternate_number: "",
        dob: "",
        email: "",
        email_verified_at: null,
        id: 12,
        image: null,
        name: "",
        phone: ""
    })

    const dispatch = useDispatch()
   
    useEffect(() => {
        if(userData?.token){
            dispatch(getUserdata(userData?.token))
        }
        setFormData({...userData2?.data})
    }, [showpopup?.isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (e.target.type == "file") {
            setFormData((prev) => ({
                ...prev, image: e.target.files[0]
            }))
            setFormDataedit((prev) => ({
                ...prev, image: e.target.files[0]
            }))
        } else {
            setFormDataedit((prev) => ({
                ...prev, [name]: value
            }))
            setFormData((prev) => ({
                ...prev, [name]: value
            }))
        }
    }
    const handleUpdate = async () => {
        setisLoading(true)
        var data = new FormData()
        Object.entries(formdataedit).map(([key, value]) => {
            data.append(key, value)
        })
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/update-profile`,
            headers: {
                'Authorization': `Bearer ${userData?.token}`,
            },
            data: data
        }
        await NewServiceCall(config).then((res) => {
            if (res?.responseCode == 200) {
                toast.success(res?.message)
                // getUserDetails()
                dispatch(getUserdata(userData?.token))
                setisLoading(false)
                
            } else {
                setisLoading(false)
                toast.error(res?.message)
            }
        }).catch((err) => {
            setisLoading(false)
            // console.log(err, "<<");
        })
    }
    return (
        <React.Fragment>
            <div className='section-details p-1' style={{position:"relative"}}>
               {isLoading && <LoaderSmall/>}
                <div className='border-bottom pb-3 '>
                    <h4 className='pt-lg-0 pt-3'>Edit Details</h4>
                </div>
                <div className='mt-lg-3'>
                    <div className=' align-items-end justify-content-between border-v p-lg-3 row'>
                        <div className='col-lg-6'>
                            <div className="form-contr">
                                <label htmlFor="name">Mobile Number*</label>
                                <input type="number" disabled={true} id='name' name='phone' value={formdata?.phone} onChange={(e) => handleChange(e)} placeholder='Enter your Mobile Number' />
                            </div>
                        </div>
                    <div className="small-margin col-lg-4">
                        <button className='c-btn bg-light text-dark' onClick={()=>{
                            setShowpopup({
                                isOpen:true
                            })
                        }}>Change Number</button>
                    </div>
                    </div>
                </div>
                <div className='row py-lg-2 mt-lg-3'>
                    <div className='col-lg-6'>
                        <div className="form-contr">
                            <label htmlFor="number">Full Name*</label>
                            <input type="text" id='number' name='name' value={formdata?.name} onChange={(e) => handleChange(e)} placeholder='Enter your Full Name' />
                        </div>
                    </div>
                    <div className='col-lg-6'>
                    <div className="form-contr">
                        <label htmlFor="email">Email*</label>
                        <input type="email" id='email' disabled={true} name='email' value={formdata?.email} onChange={(e) => handleChange(e)} placeholder='Enter your email' />
                    </div>
                </div>
                </div>
                <div className='row py-lg-2 mt-lg-3'>
                    <div className='col-lg-6'>
                        <div className="form-contr">
                            <label htmlFor="number">Date OF Birth*</label>
                            <input type="date" id='number' name='dob' value={formdata?.dob} onChange={(e) => handleChange(e)} placeholder='Enter your Date OF Birth' />
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div className="form-contr">
                            <label htmlFor="email">Alternate Mobile Number</label>
                            <input type="text" id='email' name='alternate_number' value={formdata?.alternate_number} onChange={(e) => handleChange(e)} placeholder='Enter your Alternate Mobile Number' maxLength={10}/>
                        </div>
                    </div>
                </div>

                <div className='pt-3'>
                    <button className='c-btn bg-voilet text-light' onClick={() => handleUpdate()}>Save Changes</button>
                </div>
            </div>
            {
                showpopup?.isOpen &&
                <UpdateProfile  details={{number:formdata?.phone}} setShowpopup={setShowpopup} />
            }
        </React.Fragment>
    )
}

export default UserProfile