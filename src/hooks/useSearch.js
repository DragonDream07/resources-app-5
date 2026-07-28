import { useState, useEffect, useCallback, useRef } from 'react';

const DEBOUNCE_DELAY_MS = 300;

async function fetchSuggestions(query) {
  if (!query || query.trim().length === 0) return [];
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/search/suggest?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  const data = await response.json();
  return data.suggestions ?? data.data ?? data ?? [];
}

async function fetchSearchResults(query, filters = {}) {
  const params = new URLSearchParams({ q: query, ...filters });
  const response = await fetch(`/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }
  return response.json();
}

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query || query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(query);
        setSuggestions(data);
      } catch (err) {
        setSuggestions([]);
      }
    }, DEBOUNCE_DELAY_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const search = useCallback(
    async (searchQuery, filters = {}) => {
      const q = searchQuery ?? query;
      if (!q || q.trim().length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSearchResults(q, filters);
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    clearSuggestions,
    results,
    search,
    loading,
    error,
  };
}
