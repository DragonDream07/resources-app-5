import { client } from '../client.js';

const brands = [
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'IKEA', slug: 'ikea' },
  { name: 'Prestige', slug: 'prestige' },
];

async function seed() {
  console.log('Seeding brands...');

  for (const brand of brands) {
    await client.query(
      `INSERT INTO brands (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
      [brand.name, brand.slug]
    );
  }

  console.log('Brands seeded.');
}

seed()
  .then(() => client.end())
  .catch((err) => {
    console.error('Error seeding brands:', err);
    client.end();
    process.exit(1);
  });
