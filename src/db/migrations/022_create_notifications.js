/**
 * Migration: create notifications table (nullable user_id for broadcast)
 */
export const up = async (knex) => {
  await knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('type', 64).notNullable();
    table.string('title', 255).notNullable();
    table.text('body').nullable();
    table.jsonb('data').nullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('read_at').nullable();
    table.boolean('is_broadcast').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('notifications');
};
