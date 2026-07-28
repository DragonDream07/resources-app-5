/**
 * Migration: create products table
 */
export const up = async (knex) => {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('slug', 300).notNullable().unique();
    table.text('description').nullable();
    table
      .integer('category_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table
      .integer('brand_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('brands')
      .onDelete('SET NULL');
    table.decimal('base_price', 12, 2).notNullable();
    table.decimal('selling_price', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('is_featured').notNullable().defaultTo(false);
    table.jsonb('tags').nullable();
    table.jsonb('attributes').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('products');
};
