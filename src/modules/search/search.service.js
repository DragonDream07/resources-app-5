import { Client } from '@elastic/elasticsearch';

const PRODUCTS_INDEX = process.env.ES_PRODUCTS_INDEX || 'products';

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth:
    process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
      ? {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        }
      : undefined,
});

/**
 * Build an Elasticsearch bool query for full-text search + facet filters.
 */
function buildSearchQuery({ q, filters }) {
  const must = [];
  const filterClauses = [];

  if (q && q.trim() !== '') {
    must.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'description^1', 'brand^2', 'category^2', 'tags'],
        fuzziness: 'AUTO',
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  // Faceted filters
  if (filters) {
    if (filters.category) {
      filterClauses.push({ term: { 'category.keyword': filters.category } });
    }
    if (filters.brand) {
      filterClauses.push({ term: { 'brand.keyword': filters.brand } });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const range = {};
      if (filters.minPrice !== undefined) range.gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) range.lte = Number(filters.maxPrice);
      filterClauses.push({ range: { price: range } });
    }
    if (Array.isArray(filters.tags) && filters.tags.length > 0) {
      filterClauses.push({ terms: { 'tags.keyword': filters.tags } });
    }
    if (filters.inStock !== undefined) {
      filterClauses.push({ term: { inStock: filters.inStock === true || filters.inStock === 'true' } });
    }
  }

  return {
    bool: {
      must,
      filter: filterClauses,
    },
  };
}

/**
 * Build facet aggregations.
 */
function buildAggregations() {
  return {
    categories: {
      terms: { field: 'category.keyword', size: 50 },
    },
    brands: {
      terms: { field: 'brand.keyword', size: 50 },
    },
    price_stats: {
      stats: { field: 'price' },
    },
    tags: {
      terms: { field: 'tags.keyword', size: 50 },
    },
  };
}

/**
 * Build sort clause.
 */
function buildSort(sort) {
  const sortMap = {
    price_asc: [{ price: 'asc' }],
    price_desc: [{ price: 'desc' }],
    newest: [{ createdAt: 'desc' }],
    relevance: ['_score'],
  };
  return sortMap[sort] || ['_score'];
}

export const searchService = {
  /**
   * Full-text search with faceted aggregations.
   */
  async search({ q, filters, page, size, sort }) {
    const from = (page - 1) * size;

    const body = {
      from,
      size,
      query: buildSearchQuery({ q, filters }),
      aggs: buildAggregations(),
      sort: buildSort(sort),
    };

    const response = await esClient.search({
      index: PRODUCTS_INDEX,
      body,
    });

    const hits = response.body ?? response;
    const rawHits = hits.hits?.hits ?? [];
    const total = hits.hits?.total?.value ?? hits.hits?.total ?? 0;
    const aggs = hits.aggregations ?? {};

    const products = rawHits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));

    const facets = {
      categories: (aggs.categories?.buckets ?? []).map((b) => ({
        value: b.key,
        count: b.doc_count,
      })),
      brands: (aggs.brands?.buckets ?? []).map((b) => ({
        value: b.key,
        count: b.doc_count,
      })),
      tags: (aggs.tags?.buckets ?? []).map((b) => ({
        value: b.key,
        count: b.doc_count,
      })),
      priceStats: aggs.price_stats ?? {},
    };

    return {
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
      products,
      facets,
    };
  },

  /**
   * Autocomplete / suggest query.
   */
  async suggest({ q, size }) {
    if (!q || q.trim() === '') {
      return { suggestions: [] };
    }

    const body = {
      size,
      query: {
        multi_match: {
          query: q,
          fields: ['name^3', 'brand^2', 'category^2'],
          type: 'phrase_prefix',
        },
      },
      _source: ['name', 'brand', 'category', 'slug'],
    };

    const response = await esClient.search({
      index: PRODUCTS_INDEX,
      body,
    });

    const hits = response.body ?? response;
    const rawHits = hits.hits?.hits ?? [];

    const suggestions = rawHits.map((hit) => ({
      id: hit._id,
      name: hit._source.name,
      brand: hit._source.brand,
      category: hit._source.category,
      slug: hit._source.slug,
    }));

    return { suggestions };
  },
};
