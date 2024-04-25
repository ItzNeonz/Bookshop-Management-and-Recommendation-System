import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookById, fetchRecommendations } from '../../services/api';
import { addToCart } from '../../utils/cartUtils';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import './BookDetails.css';
import StarRating from '../StarRating';

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const { bookId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: false
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      const res = await fetchBookById(bookId);
      setBook(res);
    };

    const fetchRecommendedBooks = async (bookId) =>{
      const res = await fetchRecommendations(bookId);
      console.log(res);
      setRecommendations(res);
    };

    fetchBookDetails();
    fetchRecommendedBooks(bookId);
  }, [bookId]);

  const showBookDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className='book-dtl'>
      <h1>{book.Title}</h1>
      <h3>By: {book.authors.join(', ')} <span className='categories'>{book.categories.join(', ')}</span></h3>
      <div className='book-dtl-col1'>
        <img src={book.image} alt={book.Title} />
      </div>
      <div className='book-dtl-col2'>
        <p className='rating'><StarRating rating={book['review/score']} /></p>
        <p className='price'>Price: $ {book.Price} /-</p>
        <button className='addToCartBtn' onClick={() => addToCart(book)}>Add to Cart</button>
      </div>
      <div className='description'>
        <h3>Description</h3>
        <p>{book.description}</p>
      </div>

      <div className="book-list recommendations">
      <h2>Recommended Books</h2>
      <Slider {...settings}>
        {recommendations.map(book => (
          <div key={book._id} className="book-card">
            <img 
              src={book.image || '/path-to-default-thumbnail.jpg'} 
              alt={book.Title}
              onClick={() => showBookDetails(book._id)}
            />
            <p>{book.Title}</p>
            <button className='addToCartBtnCard' onClick={() => addToCart(book)}>Add to Cart</button>
          </div>
        ))}
      </Slider>
      </div>
    </div>
  );
};

export default BookDetails;
