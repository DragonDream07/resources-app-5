/**
 * Migration: create return_requests table
 */
export const up = async (knex) => {
  await knex.schema.createTable('return_requests', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('status', 32).notNullable().defaultTo('requested');
    table.text('reason').notNullable();
    table.text('customer_notes').nullable();
    table.text('admin_notes').nullable();
    table
      .integer('reviewed_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('reviewed_at').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('return_requests');
};
