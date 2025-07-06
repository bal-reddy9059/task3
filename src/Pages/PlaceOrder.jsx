

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { toast } from 'react-toastify';
// import './CSS/PlaceOrder.css';
// import stripe_logo from '../Components/Assets/stripe_logo.png';
// import razorpay_logo from '../Components/Assets/razorpay_logo.png';

// const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXX'); // ✅ Replace if using Stripe

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', street: '',
//     city: '', state: '', zipcode: '', country: '', phone: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [totals, setTotals] = useState({ subtotal: 0, shippingFee: 10, total: 10 });

//   // ✅ Save cart to localStorage
//   useEffect(() => {
//     const cartData = location.state?.products || [];
//     localStorage.setItem('lastCartItems', JSON.stringify(cartData));
//   }, [location]);

//   // ✅ Set totals
//   useEffect(() => {
//     if (location.state) {
//       const { subtotal, shipping, total } = location.state;
//       setTotals({ subtotal, shippingFee: shipping, total });
//     }
//   }, [location]);

//   const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
//   const phoneRegex = /^[6-9]\d{9}$/;
//   const zipRegex = /^\d{5,6}$/;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     for (const [key, value] of Object.entries(formData)) {
//       if (!value.trim()) newErrors[key] = `${key[0].toUpperCase() + key.slice(1)} is required`;
//     }
//     if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
//     if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
//     if (!zipRegex.test(formData.zipcode)) newErrors.zipcode = 'Invalid zipcode';
//     if (!paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveOrder = async () => {
//     const lastCart = JSON.parse(localStorage.getItem('lastCartItems')) || [];

//     const orderDetails = {
//       products: lastCart,
//       date: new Date().toISOString(),
//       status: 'Ready to ship',
//       customer: formData,
//       paymentMethod
//     };

//     const existingOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
//     existingOrders.push(orderDetails);
//     localStorage.setItem('myOrders', JSON.stringify(existingOrders));
//   };

//   const handleRazorpay = async () => {
//     const loadScript = () =>
//       new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });

//     const isLoaded = await loadScript();
//     if (!isLoaded) return toast.error('Razorpay SDK failed to load.');

//     const options = {
//       key: 'rzp_test_1DP5mmOlF5G5ag', // ✅ Use your Razorpay test key
//       amount: Math.round(totals.total * 100),
//       currency: 'INR',
//       name: 'Forever Store',
//       description: 'Order Payment',
//       image: 'https://i.imgur.com/1.png',
//       handler: async (response) => {
//         console.log('Razorpay Payment Success:', response);
//         localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
//         await saveOrder();
//         toast.success('Payment successful via Razorpay!');
//         navigate('/orders');
//       },
//       prefill: {
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//         contact: formData.phone
//       },
//       notes: {
//         address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.zipcode}`
//       },
//       theme: { color: '#3f87f5' }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.on('payment.failed', (err) => {
//       console.error('Payment failed:', err);
//       toast.error('Payment failed. Please try again.');
//     });
//     rzp.open();
//   };

//   const handleStripe = async () => {
//     await saveOrder();
//     const stripe = await stripePromise;
//     const result = await stripe.redirectToCheckout({
//       lineItems: [{ price: 'price_XXXXXXXXXXXX', quantity: 1 }],
//       mode: 'payment',
//       successUrl: `${window.location.origin}/orders`,
//       cancelUrl: window.location.href
//     });
//     if (result.error) toast.error(result.error.message);
//   };

//   const handlePlaceOrder = async () => {
//     if (!validateForm()) return;
//     try {
//       if (paymentMethod === 'Stripe') await handleStripe();
//       else if (paymentMethod === 'Razorpay') await handleRazorpay();
//       else {
//         await saveOrder();
//         toast.success('Order placed via Cash on Delivery!');
//         navigate('/orders');
//       }
//     } catch {
//       toast.error('Order placement failed.');
//     }
//   };

//   const getInputClass = (field) => (errors[field] ? 'input-error' : '');

//   return (
//     <div className="place-order">
//       <div className="place-order-left">
//         <h2>DELIVERY <span>INFORMATION</span></h2>
//         <div className="multi-fields">
//           <input name="firstName" placeholder="First name" onChange={handleInputChange} className={getInputClass('firstName')} />
//           <input name="lastName" placeholder="Last name" onChange={handleInputChange} className={getInputClass('lastName')} />
//         </div>
//         <input name="email" placeholder="Email" onChange={handleInputChange} className={getInputClass('email')} />
//         <input name="street" placeholder="Street" onChange={handleInputChange} className={getInputClass('street')} />
//         <div className="multi-fields">
//           <input name="city" placeholder="City" onChange={handleInputChange} className={getInputClass('city')} />
//           <input name="state" placeholder="State" onChange={handleInputChange} className={getInputClass('state')} />
//         </div>
//         <div className="multi-fields">
//           <input name="zipcode" placeholder="Zipcode" onChange={handleInputChange} className={getInputClass('zipcode')} />
//           <input name="country" placeholder="Country" onChange={handleInputChange} className={getInputClass('country')} />
//         </div>
//         <input name="phone" placeholder="Phone" onChange={handleInputChange} className={getInputClass('phone')} />
//         {errors.phone && <p className="error-text">{errors.phone}</p>}
//       </div>

//       <div className="place-order-right">
//         <h2>CART TOTALS</h2>
//         <div className="cart-totals">
//           <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
//           <div><span>Shipping Fee</span><span>${totals.shippingFee.toFixed(2)}</span></div>
//           <div className="total"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
//         </div>

//         <h2>PAYMENT METHOD</h2>
//         {errors.paymentMethod && <p className="error-text">{errors.paymentMethod}</p>}
//         <div className="payment-options">
//           <button className={`payment-btn ${paymentMethod === 'Stripe' ? 'active' : ''}`} onClick={() => setPaymentMethod('Stripe')}>
//             {paymentMethod === 'Stripe' && <span className="checkmark">✓</span>}
//             <img src={stripe_logo} alt="Stripe" />
//           </button>
//           <button className={`payment-btn ${paymentMethod === 'Razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('Razorpay')}>
//             {paymentMethod === 'Razorpay' && <span className="checkmark">✓</span>}
//             <img src={razorpay_logo} alt="Razorpay" />
//           </button>
//           <button className={`payment-btn cod-btn ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`} onClick={() => setPaymentMethod('Cash on Delivery')}>
//             {paymentMethod === 'Cash on Delivery' && <span className="checkmark">✓</span>}
//             CASH ON DELIVERY
//           </button>
//         </div>
//         <button className="place-order-btn" onClick={handlePlaceOrder}>PLACE ORDER</button>
//       </div>
//     </div>
//   );
// };

// export default PlaceOrder;



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { toast } from 'react-toastify';
// import './CSS/PlaceOrder.css';
// import stripe_logo from '../Components/Assets/stripe_logo.png';
// import razorpay_logo from '../Components/Assets/razorpay_logo.png';

// const stripePromise = loadStripe('pk_test_51PUvAkSG2o9bHMQ7zQxxxxxxxxxxxxxxxxxxxxxxx'); // ✅ Your public key

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', street: '',
//     city: '', state: '', zipcode: '', country: '', phone: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [totals, setTotals] = useState({ subtotal: 0, shippingFee: 10, total: 10 });

//   useEffect(() => {
//     const cartData = location.state?.products || [];
//     localStorage.setItem('lastCartItems', JSON.stringify(cartData));
//   }, [location]);

//   useEffect(() => {
//     if (location.state) {
//       const { subtotal, shipping, total } = location.state;
//       setTotals({ subtotal, shippingFee: shipping, total });
//     }
//   }, [location]);

//   const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
//   const phoneRegex = /^[6-9]\d{9}$/;
//   const zipRegex = /^\d{5,6}$/;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     for (const [key, value] of Object.entries(formData)) {
//       if (!value.trim()) newErrors[key] = `${key[0].toUpperCase() + key.slice(1)} is required`;
//     }
//     if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
//     if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
//     if (!zipRegex.test(formData.zipcode)) newErrors.zipcode = 'Invalid zipcode';
//     if (!paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveOrder = async () => {
//     const lastCart = JSON.parse(localStorage.getItem('lastCartItems')) || [];
//     const orderDetails = {
//       products: lastCart,
//       date: new Date().toISOString(),
//       status: 'Ready to ship',
//       customer: formData,
//       paymentMethod
//     };
//     const existingOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
//     existingOrders.push(orderDetails);
//     localStorage.setItem('myOrders', JSON.stringify(existingOrders));
//   };

//   const handleRazorpay = async () => {
//     const loadScript = () =>
//       new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });

//     const isLoaded = await loadScript();
//     if (!isLoaded) return toast.error('Razorpay SDK failed to load.');

//     const options = {
//       key: 'rzp_test_1DP5mmOlF5G5ag', // ✅ Your Razorpay test key
//       amount: Math.round(totals.total * 100),
//       currency: 'INR',
//       name: 'Forever Store',
//       description: 'Order Payment',
//       image: 'https://i.imgur.com/1.png',
//       handler: async (response) => {
//         localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
//         await saveOrder();
//         toast.success('Payment successful via Razorpay!');
//         navigate('/orders');
//       },
//       prefill: {
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//         contact: formData.phone
//       },
//       notes: {
//         address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.zipcode}`
//       },
//       theme: { color: '#3f87f5' }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.on('payment.failed', () => toast.error('Payment failed. Try again.'));
//     rzp.open();
//   };

//   const handleStripe = async () => {
//     await saveOrder();
//     const stripe = await stripePromise;
//     const result = await stripe.redirectToCheckout({
//       lineItems: [{ price: 'price_1PUvAlSG2o9bHMQXXXXXXXXXXXXXXXX', quantity: 1 }], // ✅ Replace with Stripe Price ID
//       mode: 'payment',
//       successUrl: `${window.location.origin}/orders`,
//       cancelUrl: window.location.href
//     });
//     if (result.error) toast.error(result.error.message);
//   };

//   const handlePlaceOrder = async () => {
//     if (!validateForm()) return;
//     try {
//       if (paymentMethod === 'Stripe') await handleStripe();
//       else if (paymentMethod === 'Razorpay') await handleRazorpay();
//       else {
//         await saveOrder();
//         toast.success('Order placed via Cash on Delivery!');
//         navigate('/orders');
//       }
//     } catch {
//       toast.error('Order placement failed.');
//     }
//   };

//   const getInputClass = (field) => (errors[field] ? 'input-error' : '');

//   return (
//     <div className="place-order">
//       <div className="place-order-left">
//         <h2>DELIVERY <span>INFORMATION</span></h2>
//         <div className="multi-fields">
//           <input name="firstName" placeholder="First name" onChange={handleInputChange} className={getInputClass('firstName')} />
//           <input name="lastName" placeholder="Last name" onChange={handleInputChange} className={getInputClass('lastName')} />
//         </div>
//         <input name="email" placeholder="Email" onChange={handleInputChange} className={getInputClass('email')} />
//         <input name="street" placeholder="Street" onChange={handleInputChange} className={getInputClass('street')} />
//         <div className="multi-fields">
//           <input name="city" placeholder="City" onChange={handleInputChange} className={getInputClass('city')} />
//           <input name="state" placeholder="State" onChange={handleInputChange} className={getInputClass('state')} />
//         </div>
//         <div className="multi-fields">
//           <input name="zipcode" placeholder="Zipcode" onChange={handleInputChange} className={getInputClass('zipcode')} />
//           <input name="country" placeholder="Country" onChange={handleInputChange} className={getInputClass('country')} />
//         </div>
//         <input name="phone" placeholder="Phone" onChange={handleInputChange} className={getInputClass('phone')} />
//         {errors.phone && <p className="error-text">{errors.phone}</p>}
//       </div>

//       <div className="place-order-right">
//         <h2>CART TOTALS</h2>
//         <div className="cart-totals">
//           <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
//           <div><span>Shipping Fee</span><span>${totals.shippingFee.toFixed(2)}</span></div>
//           <div className="total"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
//         </div>

//         <h2>PAYMENT METHOD</h2>
//         {errors.paymentMethod && <p className="error-text">{errors.paymentMethod}</p>}
//         <div className="payment-options">
//           <button className={`payment-btn ${paymentMethod === 'Stripe' ? 'active' : ''}`} onClick={() => setPaymentMethod('Stripe')}>
//             {paymentMethod === 'Stripe' && <span className="checkmark">✓</span>}
//             <img src={stripe_logo} alt="Stripe" />
//           </button>
//           <button className={`payment-btn ${paymentMethod === 'Razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('Razorpay')}>
//             {paymentMethod === 'Razorpay' && <span className="checkmark">✓</span>}
//             <img src={razorpay_logo} alt="Razorpay" />
//           </button>
//           <button className={`payment-btn cod-btn ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`} onClick={() => setPaymentMethod('Cash on Delivery')}>
//             {paymentMethod === 'Cash on Delivery' && <span className="checkmark">✓</span>}
//             CASH ON DELIVERY
//           </button>
//         </div>

//         <button className="place-order-btn" onClick={handlePlaceOrder}>PLACE ORDER</button>
//       </div>
//     </div>
//   );
// };

// export default PlaceOrder;




// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { toast } from 'react-toastify';
// import './CSS/PlaceOrder.css';
// import stripe_logo from '../Components/Assets/stripe_logo.png';
// import razorpay_logo from '../Components/Assets/razorpay_logo.png';

// // ✅ Replace with your real Stripe public key
// const stripePromise = loadStripe('pk_test_51PUvAkSG2o9bHMQ7zQxxxxxxxxxxxxxxxxxxxxxxxx');

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', street: '',
//     city: '', state: '', zipcode: '', country: '', phone: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [totals, setTotals] = useState({ subtotal: 0, shippingFee: 10, total: 10 });

//   useEffect(() => {
//     const cartData = location.state?.products || [];
//     localStorage.setItem('lastCartItems', JSON.stringify(cartData));
//   }, [location]);

//   useEffect(() => {
//     if (location.state) {
//       const { subtotal, shipping, total } = location.state;
//       setTotals({ subtotal, shippingFee: shipping, total });
//     }
//   }, [location]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
//     const phoneRegex = /^[6-9]\d{9}$/;
//     const zipRegex = /^\d{5,6}$/;

//     for (const [key, value] of Object.entries(formData)) {
//       if (!value.trim()) newErrors[key] = `${key[0].toUpperCase() + key.slice(1)} is required`;
//     }
//     if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
//     if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone';
//     if (!zipRegex.test(formData.zipcode)) newErrors.zipcode = 'Invalid zipcode';
//     if (!paymentMethod) newErrors.paymentMethod = 'Select a payment method';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveOrder = async () => {
//     const cart = JSON.parse(localStorage.getItem('lastCartItems')) || [];
//     const newOrder = {
//       products: cart,
//       date: new Date().toISOString(),
//       status: 'Ready to ship',
//       customer: formData,
//       paymentMethod
//     };
//     const orders = JSON.parse(localStorage.getItem('myOrders')) || [];
//     orders.push(newOrder);
//     localStorage.setItem('myOrders', JSON.stringify(orders));
//   };

//   const handleRazorpay = async () => {
//     const loadScript = () =>
//       new Promise((res) => {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => res(true);
//         script.onerror = () => res(false);
//         document.body.appendChild(script);
//       });

//     const isLoaded = await loadScript();
//     if (!isLoaded) return toast.error('Razorpay SDK failed to load');

//     const options = {
//       key: 'rzp_test_1DP5mmOlF5G5ag', // ✅ Replace with your Razorpay test key
//       amount: Math.round(totals.total * 100),
//       currency: 'INR',
//       name: 'Forever Store',
//       description: 'Order Payment',
//       image: 'https://i.imgur.com/1.png',
//       handler: async (response) => {
//         localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
//         await saveOrder();
//         toast.success('Payment successful via Razorpay!');
//         navigate('/orders');
//       },
//       prefill: {
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//         contact: formData.phone
//       },
//       notes: {
//         address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.zipcode}`
//       },
//       theme: { color: '#3399cc' }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.on('payment.failed', () => toast.error('Payment failed. Try again.'));
//     rzp.open();
//   };

//   const handleStripe = async () => {
//     await saveOrder();
//     const stripe = await stripePromise;
//     const result = await stripe.redirectToCheckout({
//       lineItems: [{ price: 'price_1PUvAlSG2o9bHMQXXXXXXXXXXXXXXXX', quantity: 1 }], // ✅ Replace with real Stripe Price ID
//       mode: 'payment',
//       successUrl: `${window.location.origin}/orders`,
//       cancelUrl: window.location.href
//     });
//     if (result.error) toast.error(result.error.message);
//   };

//   const handlePlaceOrder = async () => {
//     if (!validateForm()) return;

//     try {
//       if (paymentMethod === 'Stripe') await handleStripe();
//       else if (paymentMethod === 'Razorpay') await handleRazorpay();
//       else {
//         await saveOrder();
//         toast.success('Order placed via Cash on Delivery!');
//         navigate('/orders');
//       }
//     } catch {
//       toast.error('Order placement failed.');
//     }
//   };

//   const getInputClass = (field) => (errors[field] ? 'input-error' : '');

//   return (
//     <div className="place-order">
//       <div className="place-order-left">
//         <h2>DELIVERY <span>INFORMATION</span></h2>
//         <div className="multi-fields">
//           <input name="firstName" placeholder="First name" onChange={handleInputChange} className={getInputClass('firstName')} />
//           <input name="lastName" placeholder="Last name" onChange={handleInputChange} className={getInputClass('lastName')} />
//         </div>
//         <input name="email" placeholder="Email" onChange={handleInputChange} className={getInputClass('email')} />
//         <input name="street" placeholder="Street" onChange={handleInputChange} className={getInputClass('street')} />
//         <div className="multi-fields">
//           <input name="city" placeholder="City" onChange={handleInputChange} className={getInputClass('city')} />
//           <input name="state" placeholder="State" onChange={handleInputChange} className={getInputClass('state')} />
//         </div>
//         <div className="multi-fields">
//           <input name="zipcode" placeholder="Zipcode" onChange={handleInputChange} className={getInputClass('zipcode')} />
//           <input name="country" placeholder="Country" onChange={handleInputChange} className={getInputClass('country')} />
//         </div>
//         <input name="phone" placeholder="Phone" onChange={handleInputChange} className={getInputClass('phone')} />
//         {errors.phone && <p className="error-text">{errors.phone}</p>}
//       </div>

//       <div className="place-order-right">
//         <h2>CART TOTALS</h2>
//         <div className="cart-totals">
//           <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
//           <div><span>Shipping Fee</span><span>${totals.shippingFee.toFixed(2)}</span></div>
//           <div className="total"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
//         </div>

//         <h2>PAYMENT METHOD</h2>
//         {errors.paymentMethod && <p className="error-text">{errors.paymentMethod}</p>}
//         <div className="payment-options">
//           <button className={`payment-btn ${paymentMethod === 'Stripe' ? 'active' : ''}`} onClick={() => setPaymentMethod('Stripe')}>
//             {paymentMethod === 'Stripe' && <span className="checkmark">✓</span>}
//             <img src={stripe_logo} alt="Stripe" />
//           </button>
//           <button className={`payment-btn ${paymentMethod === 'Razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('Razorpay')}>
//             {paymentMethod === 'Razorpay' && <span className="checkmark">✓</span>}
//             <img src={razorpay_logo} alt="Razorpay" />
//           </button>
//           <button className={`payment-btn cod-btn ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`} onClick={() => setPaymentMethod('Cash on Delivery')}>
//             {paymentMethod === 'Cash on Delivery' && <span className="checkmark">✓</span>}
//             CASH ON DELIVERY
//           </button>
//         </div>

//         <button className="place-order-btn" onClick={handlePlaceOrder}>PLACE ORDER</button>
//       </div>
//     </div>
//   );
// };

// export default PlaceOrder;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import './CSS/PlaceOrder.css';
import stripe_logo from '../Components/Assets/stripe_logo.png';
import razorpay_logo from '../Components/Assets/razorpay_logo.png';

// ✅ Replace with your own keys
const stripePromise = loadStripe('pk_test_51PUvAkSG2o9bHMQ7zQYcXrFAYKNDXWDWXXXXXXXX');

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });
  const [errors, setErrors] = useState({});
  const [totals, setTotals] = useState({ subtotal: 0, shippingFee: 10, total: 10 });

  useEffect(() => {
    const cartData = location.state?.products || [];
    localStorage.setItem('lastCartItems', JSON.stringify(cartData));
  }, [location]);

  useEffect(() => {
    if (location.state) {
      const { subtotal, shipping, total } = location.state;
      setTotals({ subtotal, shippingFee: shipping, total });
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const zipRegex = /^\d{5,6}$/;

    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) newErrors[key] = `${key[0].toUpperCase() + key.slice(1)} is required`;
    }
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone';
    if (!zipRegex.test(formData.zipcode)) newErrors.zipcode = 'Invalid zipcode';
    if (!paymentMethod) newErrors.paymentMethod = 'Select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveOrder = async () => {
    const cart = JSON.parse(localStorage.getItem('lastCartItems')) || [];
    const newOrder = {
      products: cart,
      date: new Date().toISOString(),
      status: 'Ready to ship',
      customer: formData,
      paymentMethod
    };
    const orders = JSON.parse(localStorage.getItem('myOrders')) || [];
    orders.push(newOrder);
    localStorage.setItem('myOrders', JSON.stringify(orders));
  };

  const handleRazorpay = async () => {
    const loadScript = () =>
      new Promise((res) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => res(true);
        script.onerror = () => res(false);
        document.body.appendChild(script);
      });

    const isLoaded = await loadScript();
    if (!isLoaded) return toast.error('Razorpay SDK failed to load');

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // ✅ Replace with your Razorpay test key
      amount: Math.round(totals.total * 100),
      currency: 'INR',
      name: 'Forever Store',
      description: 'Order Payment',
      image: 'https://i.imgur.com/1.png',
      handler: async (response) => {
        localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
        await saveOrder();
        toast.success('Payment successful via Razorpay!');
        navigate('/orders');
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.zipcode}`
      },
      theme: { color: '#3399cc' }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => toast.error('Payment failed. Try again.'));
    rzp.open();
  };

  const handleStripe = async () => {
    await saveOrder();
    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_1PUvAlSG2o9bHMQXXXXXXXXXXXXXXXX', quantity: 1 }], // ✅ Replace with actual Price ID
      mode: 'payment',
      successUrl: `${window.location.origin}/orders`,
      cancelUrl: window.location.href
    });
    if (result.error) toast.error(result.error.message);
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      if (paymentMethod === 'Stripe') await handleStripe();
      else if (paymentMethod === 'Razorpay') await handleRazorpay();
      else {
        await saveOrder();
        toast.success('Order placed via Cash on Delivery!');
        navigate('/orders');
      }
    } catch {
      toast.error('Order placement failed.');
    }
  };

  const getInputClass = (field) => (errors[field] ? 'input-error' : '');

  return (
    <div className="place-order">
      <div className="place-order-left">
        <h2>DELIVERY <span>INFORMATION</span></h2>
        <div className="multi-fields">
          <input name="firstName" placeholder="First name" onChange={handleInputChange} className={getInputClass('firstName')} />
          <input name="lastName" placeholder="Last name" onChange={handleInputChange} className={getInputClass('lastName')} />
        </div>
        <input name="email" placeholder="Email" onChange={handleInputChange} className={getInputClass('email')} />
        <input name="street" placeholder="Street" onChange={handleInputChange} className={getInputClass('street')} />
        <div className="multi-fields">
          <input name="city" placeholder="City" onChange={handleInputChange} className={getInputClass('city')} />
          <input name="state" placeholder="State" onChange={handleInputChange} className={getInputClass('state')} />
        </div>
        <div className="multi-fields">
          <input name="zipcode" placeholder="Zipcode" onChange={handleInputChange} className={getInputClass('zipcode')} />
          <input name="country" placeholder="Country" onChange={handleInputChange} className={getInputClass('country')} />
        </div>
        <input name="phone" placeholder="Phone" onChange={handleInputChange} className={getInputClass('phone')} />
        {errors.phone && <p className="error-text">{errors.phone}</p>}
      </div>

      <div className="place-order-right">
        <h2>CART TOTALS</h2>
        <div className="cart-totals">
          <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
          <div><span>Shipping Fee</span><span>${totals.shippingFee.toFixed(2)}</span></div>
          <div className="total"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
        </div>

        <h2>PAYMENT METHOD</h2>
        {errors.paymentMethod && <p className="error-text">{errors.paymentMethod}</p>}
        <div className="payment-options">
          <button className={`payment-btn ${paymentMethod === 'Stripe' ? 'active' : ''}`} onClick={() => setPaymentMethod('Stripe')}>
            {paymentMethod === 'Stripe' && <span className="checkmark">✓</span>}
            <img src={stripe_logo} alt="Stripe" />
          </button>
          <button className={`payment-btn ${paymentMethod === 'Razorpay' ? 'active' : ''}`} onClick={() => setPaymentMethod('Razorpay')}>
            {paymentMethod === 'Razorpay' && <span className="checkmark">✓</span>}
            <img src={razorpay_logo} alt="Razorpay" />
          </button>
          <button className={`payment-btn cod-btn ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`} onClick={() => setPaymentMethod('Cash on Delivery')}>
            {paymentMethod === 'Cash on Delivery' && <span className="checkmark">✓</span>}
            CASH ON DELIVERY
          </button>
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>PLACE ORDER</button>
      </div>
    </div>
  );
};

export default PlaceOrder;
