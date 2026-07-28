/**
 * @typedef {Object} ProductImage
 * @property {number} id
 * @property {number} product_id
 * @property {string} url
 * @property {string|null} alt_text
 * @property {number} display_order
 * @property {boolean} is_primary
 * @property {string} created_at
 */

/**
 * @typedef {Object} SKU
 * @property {number} id
 * @property {number} product_id
 * @property {string} sku_code
 * @property {string} variant_label
 * @property {number} price
 * @property {number} compare_at_price
 * @property {number} stock_quantity
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {number|null} parent_id
 * @property {string|null} description
 * @property {string|null} image_url
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Brand
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} logo_url
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {number|null} category_id
 * @property {number|null} brand_id
 * @property {boolean} is_active
 * @property {Category|null} category
 * @property {Brand|null} brand
 * @property {SKU[]} skus
 * @property {ProductImage[]} images
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
