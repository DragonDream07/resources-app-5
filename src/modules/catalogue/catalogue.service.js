import pool from '../../db/pool.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function paginate(page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (p - 1) * l;
  return { page: p, limit: l, offset };
}

function buildOrderClause(sort) {
  const allowed = {
    price_asc: 'p.base_price ASC',
    price_desc: 'p.base_price DESC',
    name_asc: 'p.name ASC',
    name_desc: 'p.name DESC',
    newest: 'p.created_at DESC',
  };
  return allowed[sort] || 'p.created_at DESC';
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts({ page, limit, category_id, brand_id, min_price, max_price, sort } = {}) {
  const { page: p, limit: l, offset } = paginate(page, limit);
  const conditions = ['p.deleted_at IS NULL'];
  const values = [];

  if (category_id) {
    values.push(category_id);
    conditions.push(`p.category_id = $${values.length}`);
  }
  if (brand_id) {
    values.push(brand_id);
    conditions.push(`p.brand_id = $${values.length}`);
  }
  if (min_price !== undefined && min_price !== '') {
    values.push(Number(min_price));
    conditions.push(`p.base_price >= $${values.length}`);
  }
  if (max_price !== undefined && max_price !== '') {
    values.push(Number(max_price));
    conditions.push(`p.base_price <= $${values.length}`);
  }

  const where = conditions.join(' AND ');
  const order = buildOrderClause(sort);

  const countQuery = `SELECT COUNT(*) FROM products p WHERE ${where}`;
  const dataQuery = `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.base_price,
      p.category_id,
      p.brand_id,
      p.status,
      p.created_at,
      p.updated_at
    FROM products p
    WHERE ${where}
    ORDER BY ${order}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countQuery, values),
    pool.query(dataQuery, [...values, l, offset]),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);
  return {
    data: dataResult.rows,
    meta: { page: p, limit: l, total, total_pages: Math.ceil(total / l) },
  };
}

export async function fetchProductById(productId) {
  const result = await pool.query(
    `SELECT
       p.id,
       p.name,
       p.slug,
       p.description,
       p.base_price,
       p.category_id,
       p.brand_id,
       p.status,
       p.created_at,
       p.updated_at
     FROM products p
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [productId]
  );
  return result.rows[0] || null;
}

export async function insertProduct({ name, slug, description, base_price, category_id, brand_id, status }) {
  const result = await pool.query(
    `INSERT INTO products (name, slug, description, base_price, category_id, brand_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, slug, description ?? null, base_price, category_id ?? null, brand_id ?? null, status ?? 'draft']
  );
  return result.rows[0];
}

export async function modifyProduct(productId, { name, slug, description, base_price, category_id, brand_id, status }) {
  const existing = await fetchProductById(productId);
  if (!existing) return null;

  const result = await pool.query(
    `UPDATE products
     SET
       name        = COALESCE($1, name),
       slug        = COALESCE($2, slug),
       description = COALESCE($3, description),
       base_price  = COALESCE($4, base_price),
       category_id = COALESCE($5, category_id),
       brand_id    = COALESCE($6, brand_id),
       status      = COALESCE($7, status),
       updated_at  = NOW()
     WHERE id = $8 AND deleted_at IS NULL
     RETURNING *`,
    [name ?? null, slug ?? null, description ?? null, base_price ?? null, category_id ?? null, brand_id ?? null, status ?? null, productId]
  );
  return result.rows[0] || null;
}

export async function removeProduct(productId) {
  await pool.query(
    `UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
    [productId]
  );
}

// ── SKUs ──────────────────────────────────────────────────────────────────────

export async function fetchSkusByProduct(productId) {
  const result = await pool.query(
    `SELECT
       s.id,
       s.product_id,
       s.sku_code,
       s.attributes,
       s.price,
       s.stock_quantity,
       s.status,
       s.created_at,
       s.updated_at
     FROM skus s
     WHERE s.product_id = $1 AND s.deleted_at IS NULL
     ORDER BY s.created_at ASC`,
    [productId]
  );
  return result.rows;
}

export async function fetchSkuById(productId, skuId) {
  const result = await pool.query(
    `SELECT
       s.id,
       s.product_id,
       s.sku_code,
       s.attributes,
       s.price,
       s.stock_quantity,
       s.status,
       s.created_at,
       s.updated_at
     FROM skus s
     WHERE s.id = $1 AND s.product_id = $2 AND s.deleted_at IS NULL`,
    [skuId, productId]
  );
  return result.rows[0] || null;
}

export async function insertSku(productId, { sku_code, attributes, price, stock_quantity, status }) {
  const product = await fetchProductById(productId);
  if (!product) {
    const err = new Error('Product not found.');
    err.statusCode = 404;
    throw err;
  }
  const result = await pool.query(
    `INSERT INTO skus (product_id, sku_code, attributes, price, stock_quantity, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [productId, sku_code, attributes ? JSON.stringify(attributes) : null, price, stock_quantity ?? 0, status ?? 'active']
  );
  return result.rows[0];
}

export async function modifySku(productId, skuId, { sku_code, attributes, price, stock_quantity, status }) {
  const existing = await fetchSkuById(productId, skuId);
  if (!existing) return null;

  const result = await pool.query(
    `UPDATE skus
     SET
       sku_code       = COALESCE($1, sku_code),
       attributes     = COALESCE($2, attributes),
       price          = COALESCE($3, price),
       stock_quantity = COALESCE($4, stock_quantity),
       status         = COALESCE($5, status),
       updated_at     = NOW()
     WHERE id = $6 AND product_id = $7 AND deleted_at IS NULL
     RETURNING *`,
    [
      sku_code ?? null,
      attributes ? JSON.stringify(attributes) : null,
      price ?? null,
      stock_quantity ?? null,
      status ?? null,
      skuId,
      productId,
    ]
  );
  return result.rows[0] || null;
}

export async function removeSku(productId, skuId) {
  await pool.query(
    `UPDATE skus SET deleted_at = NOW() WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL`,
    [skuId, productId]
  );
}

// ── Product Images ────────────────────────────────────────────────────────────

export async function fetchImagesByProduct(productId) {
  const result = await pool.query(
    `SELECT
       pi.id,
       pi.product_id,
       pi.url,
       pi.alt_text,
       pi.sort_order,
       pi.created_at
     FROM product_images pi
     WHERE pi.product_id = $1
     ORDER BY pi.sort_order ASC, pi.created_at ASC`,
    [productId]
  );
  return result.rows;
}

export async function insertProductImage(productId, { url, alt_text, sort_order }) {
  const product = await fetchProductById(productId);
  if (!product) {
    const err = new Error('Product not found.');
    err.statusCode = 404;
    throw err;
  }
  const result = await pool.query(
    `INSERT INTO product_images (product_id, url, alt_text, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [productId, url, alt_text ?? null, sort_order ?? 0]
  );
  return result.rows[0];
}

export async function removeProductImage(productId, imageId) {
  await pool.query(
    `DELETE FROM product_images WHERE id = $1 AND product_id = $2`,
    [imageId, productId]
  );
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories() {
  const result = await pool.query(
    `SELECT
       c.id,
       c.name,
       c.slug,
       c.description,
       c.parent_id,
       c.image_url,
       c.created_at,
       c.updated_at
     FROM categories c
     ORDER BY c.name ASC`
  );
  return result.rows;
}

export async function fetchCategoryById(categoryId) {
  const result = await pool.query(
    `SELECT
       c.id,
       c.name,
       c.slug,
       c.description,
       c.parent_id,
       c.image_url,
       c.created_at,
       c.updated_at
     FROM categories c
     WHERE c.id = $1`,
    [categoryId]
  );
  return result.rows[0] || null;
}

export async function fetchProductsByCategory(categoryId, { page, limit, sort } = {}) {
  const category = await fetchCategoryById(categoryId);
  if (!category) {
    const err = new Error('Category not found.');
    err.statusCode = 404;
    throw err;
  }
  return fetchProducts({ page, limit, sort, category_id: categoryId });
}

export async function insertCategory({ name, slug, description, parent_id, image_url }) {
  const result = await pool.query(
    `INSERT INTO categories (name, slug, description, parent_id, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, slug, description ?? null, parent_id ?? null, image_url ?? null]
  );
  return result.rows[0];
}

export async function modifyCategory(categoryId, { name, slug, description, parent_id, image_url }) {
  const existing = await fetchCategoryById(categoryId);
  if (!existing) return null;

  const result = await pool.query(
    `UPDATE categories
     SET
       name        = COALESCE($1, name),
       slug        = COALESCE($2, slug),
       description = COALESCE($3, description),
       parent_id   = COALESCE($4, parent_id),
       image_url   = COALESCE($5, image_url),
       updated_at  = NOW()
     WHERE id = $6
     RETURNING *`,
    [name ?? null, slug ?? null, description ?? null, parent_id ?? null, image_url ?? null, categoryId]
  );
  return result.rows[0] || null;
}

export async function removeCategory(categoryId) {
  await pool.query(`DELETE FROM categories WHERE id = $1`, [categoryId]);
}

// ── Brands ────────────────────────────────────────────────────────────────────

export async function fetchBrands() {
  const result = await pool.query(
    `SELECT
       b.id,
       b.name,
       b.slug,
       b.description,
       b.image_url,
       b.created_at,
       b.updated_at
     FROM brands b
     ORDER BY b.name ASC`
  );
  return result.rows;
}

export async function fetchBrandById(brandId) {
  const result = await pool.query(
    `SELECT
       b.id,
       b.name,
       b.slug,
       b.description,
       b.image_url,
       b.created_at,
       b.updated_at
     FROM brands b
     WHERE b.id = $1`,
    [brandId]
  );
  return result.rows[0] || null;
}

export async function insertBrand({ name, slug, description, image_url }) {
  const result = await pool.query(
    `INSERT INTO brands (name, slug, description, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, slug, description ?? null, image_url ?? null]
  );
  return result.rows[0];
}

export async function modifyBrand(brandId, { name, slug, description, image_url }) {
  const existing = await fetchBrandById(brandId);
  if (!existing) return null;

  const result = await pool.query(
    `UPDATE brands
     SET
       name        = COALESCE($1, name),
       slug        = COALESCE($2, slug),
       description = COALESCE($3, description),
       image_url   = COALESCE($4, image_url),
       updated_at  = NOW()
     WHERE id = $5
     RETURNING *`,
    [name ?? null, slug ?? null, description ?? null, image_url ?? null, brandId]
  );
  return result.rows[0] || null;
}

export async function removeBrand(brandId) {
  await pool.query(`DELETE FROM brands WHERE id = $1`, [brandId]);
}
