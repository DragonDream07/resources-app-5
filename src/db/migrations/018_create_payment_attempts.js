/**
 * Migration: create payment_attempts table
 */
export const up = async (knex) => {
  await knex.schema.createTable('payment_attempts', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('payment_provider', 64).notNullable();
    table.string('provider_order_id', 255).nullable();
    table.string('provider_payment_id', 255).nullable();
    table.string('provider_signature', 512).nullable();
    table.string('status', 32).notNullable().defaultTo('initiated');
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency', 8).notNullable().defaultTo('INR');
    table.jsonb('raw_response').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('payment_attempts');
};
