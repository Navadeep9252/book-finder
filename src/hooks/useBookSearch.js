import { useState, useEffect } from 'react';
import { searchBooks } from '../services/api';

export const useBookSearch = (query, page = 1) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    const search = async () => {
      try {
        const data = await searchBooks(query, page);
        setBooks(prev => page === 1 ? data.docs : [...prev, ...data.docs]);
        setHasMore(data.docs && data.docs.length === 100);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [query, page]);

  return { books, loading, error, hasMore };
};