import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import './BookList.css';
import { addToCart } from '../../utils/cartUtils';

const BookList = ({ title, books }) => {

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  const navigate = useNavigate();
  const showBookDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleViewMoreClick = () => {
    var category = title.substr(0, title.length - 6);
    navigate(`/categories/${category}/page/1`);
  };

  function SampleNextArrow(props) {
    const { className, onClick } = props;

    return (
      <div
        className={className}
        onClick={onClick}
      >
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="book-list">
      <h2>{title}</h2>
      <Slider {...settings}>
        {books.map(book => (
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
      <button className="view-more" onClick={() => handleViewMoreClick()}>VIEW MORE</button>
    </div>
  );
};

export default BookList;
