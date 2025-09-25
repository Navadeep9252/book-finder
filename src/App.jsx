import React, { useState, useEffect } from 'react';

// API service functions
const searchBooks = async (query, page = 1) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&page=${page}&limit=20`
    );
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch books from Open Library');
  }
};

const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`https://openlibrary.org${bookId}.json`);
    if (!response.ok) throw new Error('Failed to fetch book details');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book details');
  }
};

// SearchBar Component
const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query, true);
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books…"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

// BookCard Component
const BookCard = ({ book, onClick, index }) => {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
  const publishedYear = book.first_publish_year || 'Unknown';

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
      onClick={onClick}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex h-48">
        <div className="w-32 bg-gray-100 flex items-center justify-center">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`text-gray-500 text-center p-4 ${coverUrl ? 'hidden' : 'flex flex-col items-center justify-center'}`}>
            <span className="text-sm">No cover</span>
            <span className="text-xs mt-1">📚</span>
          </div>
        </div>
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

// BookModal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {coverUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={coverUrl} 
                  alt={book.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-lg text-gray-600 mb-4">by {authors}</p>
              
              <div className="space-y-2">
                <p><strong>Published:</strong> {book.first_publish_year || 'Unknown'}</p>
                {book.publisher && (
                  <p><strong>Publisher:</strong> {book.publisher.slice(0, 3).join(', ')}</p>
                )}
                {book.isbn && book.isbn[0] && (
                  <p><strong>ISBN:</strong> {book.isbn[0]}</p>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
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

          {book.subject && book.subject.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {book.subject.slice(0, 8).map((subject, index) => (
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
  );
};

// LoadingSpinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Searching books...</p>
      </div>
    </div>
  );
};

// TrendingSearches Component
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
    <div className="text-center py-12">
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

// Main App Component
function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

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
      
      setSearchQuery(query);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading) {
      setPage(prev => prev + 1);
      handleSearch(searchQuery, false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

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
        {loading && books.length === 0 && <LoadingSpinner />}

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
            
            {/* Load More Button */}
            {!loading && (
              <div className="text-center mb-8">
                <button
                  onClick={loadMore}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Load More Books
                </button>
              </div>
            )}

            {/* Loading more indicator */}
            {loading && books.length > 0 && (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
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