/**
 * Migration: create stock_reservations table
 */
export const up = async (knex) => {
  await knex.schema.createTable('stock_reservations', (table) => {
    table.increments('id').primary();
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('CASCADE');
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.integer('quantity').unsigned().notNullable();
    table.string('status', 32).notNullable().defaultTo('reserved');
    table.timestamp('expires_at').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('stock_reservations');
};
