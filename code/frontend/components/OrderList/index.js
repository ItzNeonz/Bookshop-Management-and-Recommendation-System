import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const goToOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div>
      <h1 className='cart-heading'>Order History</h1>
      {orders.length ? (
          orders.map(order => (
            <div className='itemCard' key={order._id} onClick={() => goToOrderDetails(order._id)}>
                <p>Order ID: {order._id}</p>
                <p>Date: {order.order_date}</p>
                <p>Total Amount: ${order.total_amount}/-</p>
            </div>
          ))
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default OrdersList;
