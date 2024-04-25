import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/api';
import './Checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [streetAddress, setstreetAddress] = useState('');
  const [localityAddress, setlocalityAddress] = useState('');
  const [City, setCity] = useState('');
  const [Zipcode, setZipcode] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const cartTotal = localStorage.getItem('cartTotal');
  
  const handlePlaceOrder = async () => {
    try {
      var order_obj = {};
      const address = {
        'Street Address': streetAddress,
        'Locality': localityAddress,
        'City': City,
        'Country': 'United Kingdom',
        'Zipcode': Zipcode
      };
      order_obj['items'] = composeCart();
      order_obj['order_date'] = new Date().toUTCString();
      order_obj['address'] = address;
      order_obj['total_amount'] = cartTotal;
      
      if(localStorage.getItem('x-auth-token') == undefined){
        alert('Please login to place the order!');
        localStorage.setItem('order', JSON.stringify(order_obj));
      }
      else{
        const response = await placeOrder(order_obj);
        if(response == 'error'){
            alert('Error: Failed to place order!');
        }
        else{
          localStorage.removeItem('cart');
          localStorage.removeItem('order');
          localStorage.removeItem('cartTotal');
          navigate(`/order/${response}`);;
        }
      }


    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  const composeCart = () => {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var items = [];

    cart.map((book) => {
        var obj = {'book_id': book._id, 'qty': book.quantity};
        items.push(obj);
    })

    return items;
  }

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className='checkout'>
      <h1>Checkout Page</h1>
      <form className='checkoutForm'>
        <h2>Billing and Shipping Details</h2>
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setstreetAddress(e.target.value)}
          placeholder="Street Address"
          required
        />
        <input
          type="text"
          value={localityAddress}
          onChange={(e) => setlocalityAddress(e.target.value)}
          placeholder="Locality"
          required
        />
        <input
          type="text"
          value={City}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City/Town"
          required
        />
       <input
          type="text"
          value={Zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Zipcode"
          required
        />
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setmobileNumber(e.target.value)}
          placeholder="Mobile Phone"
          required
        />
        <p className='checkoutTotal'>Total: ${cartTotal}/-</p>
        <button type="button" onClick={handlePlaceOrder}>Place Order</button>
        <button type="button" onClick={handleContinueShopping}>Continue Shopping</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
