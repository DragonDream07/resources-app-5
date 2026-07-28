import searchIcon from '@/assets/icons/search.svg';

function getSuggestionLabel(suggestion) {
  if (typeof suggestion === 'string') return suggestion;
  return suggestion.label || suggestion.name || suggestion.query || '';
}

function getSuggestionType(suggestion) {
  if (typeof suggestion === 'string') return null;
  return suggestion.type || null;
}

export default function AutocompleteSuggestions({
  suggestions = [],
  activeIndex = -1,
  onSelect,
  onClose,
  isLoading = false,
}) {
  if (!isLoading && suggestions.length === 0) {
    return null;
  }

  const handleMouseDown = (event, suggestion) => {
    // Prevent input blur before click registers
    event.preventDefault();
    if (onSelect) onSelect(suggestion);
  };

  const handleKeyDown = (event, suggestion) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onSelect) onSelect(suggestion);
    } else if (event.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  return (
    <div className="autocomplete-suggestions" role="presentation">
      {isLoading ? (
        <ul
          id="search-autocomplete-listbox"
          className="autocomplete-suggestions__list"
          role="listbox"
          aria-label="Search suggestions"
        >
          <li className="autocomplete-suggestions__loading" role="option" aria-selected="false">
            <span>Loading suggestions…</span>
          </li>
        </ul>
      ) : (
        <ul
          id="search-autocomplete-listbox"
          className="autocomplete-suggestions__list"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion, index) => {
            const label = getSuggestionLabel(suggestion);
            const type = getSuggestionType(suggestion);
            const isActive = index === activeIndex;

            return (
              <li
                key={`suggestion-${index}`}
                id={`search-suggestion-${index}`}
                className={`autocomplete-suggestions__item${
                  isActive ? ' autocomplete-suggestions__item--active' : ''
                }`}
                role="option"
                aria-selected={isActive}
                tabIndex={-1}
                onMouseDown={(e) => handleMouseDown(e, suggestion)}
                onKeyDown={(e) => handleKeyDown(e, suggestion)}
              >
                <img
                  src={searchIcon}
                  alt=""
                  className="autocomplete-suggestions__item-icon"
                  aria-hidden="true"
                />
                <span className="autocomplete-suggestions__item-label">{label}</span>
                {type && (
                  <span className="autocomplete-suggestions__item-type">{type}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
