/**
 * Migration: create promo_codes table with rules JSON column
 */
export const up = async (knex) => {
  await knex.schema.createTable('promo_codes', (table) => {
    table.increments('id').primary();
    table.string('code', 64).notNullable().unique();
    table.string('discount_type', 32).notNullable();
    table.decimal('discount_value', 12, 2).notNullable();
    table.decimal('min_order_value', 12, 2).nullable();
    table.decimal('max_discount_amount', 12, 2).nullable();
    table.integer('usage_limit').unsigned().nullable();
    table.integer('usage_count').unsigned().notNullable().defaultTo(0);
    table.integer('per_user_limit').unsigned().nullable();
    table.timestamp('valid_from').nullable();
    table.timestamp('valid_until').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.jsonb('rules').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('promo_codes');
};
