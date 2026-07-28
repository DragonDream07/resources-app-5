import db from '../client.js';

const PRODUCTS_TABLE = 'products';
const IMAGES_TABLE = 'product_images';

export async function findById(id) {
  return db(PRODUCTS_TABLE).where({ id }).first();
}

export async function findAll({
  limit = 20,
  offset = 0,
  categoryId,
  brandId,
  isActive,
} = {}) {
  const query = db(PRODUCTS_TABLE).select('*');
  if (categoryId !== undefined) query.where({ category_id: categoryId });
  if (brandId !== undefined) query.where({ brand_id: brandId });
  if (isActive !== undefined) query.where({ is_active: isActive });
  return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
}

export async function countAll({ categoryId, brandId, isActive } = {}) {
  const query = db(PRODUCTS_TABLE).count('id as count');
  if (categoryId !== undefined) query.where({ category_id: categoryId });
  if (brandId !== undefined) query.where({ brand_id: brandId });
  if (isActive !== undefined) query.where({ is_active: isActive });
  const [{ count }] = await query;
  return Number(count);
}

export async function findByCategoryIds(categoryIds, { limit = 20, offset = 0 } = {}) {
  return db(PRODUCTS_TABLE)
    .whereIn('category_id', categoryIds)
    .where({ is_active: true })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function create(data) {
  const [row] = await db(PRODUCTS_TABLE).insert(data).returning('*');
  return row;
}

export async function updateById(id, data) {
  const [row] = await db(PRODUCTS_TABLE).where({ id }).update(data).returning('*');
  return row;
}

export async function deleteById(id) {
  return db(PRODUCTS_TABLE).where({ id }).delete();
}

export async function findBySlug(slug) {
  return db(PRODUCTS_TABLE).where({ slug }).first();
}

// Product images
export async function findImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).orderBy('sort_order', 'asc').select('*');
}

export async function findImageById(id) {
  return db(IMAGES_TABLE).where({ id }).first();
}

export async function addImage(data) {
  const [row] = await db(IMAGES_TABLE).insert(data).returning('*');
  return row;
}

export async function deleteImageById(id) {
  return db(IMAGES_TABLE).where({ id }).delete();
}

export async function deleteImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).delete();
}
