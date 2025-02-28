import Layout from '@components/Layouts/Layout'
import { BASE_URL } from '@constants/Common'
import Link from 'next/link'
import React from 'react'

function NotFound() {
  return (
    <Layout>
    <div className='not-found' style={{Width:"100%" , overflow:"hidden"}}>
      <img src={BASE_URL+"/assets/images/page-not-found.webp"} alt="" style={{maxHeight:"400px"}} />
      <p className='my-3 text-center'>Unfortunately the page you are looking for has been moved or deleted</p>
      <Link href="/">GO TO HOMEPAGE</Link>
    </div>
    </Layout>
  )
}

export default NotFound
