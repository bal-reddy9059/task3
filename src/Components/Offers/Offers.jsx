// import React from 'react'
// import './Offers.css'
// import exclusive_image from '../Assets/exclusive_image.png'
// const Offers =()=> {
//   return (
//     <div className="offers">
//       <div className="offers-left">
//        <h1>Exclusive</h1>
//        <h1>Offer For you</h1>
//        <button>Check Now</button>
//         </div>  
//        <div className="offers-right">
//         <img src={exclusive_image} alt="" />
        
        
//         </div> 
        
//   </div>
//   )
// }

// export default Offers
import React from 'react';
import './Offers.css';
import exclusive_image from '../Assets/exclusive_image.png'; // make sure this image exists

const Offers = () => {
  return (
    <div className="offers">
      <div className="offers-left">
        <h1>🎁 Exclusive</h1>
        <h1>Offer Just for You</h1>
        <p>Unlock special discounts and deals only available for a limited time!</p>
        <button className="offers-button">Check Now</button>
      </div>

      <div className="offers-right">
        <img src={exclusive_image} alt="Exclusive Offer" />
      </div>
    </div>
  );
};

export default Offers;
