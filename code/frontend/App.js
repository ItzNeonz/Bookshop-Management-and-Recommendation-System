import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import SecondaryNavbar from './components/SecondaryNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import AllCategories from './pages/AllCategories';
import BookDetails from './components/BookDetails';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrdersList from './components/OrderList';

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <SecondaryNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-categories" element={<AllCategories />} />
          <Route path="/categories/:categoryName/page/:pageNumber" element={<CategoryPage />} />
          <Route path="/search/:searchTerm/page/:pageNumber" element={<SearchPage />} />
          <Route path="/book/:bookId" element={<BookDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders" element={<OrdersList />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
