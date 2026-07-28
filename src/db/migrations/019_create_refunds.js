/**
 * Migration: create refunds table
 */
export const up = async (knex) => {
  await knex.schema.createTable('refunds', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .integer('payment_attempt_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('payment_attempts')
      .onDelete('RESTRICT');
    table.decimal('amount', 12, 2).notNullable();
    table.string('status', 32).notNullable().defaultTo('pending');
    table.string('provider_refund_id', 255).nullable();
    table.text('reason').nullable();
    table.jsonb('raw_response').nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('refunds');
};
