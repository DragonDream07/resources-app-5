import { client } from '../client.js';

// Sample products with SKU variants
// Requires categories and brands to be seeded first.

const sampleProducts = [
  {
    name: 'Samsung Galaxy S23',
    slug: 'samsung-galaxy-s23',
    description: 'Samsung flagship smartphone with advanced camera and performance.',
    brandSlug: 'samsung',
    categorySlug: 'mobile-phones',
    skus: [
      { sku_code: 'SGS23-BLK-128', attributes: { color: 'Black', storage: '128GB' }, price: 79999, stock: 50 },
      { sku_code: 'SGS23-WHT-128', attributes: { color: 'White', storage: '128GB' }, price: 79999, stock: 40 },
      { sku_code: 'SGS23-BLK-256', attributes: { color: 'Black', storage: '256GB' }, price: 89999, stock: 30 },
    ],
  },
  {
    name: 'Apple MacBook Air M2',
    slug: 'apple-macbook-air-m2',
    description: 'Thin, light MacBook Air powered by Apple M2 chip.',
    brandSlug: 'apple',
    categorySlug: 'laptops',
    skus: [
      { sku_code: 'MBA-M2-8-256', attributes: { ram: '8GB', storage: '256GB' }, price: 114900, stock: 20 },
      { sku_code: 'MBA-M2-8-512', attributes: { ram: '8GB', storage: '512GB' }, price: 134900, stock: 15 },
      { sku_code: 'MBA-M2-16-512', attributes: { ram: '16GB', storage: '512GB' }, price: 154900, stock: 10 },
    ],
  },
  {
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Iconic Nike running shoes with large Air unit.',
    brandSlug: 'nike',
    categorySlug: 'men',
    skus: [
      { sku_code: 'NAM270-BLK-8', attributes: { color: 'Black', size: '8' }, price: 12995, stock: 25 },
      { sku_code: 'NAM270-BLK-9', attributes: { color: 'Black', size: '9' }, price: 12995, stock: 20 },
      { sku_code: 'NAM270-WHT-8', attributes: { color: 'White', size: '8' }, price: 12995, stock: 15 },
    ],
  },
  {
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    description: 'High-performance running shoe with Boost midsole.',
    brandSlug: 'adidas',
    categorySlug: 'women',
    skus: [
      { sku_code: 'AUB22-CRM-5', attributes: { color: 'Cream', size: '5' }, price: 14999, stock: 18 },
      { sku_code: 'AUB22-CRM-6', attributes: { color: 'Cream', size: '6' }, price: 14999, stock: 22 },
      { sku_code: 'AUB22-BLK-5', attributes: { color: 'Black', size: '5' }, price: 14999, stock: 12 },
    ],
  },
  {
    name: 'IKEA KALLAX Shelf Unit',
    slug: 'ikea-kallax-shelf',
    description: 'Versatile shelf unit that can be used as a room divider.',
    brandSlug: 'ikea',
    categorySlug: 'furniture',
    skus: [
      { sku_code: 'KLX-WHT-2X2', attributes: { color: 'White', configuration: '2x2' }, price: 5999, stock: 30 },
      { sku_code: 'KLX-BLK-2X2', attributes: { color: 'Black-Brown', configuration: '2x2' }, price: 5999, stock: 25 },
      { sku_code: 'KLX-WHT-4X2', attributes: { color: 'White', configuration: '4x2' }, price: 8999, stock: 20 },
    ],
  },
  {
    name: 'Prestige Pressure Cooker 5L',
    slug: 'prestige-pressure-cooker-5l',
    description: 'Durable stainless steel pressure cooker for everyday cooking.',
    brandSlug: 'prestige',
    categorySlug: 'cookware',
    skus: [
      { sku_code: 'PPC-5L-SS', attributes: { material: 'Stainless Steel', capacity: '5L' }, price: 2499, stock: 60 },
      { sku_code: 'PPC-3L-SS', attributes: { material: 'Stainless Steel', capacity: '3L' }, price: 1999, stock: 70 },
    ],
  },
];

async function seed() {
  console.log('Seeding products and SKUs...');

  for (const product of sampleProducts) {
    // Resolve brand id
    const brandResult = await client.query(
      `SELECT id FROM brands WHERE slug = $1`,
      [product.brandSlug]
    );
    if (brandResult.rows.length === 0) {
      throw new Error(`Brand not found: ${product.brandSlug}`);
    }
    const brandId = brandResult.rows[0].id;

    // Resolve category id
    const categoryResult = await client.query(
      `SELECT id FROM categories WHERE slug = $1`,
      [product.categorySlug]
    );
    if (categoryResult.rows.length === 0) {
      throw new Error(`Category not found: ${product.categorySlug}`);
    }
    const categoryId = categoryResult.rows[0].id;

    // Upsert product
    const productResult = await client.query(
      `INSERT INTO products (name, slug, description, brand_id, category_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             description = EXCLUDED.description,
             brand_id = EXCLUDED.brand_id,
             category_id = EXCLUDED.category_id
       RETURNING id`,
      [product.name, product.slug, product.description, brandId, categoryId]
    );
    const productId = productResult.rows[0].id;

    // Upsert SKUs
    for (const sku of product.skus) {
      await client.query(
        `INSERT INTO skus (product_id, sku_code, attributes, price, stock)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (sku_code) DO UPDATE
           SET attributes = EXCLUDED.attributes,
               price = EXCLUDED.price,
               stock = EXCLUDED.stock`,
        [productId, sku.sku_code, JSON.stringify(sku.attributes), sku.price, sku.stock]
      );
    }
  }

  console.log('Products and SKUs seeded.');
}

seed()
  .then(() => client.end())
  .catch((err) => {
    console.error('Error seeding products and SKUs:', err);
    client.end();
    process.exit(1);
  });
