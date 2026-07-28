import { Client } from '@elastic/elasticsearch';

const PRODUCTS_INDEX = 'products';
const SUGGEST_INDEX = 'products_suggest';

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let _client = null;

function getClient() {
  if (!_client) {
    _client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
        ? {
            username: process.env.ELASTICSEARCH_USERNAME,
            password: process.env.ELASTICSEARCH_PASSWORD,
          }
        : undefined,
      tls: process.env.ELASTICSEARCH_TLS_REJECT_UNAUTHORIZED === 'false'
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Index mappings
// ---------------------------------------------------------------------------

const PRODUCTS_MAPPING = {
  mappings: {
    properties: {
      productId:    { type: 'keyword' },
      name:         { type: 'text',    analyzer: 'standard', fields: { keyword: { type: 'keyword' } } },
      description:  { type: 'text',    analyzer: 'standard' },
      brandId:      { type: 'keyword' },
      brandName:    { type: 'text',    fields: { keyword: { type: 'keyword' } } },
      categoryId:   { type: 'keyword' },
      categoryName: { type: 'text',    fields: { keyword: { type: 'keyword' } } },
      price:        { type: 'double' },
      salePrice:    { type: 'double' },
      inStock:      { type: 'boolean' },
      tags:         { type: 'keyword' },
      imageUrl:     { type: 'keyword', index: false },
      slug:         { type: 'keyword' },
      rating:       { type: 'float' },
      reviewCount:  { type: 'integer' },
      createdAt:    { type: 'date' },
      updatedAt:    { type: 'date' },
    },
  },
  settings: {
    number_of_shards:   1,
    number_of_replicas: 0,
  },
};

const SUGGEST_MAPPING = {
  mappings: {
    properties: {
      suggest: {
        type: 'completion',
        analyzer: 'simple',
        preserve_separators: true,
        preserve_position_increments: true,
        max_input_length: 50,
      },
      productId: { type: 'keyword' },
      name:      { type: 'text' },
    },
  },
  settings: {
    number_of_shards:   1,
    number_of_replicas: 0,
  },
};

// ---------------------------------------------------------------------------
// Index helpers
// ---------------------------------------------------------------------------

async function indexExists(index) {
  const client = getClient();
  const { body } = await client.indices.exists({ index });
  return body;
}

async function createIndex(index, mapping) {
  const client = getClient();
  await client.indices.create({ index, body: mapping });
}

async function ensureProductsIndex() {
  if (!(await indexExists(PRODUCTS_INDEX))) {
    await createIndex(PRODUCTS_INDEX, PRODUCTS_MAPPING);
  }
}

async function ensureSuggestIndex() {
  if (!(await indexExists(SUGGEST_INDEX))) {
    await createIndex(SUGGEST_INDEX, SUGGEST_MAPPING);
  }
}

async function ensureIndices() {
  await ensureProductsIndex();
  await ensureSuggestIndex();
}

async function deleteIndex(index) {
  const client = getClient();
  const exists = await indexExists(index);
  if (exists) {
    await client.indices.delete({ index });
  }
}

async function refreshIndex(index) {
  const client = getClient();
  await client.indices.refresh({ index });
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

/**
 * Build a full-text search query for products.
 *
 * @param {object} params
 * @param {string}   [params.q]          - Free-text search query
 * @param {string}   [params.categoryId] - Filter by category
 * @param {string}   [params.brandId]    - Filter by brand
 * @param {number}   [params.minPrice]   - Minimum price filter
 * @param {number}   [params.maxPrice]   - Maximum price filter
 * @param {boolean}  [params.inStock]    - Filter in-stock only
 * @param {string[]} [params.tags]       - Filter by tags
 * @param {string}   [params.sortBy]     - Field to sort by
 * @param {string}   [params.sortOrder]  - 'asc' | 'desc'
 * @param {number}   [params.from]       - Pagination offset
 * @param {number}   [params.size]       - Page size
 * @returns {object} Elasticsearch request body
 */
function buildSearchQuery(params = {}) {
  const {
    q,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    inStock,
    tags,
    sortBy    = '_score',
    sortOrder = 'desc',
    from      = 0,
    size      = 20,
  } = params;

  const mustClauses = [];
  const filterClauses = [];

  if (q && q.trim()) {
    mustClauses.push({
      multi_match: {
        query: q.trim(),
        fields: ['name^3', 'description', 'brandName^2', 'categoryName^2', 'tags'],
        type:   'best_fields',
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  if (categoryId) {
    filterClauses.push({ term: { categoryId } });
  }

  if (brandId) {
    filterClauses.push({ term: { brandId } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const range = {};
    if (minPrice !== undefined) range.gte = minPrice;
    if (maxPrice !== undefined) range.lte = maxPrice;
    filterClauses.push({ range: { price: range } });
  }

  if (inStock !== undefined) {
    filterClauses.push({ term: { inStock } });
  }

  if (tags && tags.length > 0) {
    filterClauses.push({ terms: { tags } });
  }

  const sort = buildSort(sortBy, sortOrder);

  return {
    from,
    size,
    query: {
      bool: {
        must:   mustClauses,
        filter: filterClauses,
      },
    },
    sort,
    aggs: buildAggregations(),
    highlight: {
      fields: {
        name:        {},
        description: {},
      },
    },
  };
}

/**
 * Build a completion-suggester query.
 *
 * @param {string} prefix - The partial text typed by the user
 * @param {number} [size] - Maximum number of suggestions
 * @returns {object} Elasticsearch request body
 */
function buildSuggestQuery(prefix, size = 10) {
  return {
    suggest: {
      product_suggest: {
        prefix,
        completion: {
          field: 'suggest',
          size,
          skip_duplicates: true,
          fuzzy: {
            fuzziness: 'AUTO',
          },
        },
      },
    },
  };
}

/**
 * Build a query to fetch products belonging to a specific category.
 *
 * @param {string} categoryId
 * @param {number} [from]
 * @param {number} [size]
 * @param {string} [sortBy]
 * @param {string} [sortOrder]
 * @returns {object} Elasticsearch request body
 */
function buildCategoryProductsQuery(categoryId, { from = 0, size = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
  return {
    from,
    size,
    query: {
      bool: {
        filter: [{ term: { categoryId } }],
      },
    },
    sort: buildSort(sortBy, sortOrder),
  };
}

/**
 * Build the sort clause from a field name and direction.
 *
 * @param {string} sortBy
 * @param {string} sortOrder
 * @returns {Array}
 */
function buildSort(sortBy, sortOrder) {
  const direction = sortOrder === 'asc' ? 'asc' : 'desc';

  const ALLOWED_SORT_FIELDS = new Set([
    '_score', 'price', 'salePrice', 'rating', 'reviewCount', 'createdAt', 'updatedAt', 'name.keyword',
  ]);

  const field = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : '_score';

  if (field === '_score') {
    return [{ _score: { order: direction } }];
  }

  return [{ [field]: { order: direction } }, { _score: { order: 'desc' } }];
}

/**
 * Build standard facet aggregations for product search.
 *
 * @returns {object}
 */
function buildAggregations() {
  return {
    categories: {
      terms: { field: 'categoryId', size: 50 },
    },
    brands: {
      terms: { field: 'brandId', size: 50 },
    },
    price_stats: {
      stats: { field: 'price' },
    },
    in_stock_count: {
      filter: { term: { inStock: true } },
    },
  };
}

// ---------------------------------------------------------------------------
// Document operations
// ---------------------------------------------------------------------------

async function indexProduct(product) {
  const client = getClient();
  await client.index({
    index: PRODUCTS_INDEX,
    id:    String(product.productId),
    body:  product,
    refresh: 'wait_for',
  });
}

async function updateProduct(productId, partialDoc) {
  const client = getClient();
  await client.update({
    index: PRODUCTS_INDEX,
    id:    String(productId),
    body:  { doc: partialDoc },
    refresh: 'wait_for',
  });
}

async function deleteProduct(productId) {
  const client = getClient();
  await client.delete({
    index:   PRODUCTS_INDEX,
    id:      String(productId),
    refresh: 'wait_for',
  });
}

async function bulkIndexProducts(products) {
  const client = getClient();
  const body = products.flatMap((product) => [
    { index: { _index: PRODUCTS_INDEX, _id: String(product.productId) } },
    product,
  ]);

  const { body: result } = await client.bulk({ body, refresh: 'wait_for' });
  return result;
}

// ---------------------------------------------------------------------------
// Search execution
// ---------------------------------------------------------------------------

async function search(queryBody) {
  const client = getClient();
  const { body } = await client.search({
    index: PRODUCTS_INDEX,
    body:  queryBody,
  });
  return body;
}

async function suggest(queryBody) {
  const client = getClient();
  const { body } = await client.search({
    index: SUGGEST_INDEX,
    body:  queryBody,
  });
  return body;
}

// ---------------------------------------------------------------------------
// Response parsers
// ---------------------------------------------------------------------------

/**
 * Parse a standard search response into a normalised shape.
 *
 * @param {object} esResponse - Raw Elasticsearch response body
 * @returns {{ hits: object[], total: number, aggregations: object }}
 */
function parseSearchResponse(esResponse) {
  const hits  = (esResponse.hits?.hits  ?? []).map((hit) => ({
    ...hit._source,
    _score:    hit._score,
    highlight: hit.highlight,
  }));
  const total = esResponse.hits?.total?.value ?? 0;
  const aggregations = esResponse.aggregations ?? {};

  return { hits, total, aggregations };
}

/**
 * Parse a completion-suggester response into an array of suggestion strings.
 *
 * @param {object} esResponse - Raw Elasticsearch response body
 * @returns {string[]}
 */
function parseSuggestResponse(esResponse) {
  const options = esResponse.suggest?.product_suggest?.[0]?.options ?? [];
  return options.map((opt) => opt.text);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const elasticsearchAdapter = {
  // Client
  getClient,

  // Index constants
  PRODUCTS_INDEX,
  SUGGEST_INDEX,

  // Index mapping helpers
  ensureIndices,
  ensureProductsIndex,
  ensureSuggestIndex,
  createIndex,
  deleteIndex,
  refreshIndex,
  indexExists,
  PRODUCTS_MAPPING,
  SUGGEST_MAPPING,

  // Query builders
  buildSearchQuery,
  buildSuggestQuery,
  buildCategoryProductsQuery,
  buildSort,
  buildAggregations,

  // Document operations
  indexProduct,
  updateProduct,
  deleteProduct,
  bulkIndexProducts,

  // Search execution
  search,
  suggest,

  // Response parsers
  parseSearchResponse,
  parseSuggestResponse,
};

export default elasticsearchAdapter;
