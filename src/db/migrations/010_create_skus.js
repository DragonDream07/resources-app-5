/**
 * Migration: create skus table
 */
export const up = async (knex) => {
  await knex.schema.createTable('skus', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('sku_code', 128).notNullable().unique();
    table.string('size', 32).nullable();
    table.string('colour', 64).nullable();
    table.integer('stock').unsigned().notNullable().defaultTo(0);
    table.integer('reserved_stock').unsigned().notNullable().defaultTo(0);
    table.decimal('price_override', 12, 2).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('skus');
};
