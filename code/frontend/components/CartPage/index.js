import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(loadedCart);
  }, []);

  const updateQuantity = (bookId, quantity) => {
    const updatedCart = cart.map((item) =>
      item._id === bookId ? { ...item, quantity: quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cart.filter((item) => item._id !== bookId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.Price * item.quantity, 0);
  };

  const handleCheckout = () => {
    localStorage.setItem('cartTotal', calculateTotal());
    navigate('/checkout');
  };

  if (!cart.length) return <div className='emptyCart'>Your cart is empty.</div>;

  return (
    <div className='cart'>
      <h1 className='cart-heading'>Your Cart</h1>
      {cart.map((item) => (
        <div key={item._id} className='itemCard'>
          <div className='imgDiv'>
            <img 
              src={item.image || '/path-to-default-thumbnail.jpg'} 
              alt={item.Title}
            />
          </div>
          <div className='contentDiv'>
            <h4>{item.Title}</h4>
            <p>Price: ${item.Price}/-</p>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
            />
            <button onClick={() => removeFromCart(item._id)}>
              <FontAwesomeIcon icon={faRemove} />
            </button>
          </div>
        </div>
      ))}
      <p className='cartTotal'>Total: ${calculateTotal().toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartPage;
