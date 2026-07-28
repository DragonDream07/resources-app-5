/**
 * Migration: create order_tracking table
 */
export const up = async (knex) => {
  await knex.schema.createTable('order_tracking', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('carrier', 128).nullable();
    table.string('tracking_number', 128).nullable();
    table.string('tracking_url', 512).nullable();
    table.string('current_status', 64).nullable();
    table.string('current_location', 255).nullable();
    table.timestamp('estimated_delivery_at').nullable();
    table.jsonb('events').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('order_tracking');
};
