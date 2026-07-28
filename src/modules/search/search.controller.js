import { searchService } from './search.service.js';

/**
 * GET /search
 * Full-text product search with optional faceted filters, pagination.
 */
export async function searchProducts(req, res, next) {
  try {
    const { q = '', filters = '{}', page = 1, size = 20, sort } = req.query;

    let parsedFilters;
    try {
      parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
    } catch {
      parsedFilters = {};
    }

    const result = await searchService.search({
      q,
      filters: parsedFilters,
      page: Number(page),
      size: Number(size),
      sort,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /search/autocomplete  (mapped from GET /search/suggest per OpenAPI)
 * Autocomplete / suggestion queries.
 */
export async function suggest(req, res, next) {
  try {
    const { q = '', size = 5 } = req.query;

    const result = await searchService.suggest({
      q,
      size: Number(size),
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
