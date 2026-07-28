import { client } from '../client.js';

// Category tree:
// Electronics
//   └── Mobile Phones
//   └── Laptops
// Clothing
//   └── Men
//   └── Women
// Home & Kitchen
//   └── Furniture
//   └── Cookware

const rootCategories = [
  { slug: 'electronics', name: 'Electronics' },
  { slug: 'clothing', name: 'Clothing' },
  { slug: 'home-kitchen', name: 'Home & Kitchen' },
];

const childCategories = [
  { slug: 'mobile-phones', name: 'Mobile Phones', parentSlug: 'electronics' },
  { slug: 'laptops', name: 'Laptops', parentSlug: 'electronics' },
  { slug: 'men', name: 'Men', parentSlug: 'clothing' },
  { slug: 'women', name: 'Women', parentSlug: 'clothing' },
  { slug: 'furniture', name: 'Furniture', parentSlug: 'home-kitchen' },
  { slug: 'cookware', name: 'Cookware', parentSlug: 'home-kitchen' },
];

async function seed() {
  console.log('Seeding categories...');

  const slugToId = {};

  for (const cat of rootCategories) {
    const result = await client.query(
      `INSERT INTO categories (name, slug, parent_id)
       VALUES ($1, $2, NULL)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [cat.name, cat.slug]
    );
    slugToId[cat.slug] = result.rows[0].id;
  }

  for (const cat of childCategories) {
    const parentId = slugToId[cat.parentSlug];
    if (!parentId) {
      throw new Error(`Parent category not found for slug: ${cat.parentSlug}`);
    }
    const result = await client.query(
      `INSERT INTO categories (name, slug, parent_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, parent_id = EXCLUDED.parent_id
       RETURNING id`,
      [cat.name, cat.slug, parentId]
    );
    slugToId[cat.slug] = result.rows[0].id;
  }

  console.log('Categories seeded.');
}

seed()
  .then(() => client.end())
  .catch((err) => {
    console.error('Error seeding categories:', err);
    client.end();
    process.exit(1);
  });
