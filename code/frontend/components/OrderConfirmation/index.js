import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const res = await fetchOrderById(orderId);
      setOrder(res);
      console.log(res);
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/orders');
  };

  return (
    <div className='cart'>
      <h1 className='cart-heading'>Order Details</h1>
      {order && order.items.map((item) => (
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
            <p>Quantity: {item.qty}</p>
          </div>
        </div>
      ))}
      <p className='cartTotal'>{ order && `Total: ${order.total_amount}/-`}</p>
      <button onClick={handleHomeClick}>Home</button>
      <button onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default OrderConfirmation;
