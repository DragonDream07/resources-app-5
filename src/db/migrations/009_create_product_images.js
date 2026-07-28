/**
 * Migration: create product_images table
 */
export const up = async (knex) => {
  await knex.schema.createTable('product_images', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('url', 512).notNullable();
    table.string('alt_text', 255).nullable();
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('product_images');
};
