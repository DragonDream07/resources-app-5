/**
 * Migration: create carts table (nullable user_id for guest, session_id)
 */
export const up = async (knex) => {
  await knex.schema.createTable('carts', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.string('session_id', 255).nullable();
    table
      .integer('promo_code_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('promo_codes')
      .onDelete('SET NULL');
    table.decimal('discount_amount', 12, 2).notNullable().defaultTo(0);
    table.timestamp('expires_at').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('carts');
};
