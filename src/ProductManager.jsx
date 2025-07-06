// import React, { useState, useEffect } from 'react';

// const API = 'http://localhost:5000/products';

// const ProductManager = () => {
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({ name: '', price: '', image: '' });
//   const [editingId, setEditingId] = useState(null); // 🆕 Track editing mode

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     const res = await fetch(API);
//     const data = await res.json();
//     setProducts(data);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editingId === null) {
//       // Add
//       await fetch(API, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, price: parseInt(formData.price) }),
//       });
//     } else {
//       // Update
//       await fetch(`${API}/${editingId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, price: parseInt(formData.price), id: editingId }),
//       });
//       setEditingId(null);
//     }
//     setFormData({ name: '', price: '', image: '' });
//     fetchProducts();
//   };

//   const deleteProduct = async (id) => {
//     await fetch(`${API}/${id}`, { method: 'DELETE' });
//     fetchProducts();
//   };

//   const editProduct = (product) => {
//     setFormData({ name: product.name, price: product.price, image: product.image });
//     setEditingId(product.id);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>

//       <form onSubmit={handleSubmit}>
//         <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
//         <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required />
//         <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required />
//         <button type="submit">{editingId ? 'Update' : 'Add'}</button>
//       </form>

//       <hr />

//       <h3>All Products</h3>
//       {products.map((p) => (
//         <div key={p.id} style={{ marginBottom: '10px' }}>
//           <img src={p.image} alt={p.name} width="80" />
//           <div>{p.name} - ₹{p.price}</div>
//           <button onClick={() => editProduct(p)}>Edit</button>
//           <button onClick={() => deleteProduct(p.id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductManager;
