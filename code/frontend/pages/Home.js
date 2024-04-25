import React, { useEffect, useState } from 'react';
import SlideShow from '../components/SlideShow';
import CategoriesSection from '../components/CategorySection';
import BookList from '../components/BookList';
import { fetchBooks, getCategories } from '../services/api';

const Home = () => {
    const [topSellers, setTopSellers] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const topSellers = await fetchBooks('Top Rated');
          const bestSellers = await fetchBooks('Best Seller');
          setTopSellers(topSellers.results);
          setBestSellers(bestSellers.results);
        };
    
        fetchData();
      }, []);

  return (
    <div>
        <SlideShow />
        <BookList title="Top Rated Books" books={topSellers} />
        <BookList title="Best Seller Books" books={bestSellers} />
        <CategoriesSection apiService={getCategories} type={'short'}/>
    </div>
  );
};

export default Home;
