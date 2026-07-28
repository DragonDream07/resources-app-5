/**
 * Migration: create orders table
 */
export const up = async (knex) => {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.string('order_number', 64).notNullable().unique();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('address_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('addresses')
      .onDelete('RESTRICT');
    table.string('status', 64).notNullable().defaultTo('pending');
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('discount_amount', 12, 2).notNullable().defaultTo(0);
    table.decimal('shipping_amount', 12, 2).notNullable().defaultTo(0);
    table.decimal('tax_amount', 12, 2).notNullable().defaultTo(0);
    table.decimal('total_amount', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table
      .integer('promo_code_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('promo_codes')
      .onDelete('SET NULL');
    table.string('payment_status', 64).notNullable().defaultTo('unpaid');
    table.text('notes').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('orders');
};
