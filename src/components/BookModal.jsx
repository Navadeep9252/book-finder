// src/components/BookModal.jsx
import React, { useState, useEffect } from 'react';
import { getBookDetails } from '../services/api';

const BookModal = ({ book, onClose }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const details = await getBookDetails(book.key);
        setBookDetails(details);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [book.key]);

  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null;

  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-scale-in">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Book Cover */}
              {coverUrl && (
                <div className="flex-shrink-0">
                  <img 
                    src={coverUrl} 
                    alt={book.title}
                    className="w-48 h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Book Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h3>
                <p className="text-lg text-gray-600 mb-4">by {authors}</p>
                
                <div className="space-y-2">
                  <p><strong>Published:</strong> {book.first_publish_year || 'Unknown'}</p>
                  {book.publisher && (
                    <p><strong>Publisher:</strong> {book.publisher.join(', ')}</p>
                  )}
                  {book.isbn && (
                    <p><strong>ISBN:</strong> {book.isbn[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : bookDetails?.description ? (
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">
                  {typeof bookDetails.description === 'string' 
                    ? bookDetails.description 
                    : bookDetails.description.value}
                </p>
              </div>
            ) : null}

            {/* Subjects */}
            {book.subject && (
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {book.subject.slice(0, 10).map((subject, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;