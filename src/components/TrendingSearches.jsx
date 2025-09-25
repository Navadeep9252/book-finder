// src/components/TrendingSearches.jsx
import React from 'react';

const TrendingSearches = ({ onSearch }) => {
  const trendingSearches = [
    'Harry Potter',
    'Sherlock Holmes',
    'The Lord of the Rings',
    'Pride and Prejudice',
    'The Great Gatsby',
    'To Kill a Mockingbird',
    '1984',
    'The Hobbit',
    'The Catcher in the Rye',
    'The Alchemist'
  ];

  return (
    <div className="text-center py-12 animate-fade-in">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">Trending Searches</h3>
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        {trendingSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearch(search, true)}
            className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;