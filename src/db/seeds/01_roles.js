import { client } from '../client.js';

const roles = [
  { name: 'customer' },
  { name: 'staff' },
  { name: 'admin' },
];

async function seed() {
  console.log('Seeding roles...');
  for (const role of roles) {
    await client.query(
      `INSERT INTO roles (name)
       VALUES ($1)
       ON CONFLICT (name) DO NOTHING`,
      [role.name]
    );
  }
  console.log('Roles seeded.');
}

seed()
  .then(() => client.end())
  .catch((err) => {
    console.error('Error seeding roles:', err);
    client.end();
    process.exit(1);
  });
