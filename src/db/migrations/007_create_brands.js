/**
 * Migration: create brands table
 */
export const up = async (knex) => {
  await knex.schema.createTable('brands', (table) => {
    table.increments('id').primary();
    table.string('name', 128).notNullable().unique();
    table.string('slug', 160).notNullable().unique();
    table.text('description').nullable();
    table.string('logo_url', 512).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('brands');
};
