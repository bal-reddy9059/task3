// import React from 'react';
// import './App.css';
// import { Routes, Route } from 'react-router-dom';

// import Navbar from './Components/Navbar/Navbar';
// import Footer from './Components/Footer/Footer';

// import Shop from './Pages/Shop';
// import ShopCategory from './Pages/ShopCategory';
// import Product from './Pages/Product';
// import Cart from './Pages/Cart';
// import Orders from './Pages/Orders';
// import PlaceOrder from './Pages/PlaceOrder';
// import LoginSignUp from './Pages/LoginSignUp'; // ✅ Make sure filename matches

// import men_banner from './Components/Assets/banner_mens.png';
// import women_banner from './Components/Assets/banner_women.png';
// import kid_banner from './Components/Assets/banner_kids.png';




// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar/Navbar';
// import LoginSignUp from './Pages/LoginSignUp';
// import Shop from './Pages/Shop';
// import Mens from './Pages/Mens';
// import Womens from './Pages/Womens';
// import Kids from './Pages/Kids';
// import Cart from './Pages/Cart';

// // Protected Route Wrapper
// const ProtectedRoute = ({ children }) => {
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//   return currentUser ? children : <Navigate to="/login" />;
// };

// // Prevent Logged-in Users from Accessing Login/Signup
// const PublicOnlyRoute = ({ children }) => {
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//   return currentUser ? <Navigate to="/" /> : children;
// };


// function App() {
//   return (
//     <div>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Shop />} />
//         <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
//         <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
//         <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
//         <Route path="/product/:productId" element={<Product />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/place-order" element={<PlaceOrder />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/login" element={<LoginSignUp />} />
//         <Route path="/signup" element={<LoginSignUp />} />
//         <Route path="/login" element={<LoginSignUp />} />
//         <Route path="/signup" element={<LoginSignUp />} />



//         <Route path="/" element={<Shop />} />
//         <Route path="/mens" element={<Mens />} />
//         <Route path="/womens" element={<Womens />} />
//         <Route path="/kids" element={<Kids />} />
//         <Route
//           path="/cart"
//           element={
//             <ProtectedRoute>
//               <Cart />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <PublicOnlyRoute>
//               <LoginSignUp />
//             </PublicOnlyRoute>
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             <PublicOnlyRoute>
//               <LoginSignUp />
//             </PublicOnlyRoute>
//           }
//         />

//       </Routes>
//       <Footer />
//     </div>
//   );
// }

// export default App;





// src/App.jsx
import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Orders from './Pages/Orders';
import PlaceOrder from './Pages/PlaceOrder';
import LoginSignUp from './Pages/LoginSignUp';

import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';

// ✅ Protected Route
const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? children : <Navigate to="/login" />;
};

// ✅ Public-Only Route (Login/Signup not accessible when logged in)
const PublicOnlyRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Shop />} />
        <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
        <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
        <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
        <Route path="/product/:productId" element={<Product />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Login & Signup (Only accessible if NOT logged in) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginSignUp />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <LoginSignUp />
            </PublicOnlyRoute>
          }
        />

        {/* Redirect all unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
