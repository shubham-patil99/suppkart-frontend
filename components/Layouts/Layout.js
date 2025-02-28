import React, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import WriteReviews from '../Modal/WriteReviews'
import { useSelector } from 'react-redux'
import TrackOrder from '../Modal/TrackOrder'

function Layout({ children }) {
  const popUpData  = useSelector((state) => state.popUpData)
  return (
    <React.Fragment>
      {popUpData?.isOpen && popUpData?.popUpName == "trackorder" && <TrackOrder />}
      { popUpData?.isOpen && popUpData?.popUpName == "Add_Review" &&<WriteReviews />}
      <Header />
      {children}
      <Footer />
    </React.Fragment>
  )
}

export default Layout
