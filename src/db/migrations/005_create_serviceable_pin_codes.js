/**
 * Migration: create serviceable_pin_codes lookup table
 */
export const up = async (knex) => {
  await knex.schema.createTable('serviceable_pin_codes', (table) => {
    table.increments('id').primary();
    table.string('pin_code', 10).notNullable().unique();
    table.string('city', 128).nullable();
    table.string('state', 128).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('estimated_delivery_days').unsigned().nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('serviceable_pin_codes');
};
