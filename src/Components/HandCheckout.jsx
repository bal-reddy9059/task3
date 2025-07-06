const handleCheckout = async () => {
  const cartProducts = all_product
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: product.new_price,
      quantity: cartItems[product.id],
      size: product.size || "M",
      total: product.new_price * cartItems[product.id],
    }));

  const cartData = {
    products: cartProducts,
    subtotal: getTotalCartAmount(),
    shipping: "Free",
    total: getTotalCartAmount(),
    promoCode: promoCode || null,
  };

  try {
    const response = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cartData)
    });

    const data = await response.json();
    console.log("Checkout data submitted:", data);
    alert("Cart saved to local fake API (json-server)!");
  } catch (error) {
    console.error("Error submitting cart:", error);
    alert("Failed to submit cart.");
  }
};
