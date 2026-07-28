import React from 'react';

function PageButton({ page, currentPage, onClick, disabled }) {
  const isActive = page === currentPage;
  return (
    <button
      type="button"
      disabled={disabled || isActive}
      onClick={() => !isActive && onClick(page)}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Go to page ${page}`}
      className={[
        'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
        isActive
          ? 'bg-blue-600 text-white cursor-default'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
      ].join(' ')}
    >
      {page}
    </button>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) {
  if (totalPages <= 1) return null;

  function buildPages() {
    const pages = [];
    const left = Math.max(1, currentPage - siblingCount);
    const right = Math.min(totalPages, currentPage + siblingCount);

    if (left > 2) {
      pages.push(1, '...');
    } else if (left === 2) {
      pages.push(1);
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('...', totalPages);
    } else if (right === totalPages - 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  const pages = buildPages();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center gap-1 ${className}`}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={[
          'inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700',
          'hover:bg-gray-50 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Prev
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-500"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <PageButton
            key={p}
            page={p}
            currentPage={currentPage}
            onClick={onPageChange}
          />
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={[
          'inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700',
          'hover:bg-gray-50 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
}
