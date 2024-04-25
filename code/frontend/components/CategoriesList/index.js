import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { fetchBooks } from '../../services/api';
import './CategoriesList.css';
import { addToCart } from '../../utils/cartUtils';

const CategoriesList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { categoryName, pageNumber } = useParams();
  const navigate = useNavigate();

  const showBookDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
        const res = await fetchBooks(categoryName, pageNumber || 1);
        setBooks(res.results);
        let ceil = Math.ceil(res.total_books/25);
        setTotalPages(Math.ceil(res.total_books/25));
        
    };

    setCurrentPage(pageNumber || 1);
    fetchData();
  }, [pageNumber, categoryName]);

  const handlePageClick = (data) => {
    let selected = data.selected;
    setCurrentPage(selected + 1);
    navigate(`/categories/${categoryName}/page/${selected + 1}`);
  };

  return (
    <div>
      <h2 className='category-heading'>{categoryName} Books</h2>
      <ul className='books-list-2'>
        {books.map(book => (
        <li>
          <div key={book._id} className="book-card-2">
            <img src={book.image || '/path-to-default-thumbnail.jpg'} alt={book.Title}  onClick={() => showBookDetails(book._id)}/>
            <p>{book.Title}</p>
            <button className='addToCartBtnCard' onClick={() => addToCart(book)}>Add to Cart</button>
          </div>
        </li>
        ))}
      </ul>

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        initialPage={currentPage - 1}
      />
    </div>
  );
};

export default CategoriesList;
