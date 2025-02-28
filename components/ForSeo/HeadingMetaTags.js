import React from 'react'
import { Helmet } from 'react-helmet-async'

function HeadingMetaTags({seoDetails}) {
  return (
    <Helmet>
      { /* Standard metadata tags */}
      <title>{seoDetails?.pagetitle}</title>
      <meta name='description' content={seoDetails?.meta_description} />
      { /* End standard metadata tags */}
      { /* Facebook tags */}
      <meta property="og:type" content={"type"} />
      <meta property="og:title" content={seoDetails?.meta_title} />
      <meta property="og:description" content={seoDetails?.meta_description} />
      { /* End Facebook tags */}
      { /* Twitter tags */}
      <meta name="twitter:creator" content={"name"} />
      <meta name="twitter:card" content={"type"} />
      <meta name="twitter:title" content={seoDetails?.pagetitle} />
      <meta name="twitter:description" content={seoDetails?.description} />
      <meta name="twitter:image" content={seoDetails?.meta_image} />
      { /* End Twitter tags */}
    </Helmet>
  )
}

export default HeadingMetaTags