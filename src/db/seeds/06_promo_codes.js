import { client } from '../client.js';

// Sample promo codes for development/testing
// discount_type: 'percentage' | 'flat'

const promoCodes = [
  {
    code: 'WELCOME10',
    description: '10% off on your first order',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_value: 500,
    max_discount_amount: 200,
    usage_limit: 1000,
    usage_count: 0,
    is_active: true,
    expires_at: '2099-12-31T23:59:59Z',
  },
  {
    code: 'FLAT200',
    description: 'Flat Rs. 200 off on orders above Rs. 1000',
    discount_type: 'flat',
    discount_value: 200,
    min_order_value: 1000,
    max_discount_amount: 200,
    usage_limit: 500,
    usage_count: 0,
    is_active: true,
    expires_at: '2099-12-31T23:59:59Z',
  },
  {
    code: 'SAVE15',
    description: '15% off on orders above Rs. 2000',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_value: 2000,
    max_discount_amount: 500,
    usage_limit: 300,
    usage_count: 0,
    is_active: true,
    expires_at: '2099-12-31T23:59:59Z',
  },
  {
    code: 'TECH500',
    description: 'Flat Rs. 500 off on electronics above Rs. 5000',
    discount_type: 'flat',
    discount_value: 500,
    min_order_value: 5000,
    max_discount_amount: 500,
    usage_limit: 200,
    usage_count: 0,
    is_active: true,
    expires_at: '2099-12-31T23:59:59Z',
  },
  {
    code: 'EXPIRED50',
    description: 'Expired promo code for testing',
    discount_type: 'flat',
    discount_value: 50,
    min_order_value: 0,
    max_discount_amount: 50,
    usage_limit: 100,
    usage_count: 0,
    is_active: false,
    expires_at: '2020-01-01T00:00:00Z',
  },
];

async function seed() {
  console.log('Seeding promo codes...');

  for (const promo of promoCodes) {
    await client.query(
      `INSERT INTO promo_codes
         (code, description, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, usage_count, is_active, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (code) DO UPDATE
         SET description = EXCLUDED.description,
             discount_type = EXCLUDED.discount_type,
             discount_value = EXCLUDED.discount_value,
             min_order_value = EXCLUDED.min_order_value,
             max_discount_amount = EXCLUDED.max_discount_amount,
             usage_limit = EXCLUDED.usage_limit,
             is_active = EXCLUDED.is_active,
             expires_at = EXCLUDED.expires_at`,
      [
        promo.code,
        promo.description,
        promo.discount_type,
        promo.discount_value,
        promo.min_order_value,
        promo.max_discount_amount,
        promo.usage_limit,
        promo.usage_count,
        promo.is_active,
        promo.expires_at,
      ]
    );
  }

  console.log('Promo codes seeded.');
}

seed()
  .then(() => client.end())
  .catch((err) => {
    console.error('Error seeding promo codes:', err);
    client.end();
    process.exit(1);
  });
