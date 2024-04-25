import React, { useState } from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faList } from '@fortawesome/free-solid-svg-icons';
import { searchBooks, logout } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../LoginModal';
import RegistrationModal from '../RegistrationModal';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('x-auth-token'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const navigate = useNavigate();

  const goToCart = () => {
    navigate('/cart');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openRegistrationModal = () => {
    setShowLoginModal(false);
    setShowRegistrationModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const goToOrders = () => {
    navigate('/orders');
  };

  const handleSearchSubmit = async () => {
    let res = await searchBooks(searchTerm);
    if(res.results.length == 0){
      alert('Books does not exist for term: ' + searchTerm);
    }
    else{
      navigate(`/search/${searchTerm}/page/1`);
    }
  };

  return (
    <nav className='navbar'>
      <div className='logo'>BookStore</div>
      <div className='searchBar'>
        <input
          type="text"
          placeholder="Search books by title"
          className="searchBox"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchSubmit} className='searchButton'>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {isAuthenticated && (
        <button onClick={goToOrders} className='cartButton'>
          <FontAwesomeIcon icon={faList} />
        </button>
      )}
      <button onClick={goToCart} className='cartButton'>
        <FontAwesomeIcon icon={faShoppingCart} />
      </button>
      {isAuthenticated ? (
        <button onClick={handleLogout} className="loginButton">Logout</button>
      ) : (
        <button onClick={() => setShowLoginModal(true)} className="loginButton">Login</button>
      )}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => setIsAuthenticated(true)}
          openRegistrationModal={openRegistrationModal}
        />
      )}
      {showRegistrationModal && (
        <RegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onRegistrationSuccess={() => {
            setShowRegistrationModal(false);
            setIsAuthenticated(true);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
