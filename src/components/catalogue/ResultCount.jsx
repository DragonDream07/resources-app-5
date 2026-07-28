import React from 'react';

export default function ResultCount({
  total,
  label = 'result',
  facets = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
    );
  }

  if (total == null) return null;

  const pluralLabel = total === 1 ? label : `${label}s`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{total.toLocaleString('en-IN')}</span>{' '}
        {pluralLabel} found
      </p>
      {facets && facets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {facets.map((facet) => (
            <span
              key={facet.id}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {facet.label}:{' '}
              <span className="font-medium text-gray-800">{facet.count.toLocaleString('en-IN')}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
