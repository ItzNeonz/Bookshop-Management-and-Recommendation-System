import React from 'react';
import CategoriesSection from '../components/CategorySection';
import { getCategories } from '../services/api';

const AllCategories = () => {
  return (
    <div>
      <CategoriesSection apiService={getCategories} type={'extended'}/>
    </div>
  );
};

export default AllCategories;
