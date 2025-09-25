// src/components/BookCard.jsx
import React from 'react';

const BookCard = ({ book, onClick, index }) => {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/book-placeholder.png';

  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
  const publishedYear = book.first_publish_year || 'Unknown';

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="flex h-48">
        <img 
          src={coverUrl} 
          alt={book.title}
          className="w-32 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDEyOCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00NCA2NEg4NFY4NEg0NFY2NFpNNDQgOTZINzJWMTEySDQ0Vjk2WiIgZmlsbD0iIzlDQTBCRiIvPgo8L3N2Zz4K';
          }}
        />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{authors}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Published: {publishedYear}</span>
            {book.edition_count && (
              <span>{book.edition_count} edition{book.edition_count > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;