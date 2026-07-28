import db from '../../db/index.js';
import { getActivePaymentAdapter } from './adapters/index.js';

/**
 * Persist a payment attempt record.
 */
async function createPaymentAttempt({ orderId, provider, amount, currency, status, providerRef, metadata }) {
  const [attempt] = await db('payment_attempts')
    .insert({
      order_id: orderId,
      provider,
      amount,
      currency,
      status,
      provider_ref: providerRef || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');
  return attempt;
}

/**
 * Update an existing payment attempt.
 */
async function updatePaymentAttempt(paymentId, updates) {
  const [attempt] = await db('payment_attempts')
    .where({ id: paymentId })
    .update({
      ...updates,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return attempt;
}

/**
 * Retrieve a payment attempt by ID.
 */
async function findPaymentAttemptById(paymentId) {
  const attempt = await db('payment_attempts').where({ id: paymentId }).first();
  return attempt || null;
}

/**
 * Initiate a payment — creates an attempt record and delegates to the active adapter.
 */
export async function initiatePaymentService({ orderId, amount, currency, provider, metadata }) {
  const adapter = getActivePaymentAdapter(provider);

  const attempt = await createPaymentAttempt({
    orderId,
    provider: adapter.name,
    amount,
    currency,
    status: 'pending',
    metadata,
  });

  let providerResponse;
  try {
    providerResponse = await adapter.initiatePayment({
      paymentId: attempt.id,
      orderId,
      amount,
      currency,
      metadata,
    });
  } catch (err) {
    await updatePaymentAttempt(attempt.id, { status: 'failed' });
    throw err;
  }

  const updated = await updatePaymentAttempt(attempt.id, {
    status: providerResponse.status || 'initiated',
    provider_ref: providerResponse.providerRef || null,
    metadata: JSON.stringify({ ...metadata, providerData: providerResponse }),
  });

  return {
    paymentId: updated.id,
    status: updated.status,
    redirectUrl: providerResponse.redirectUrl || null,
    providerRef: updated.provider_ref,
  };
}

/**
 * Confirm a payment — called after redirect / 3DS flow.
 */
export async function confirmPaymentService({ paymentId, providerRef, providerPayload }) {
  const attempt = await findPaymentAttemptById(paymentId);
  if (!attempt) {
    const error = new Error('Payment attempt not found');
    error.statusCode = 404;
    throw error;
  }

  const adapter = getActivePaymentAdapter(attempt.provider);

  let confirmResponse;
  try {
    confirmResponse = await adapter.confirmPayment({ providerRef, providerPayload });
  } catch (err) {
    await updatePaymentAttempt(paymentId, { status: 'failed' });
    throw err;
  }

  const updated = await updatePaymentAttempt(paymentId, {
    status: confirmResponse.status || 'confirmed',
    provider_ref: providerRef || attempt.provider_ref,
  });

  return {
    paymentId: updated.id,
    status: updated.status,
    providerRef: updated.provider_ref,
  };
}

/**
 * Handle incoming webhook from payment provider.
 */
export async function handleWebhookService(payload, headers) {
  const provider = payload.provider || headers['x-payment-provider'];
  const adapter = getActivePaymentAdapter(provider);

  const event = await adapter.parseWebhook(payload, headers);

  if (event.paymentId) {
    await updatePaymentAttempt(event.paymentId, {
      status: event.status,
      provider_ref: event.providerRef || undefined,
      metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
    });
  }

  return { received: true, event };
}

/**
 * Get a payment attempt by ID.
 */
export async function getPaymentService(paymentId) {
  const attempt = await findPaymentAttemptById(paymentId);
  if (!attempt) {
    const error = new Error('Payment attempt not found');
    error.statusCode = 404;
    throw error;
  }
  return attempt;
}

/**
 * Retry a failed payment — creates a new attempt for the same order.
 */
export async function retryPaymentService(paymentId, { metadata } = {}) {
  const original = await findPaymentAttemptById(paymentId);
  if (!original) {
    const error = new Error('Payment attempt not found');
    error.statusCode = 404;
    throw error;
  }

  if (original.status !== 'failed' && original.status !== 'cancelled') {
    const error = new Error('Only failed or cancelled payments can be retried');
    error.statusCode = 422;
    throw error;
  }

  return initiatePaymentService({
    orderId: original.order_id,
    amount: original.amount,
    currency: original.currency,
    provider: original.provider,
    metadata: metadata || (original.metadata ? JSON.parse(original.metadata) : undefined),
  });
}
