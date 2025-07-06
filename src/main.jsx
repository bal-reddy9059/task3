

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import './index.css';
// import ShopContextProvider from './Context/ShopContext';


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//    <BrowserRouter>
//       <ShopContextProvider>
//         <App />
//        {/* // <ProductManager /> */}
//       </ShopContextProvider>
//   </BrowserRouter>
//  </React.StrictMode>
// );


// src/main.jsx


// src/main.jsx


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ShopContextProvider from './Context/ShopContext'; // ✅ Import your context provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);
