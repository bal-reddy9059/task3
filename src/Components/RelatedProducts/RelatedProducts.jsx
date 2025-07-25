// import React from 'react'
// import 'RelatedProducts.css'
// import Item  from '../Item/Item'
// import data_product from '../Assets/data'
// const RelatedProducts=()=> {
//   return (
//     <div className='relatedproducts'>
//     <h1>Related Products</h1>
//     <hr/>

//     <div className="relatedproducts-item">
//      {data_product.map((item,i)=>{
//         return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />


//      }
//     )}



//     </div>
    
//     </div>
//   )
// }

// export default RelatedProducts
import React from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import  data_product  from '../Assets/data'; // ✅ update if default export

const RelatedProducts = () => {
  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />

      <div className="relatedproducts-items">
        {data_product.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

