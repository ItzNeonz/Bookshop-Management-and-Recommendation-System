import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategorySection.css';

const CategoriesSection = ({ apiService, type }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService();
        if(type=='extended'){
          setCategories(data.categories);
        }
        else
        {
          setCategories(data.categories.slice(0, 9));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [apiService]);

  return (
    <div className='categoriesSection'>
      <h2>Books by Categories</h2>
      <div className='categoriesList'>
        {categories.map(category => (
          <Link to={'/categories/' + category + '/page/1'} className='categoryCard' key={category}>
            <div key={category}>
              {category.toUpperCase()}
            </div>
          </Link>
        ))}
      </div>
      { type == "short" && 
        <Link to="/all-categories">
          <button className='viewAllButton'>VIEW ALL CATEGORIES</button>
        </Link>
         }
      
    </div>
  );
};

export default CategoriesSection;
