
import React, { useEffect, useState } from 'react';
import './CSS/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const orderList = JSON.parse(localStorage.getItem("myOrders")) || [];
    setOrders(orderList.reverse());

    // ✅ Automatically delete orders after page load
    localStorage.removeItem("myOrders");
  }, []);

  const formatDate = (dateStr) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="orders">
      <h2 className="orders-title">MY ORDERS</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-block">
            {order.products.map((product, idx) => (
              <div key={idx} className="order-item">
                <img src={product.image} alt="product" />
                <div className="order-details">
                  <p className="order-name">{product.title}</p>
                  <p className="order-meta">
                    ${product.price} &nbsp; Quantity: {product.quantity} &nbsp; Size: {product.size}
                  </p>
                  <p className="order-date">Date: {formatDate(order.date)}</p>
                </div>
                <div className="order-status">
                  <span className="dot red"></span> Ready to ship
                </div>
                <button className="track-order">Track Order</button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
