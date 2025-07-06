import React from 'react'
import './DescriptionBox.css'
const DescriptionBox=() =>{
  return (
    <div className='descriptionbox'>
    <div className="descriptionbox-navigator">
    <div className="descriptionbox-nav-box">Description</div>
 <div className="descriptionbox-nav-box fade">Review</div>
    </div>
      <div className="descriptionbox-description">
       <p>Welcome to our e-commerce platform — where quality meets convenience. 
        We are committed to bringing you a seamless shopping experience with handpicked products, 
        competitive pricing, and fast, reliable delivery.</p>
      <p>Discover the perfect blend of style, comfort, and quality with our latest collection. 
        Crafted with precision and made from premium materials, this product is designed to elevate your everyday experience.
         Whether you're heading out for a casual dressing up for an occasion, this piece delivers the versatility you need and the confidence you deserve.</p>
       <p>From the latest fashion trends to everyday essentials, our catalog is designed to meet your lifestyle needs.
         Each item is carefully curated to ensure premium quality, durability, and style. 
        Whether you're shopping for yourself or someone special, we make it easy, secure, and enjoyable</p>
      </div>

    </div>
  )
}

export default DescriptionBox 