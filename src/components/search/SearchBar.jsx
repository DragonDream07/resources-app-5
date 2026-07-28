import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const DEBOUNCE_DELAY = 300;

export default function SearchBar({ initialQuery = '', className = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceTimer = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q: trimmed });
        const response = await fetch(`/search/suggest?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : (data.suggestions || data.data || []);
          setSuggestions(items);
          setIsOpen(items.length > 0);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const submitSearch = (searchQuery) => {
    const trimmed = (searchQuery || query).trim();
    if (!trimmed) return;
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === 'Enter') {
        submitSearch();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const selected = suggestions[activeIndex];
        const label = typeof selected === 'string' ? selected : (selected.label || selected.name || selected.query || '');
        setQuery(label);
        submitSearch(label);
      } else {
        submitSearch();
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionSelect = (suggestion) => {
    const label = typeof suggestion === 'string' ? suggestion : (suggestion.label || suggestion.name || suggestion.query || '');
    setQuery(label);
    submitSearch(label);
  };

  const handleSubmitButton = (event) => {
    event.preventDefault();
    submitSearch();
  };

  return (
    <div ref={containerRef} className={`search-bar ${className}`} role="search">
      <form
        className="search-bar__form"
        onSubmit={handleSubmitButton}
        aria-label="Search"
      >
        <div className="search-bar__input-wrapper">
          <img
            src={searchIcon}
            alt=""
            className="search-bar__icon search-bar__icon--search"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            className="search-bar__input"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search for products…"
            autoComplete="off"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls={isOpen ? 'search-autocomplete-listbox' : undefined}
            aria-activedescendant={
              activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined
            }
            aria-expanded={isOpen}
            role="combobox"
          />
          {query.length > 0 && (
            <button
              type="button"
              className="search-bar__clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <img src={closeIcon} alt="" aria-hidden="true" />
            </button>
          )}
        </div>
        <button type="submit" className="search-bar__submit-btn" aria-label="Submit search">
          Search
        </button>
      </form>

      {isOpen && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={handleSuggestionSelect}
          onClose={() => { setIsOpen(false); setActiveIndex(-1); }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
