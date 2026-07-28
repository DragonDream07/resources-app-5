import bcrypt from 'bcrypt';
import { client } from '../client.js';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_FIRST_NAME = 'Super';
const ADMIN_LAST_NAME = 'Admin';
const SALT_ROUNDS = 10;

async function seed() {
  console.log('Seeding admin user...');

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  const userResult = await client.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, is_guest)
     VALUES ($1, $2, $3, $4, false)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash
     RETURNING id`,
    [ADMIN_EMAIL, passwordHash, ADMIN_FIRST_NAME, ADMIN_LAST_NAME]
  );

  const userId = userResult.rows[0].id;

  const roleResult = await client.query(
    `SELECT id FROM roles WHERE name = 'admin'`
  );

  if (roleResult.rows.length === 0) {
    throw new Error('Admin role not found. Run 01_roles.js seed first.');
  }

  const roleId = roleResult.rows[0].id;

  await client.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, roleId]
  );

  console.log(`Admin user seeded: ${ADMIN_EMAIL}`);
}

seed()
  .then(() => client.end())
  .catch((err) => {
    console.error('Error seeding admin user:', err);
    client.end();
    process.exit(1);
  });
