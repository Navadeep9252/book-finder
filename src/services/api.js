const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

export const searchBooks = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE_URL}/search.json?title=${encodeURIComponent(query)}&page=${page}&limit=20`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch books from Open Library');
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE_URL}${bookId}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Book details error:', error);
    throw new Error('Failed to fetch book details');
  }
};