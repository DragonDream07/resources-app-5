import React, { useState } from 'react';

const SortIcon = ({ direction }) => {
  if (!direction) return <span className="admin-data-table__sort-icon">↕</span>;
  return (
    <span className="admin-data-table__sort-icon">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
};

const AdminDataTable = ({
  columns,
  data,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  loading,
  emptyMessage,
  rowKey,
}) => {
  const totalPages = Math.ceil((totalCount || 0) / (pageSize || 10));

  const handleHeaderClick = (col) => {
    if (!col.sortable || !onSort) return;
    const newDirection =
      sortField === col.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(col.key, newDirection);
  };

  const getKey = (row, index) => {
    if (typeof rowKey === 'function') return rowKey(row);
    if (typeof rowKey === 'string') return row[rowKey];
    return index;
  };

  return (
    <div className="admin-data-table">
      {loading && (
        <div className="admin-data-table__loading">Loading...</div>
      )}

      <div className="admin-data-table__wrapper">
        <table className="admin-data-table__table">
          <thead className="admin-data-table__head">
            <tr>
              {(columns || []).map((col) => (
                <th
                  key={col.key}
                  className={`admin-data-table__th${col.sortable ? ' admin-data-table__th--sortable' : ''}`}
                  onClick={() => handleHeaderClick(col)}
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                  {col.sortable && (
                    <SortIcon
                      direction={sortField === col.key ? sortDirection : null}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="admin-data-table__body">
            {!loading && (!data || data.length === 0) ? (
              <tr>
                <td
                  className="admin-data-table__empty"
                  colSpan={(columns || []).length}
                >
                  {emptyMessage || 'No records found.'}
                </td>
              </tr>
            ) : (
              (data || []).map((row, index) => (
                <tr key={getKey(row, index)} className="admin-data-table__row">
                  {(columns || []).map((col) => (
                    <td key={col.key} className="admin-data-table__td">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-data-table__pagination">
          <button
            className="admin-data-table__page-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <span className="admin-data-table__page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="admin-data-table__page-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDataTable;
