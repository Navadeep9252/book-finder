// src/App.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import LoadingSpinner from './components/LoadingSpinner';
import TrendingSearches from './components/TrendingSearches';
import { searchBooks } from './services/api';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Search books function
  const handleSearch = async (query, newSearch = true) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const currentPage = newSearch ? 1 : page;
      const data = await searchBooks(query, currentPage);
      
      if (newSearch) {
        setBooks(data.docs || []);
        setPage(1);
      } else {
        setBooks(prev => [...prev, ...(data.docs || [])]);
      }
      
      setHasMore(data.docs && data.docs.length === 100); // Open Library returns 100 results per page
      setSearchQuery(query);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load more books for infinite scroll
  const loadMore = () => {
    if (!loading && hasMore) {
      handleSearch(searchQuery, false);
      setPage(prev => prev + 1);
    }
  };

  // Handle book selection for modal
  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  // Detect when user scrolls to bottom for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          !== document.documentElement.offsetHeight || loading) {
        return;
      }
      loadMore();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BookFinder
          </h1>
          <p className="text-lg text-gray-600">Discover your next favorite read</p>
        </header>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Trending Searches - Show on initial load */}
        {books.length === 0 && !loading && !error && (
          <TrendingSearches onSearch={handleSearch} />
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {books.length === 0 && searchQuery && !loading && !error && (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-yellow-700">No books found for "{searchQuery}"</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Books Grid */}
        {books.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map((book, index) => (
                <BookCard 
                  key={`${book.key}-${index}`} 
                  book={book} 
                  onClick={() => handleBookSelect(book)}
                  index={index}
                />
              ))}
            </div>
            
            {/* Load More Button for better UX */}
            {hasMore && (
              <div className="text-center mb-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Books'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Book Detail Modal */}
        {showModal && selectedBook && (
          <BookModal book={selectedBook} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default App;