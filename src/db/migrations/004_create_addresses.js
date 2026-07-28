/**
 * Migration: create addresses table
 */
export const up = async (knex) => {
  await knex.schema.createTable('addresses', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('full_name', 255).notNullable();
    table.string('phone', 20).notNullable();
    table.string('line1', 255).notNullable();
    table.string('line2', 255).nullable();
    table.string('city', 128).notNullable();
    table.string('state', 128).notNullable();
    table.string('pin_code', 10).notNullable();
    table.string('country', 64).notNullable().defaultTo('India');
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('addresses');
};
