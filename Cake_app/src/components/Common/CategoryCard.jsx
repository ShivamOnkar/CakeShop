import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const handleImageClick = () => {
    if (category.image) {
      window.open(category.image, '_blank');
    }
  };

  return (
    <div className="category-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <div 
        className="h-48 bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${category.image})` }}
        onClick={handleImageClick}
      ></div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          <Link to={category.link} className="hover:text-red-700">{category.name}</Link>
        </h3>
        <p className="text-gray-600 mb-4">{category.description}</p>
        <Link to={category.link} className="text-red-700 font-semibold hover:text-red-800 inline-flex items-center">
          Explore <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;