/**
 * Migration: create user_roles join table
 */
export const up = async (knex) => {
  await knex.schema.createTable('user_roles', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_id', 'role_id']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('user_roles');
};
