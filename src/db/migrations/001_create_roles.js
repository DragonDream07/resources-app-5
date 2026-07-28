/**
 * Migration: create roles table
 */
export const up = async (knex) => {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name', 64).notNullable().unique();
    table.text('description').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('roles');
};
