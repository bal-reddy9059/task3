



import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    clearCart,
    updateCartItem,
  } = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 10, total: 0 });

  const navigate = useNavigate();

  // Update totals when cart changes
  useEffect(() => {
    const subtotal = getTotalCartAmount();
    const shipping = subtotal > 0 ? 10 : 0;
    const discount = promoApplied ? 0.1 * subtotal : 0;
    const total = subtotal - discount + shipping;

    setTotals({ subtotal, shipping, total });
  }, [cartItems, promoApplied]);

  const cartProducts = all_product
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: product.new_price,
      quantity: cartItems[product.id],
      size: product.size || 'M',
      image: product.image,
      total: product.new_price * cartItems[product.id],
    }));

  const handlePromoSubmit = () => {
    if (promoCode.trim().toLowerCase() === 'save10') {
      toast.success('Promo code applied! 10% discount added.');
      setPromoApplied(true);
    } else {
      toast.error('Invalid promo code');
      setPromoApplied(false);
    }
  };

  const handleCheckout = () => {
    const cartData = {
      products: cartProducts,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      promoCode: promoApplied ? promoCode : null,
    };

    navigate('/place-order', { state: cartData });
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Product</p><p>Title</p><p>Price</p><p>Quantity</p><p>Total</p><p>Size</p><p>Remove</p>
      </div>
      <hr />

      {cartProducts.map((item) => (
        <div key={item.id} className="cartitems-format">
          <img src={item.image} alt="" className='carticon-product-icon' />
          <p>{item.title}</p>
          <p>${item.price}</p>
          <div className='quantity-controls'>
            <button onClick={() => updateCartItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
            <input value={item.quantity} readOnly />
            <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
          </div>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
          <div className="cartitems-size">{item.size}</div>
          <img src={remove_icon} alt="Remove" className="cartitems-remove-icon" onClick={() => removeFromCart(item.id)} />
        </div>
      ))}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p><p>${totals.subtotal.toFixed(2)}</p>
            </div>
            {promoApplied && (
              <div className="cartitems-total-item">
                <p>Promo Discount</p><p>− ${(0.1 * totals.subtotal).toFixed(2)}</p>
              </div>
            )}
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping</p><p>${totals.shipping.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3><h3>${totals.total.toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={loading || totals.subtotal === 0}>
            {loading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
          </button>
        </div>

        <div className={`cartitems-promocode ${promoApplied ? 'promo-success' : ''}`}>
          <p>If you have a promo code, enter it here:</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              style={{ padding: '8px 10px' }} // <-- Reduced height here
            />
            <button onClick={handlePromoSubmit}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
