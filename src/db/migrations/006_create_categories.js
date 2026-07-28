/**
 * Migration: create categories table with self-referencing parent_id
 */
export const up = async (knex) => {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 128).notNullable();
    table.string('slug', 160).notNullable().unique();
    table.text('description').nullable();
    table.string('image_url', 512).nullable();
    table
      .integer('parent_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('categories');
};
