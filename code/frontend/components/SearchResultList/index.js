import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { searchBooks } from '../../services/api';
import './SearchResultList.css';

const SearchResultList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchTerm, pageNumber } = useParams();
  const navigate = useNavigate();

  const showBookDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
        const res = await searchBooks(searchTerm, pageNumber || 1);
        console.log(res);
        setBooks(res.results);
        setTotalPages(Math.ceil(res.total_books/25));
    };

    setCurrentPage(pageNumber || 1);
    fetchData();
  }, [pageNumber, searchTerm]);

  const handlePageClick = (data) => {
    let selected = data.selected;
    setCurrentPage(selected + 1);
    navigate(`/search/${searchTerm}/page/${selected + 1}`);
  };

  return (
    <div>
      <h2 className='category-heading'>{searchTerm} Books</h2>
      <ul className='books-list-2'>
        {books.map(book => (
        <li>
          <div key={book._id} className="book-card-2" onClick={showBookDetails(book._id)}>
            <img src={book.image || '/path-to-default-thumbnail.jpg'} alt={book.Title} />
            <p>{book.Title}</p>
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

export default SearchResultList;
