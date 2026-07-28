/**
 * Migration: create users table
 */
export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name', 128).notNullable();
    table.string('last_name', 128).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 20).nullable();
    table.string('password_hash', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('is_guest').notNullable().defaultTo(false);
    table.timestamp('email_verified_at').nullable();
    table.string('password_reset_token', 255).nullable();
    table.timestamp('password_reset_expires_at').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('users');
};
