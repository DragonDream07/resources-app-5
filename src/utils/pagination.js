/**
 * Parse and validate pagination query parameters.
 *
 * @param {object} query - Express req.query object
 * @param {number} [defaultLimit=20] - Default page size
 * @param {number} [maxLimit=100]    - Maximum allowed page size
 * @returns {{ page: number, limit: number, offset: number }}
 */
export function parsePagination(query, defaultLimit = 20, maxLimit = 100) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) {
    page = 1;
  }

  if (!Number.isFinite(limit) || limit < 1) {
    limit = defaultLimit;
  }

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build the offset value from page and limit.
 *
 * @param {number} page  - 1-based page number
 * @param {number} limit - Page size
 * @returns {number} offset
 */
export function buildOffset(page, limit) {
  return (page - 1) * limit;
}

/**
 * Format a standard paginated response envelope.
 *
 * @param {Array}  data       - Array of items for the current page
 * @param {number} total      - Total number of matching records
 * @param {number} page       - Current 1-based page number
 * @param {number} limit      - Page size
 * @returns {object} Paginated response object
 */
export function formatPaginatedResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
