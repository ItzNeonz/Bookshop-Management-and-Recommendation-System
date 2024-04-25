import React from 'react';
import { Link } from 'react-router-dom';
import './SecondaryNavbar.css';

const SecondaryNavbar = () => {
  return (
    <div className="secondary-navbar">
      <Link to="/" className="secondary-nav-component">Home</Link>
      <Link to="/categories/Top Rated/page/1" className="secondary-nav-component">Top Rated</Link>
      <Link to="/categories/Best Seller/page/1" className="secondary-nav-component">Best Seller</Link>
      <Link to="/all-categories" className="secondary-nav-component">Categories</Link>
    </div>
  );
};

export default SecondaryNavbar;
