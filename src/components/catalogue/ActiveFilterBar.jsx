import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 hover:text-blue-900 focus:outline-none"
        aria-label={`Remove filter: ${label}`}
      >
        <img src={closeIcon} alt="remove" className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function ActiveFilterBar({
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
}) {
  if (!activeFilters || activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2" aria-label="Active filters">
      <span className="text-xs text-gray-500 font-medium">Applied:</span>
      {activeFilters.map((filter) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          onRemove={() => onRemoveFilter && onRemoveFilter(filter)}
        />
      ))}
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-800 font-medium underline ml-1 focus:outline-none"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
