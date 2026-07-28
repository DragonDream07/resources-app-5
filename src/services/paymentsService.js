import api from './api.js';

export const initiatePayment = (payload) =>
  api.post('/payments/initiate', payload).then((res) => res.data);

/**
 * confirmPayment is intentionally omitted from the named endpoints list;
 * a local mock-adapter outcome surface is provided below.
 * Callers may use initiatePayment and handle the mock adapter's synchronous
 * outcome (success / failure / pending) that is returned in the response body.
 */
export const confirmPayment = (payload) =>
  api.post('/payments/confirm', payload).then((res) => res.data);

/**
 * Surfaces mock adapter outcomes for development / testing.
 * Pass outcome as one of: 'success' | 'failure' | 'pending'
 */
export const mockOutcome = (payload) => {
  const { outcome = 'success', ...rest } = payload;
  return initiatePayment({ ...rest, mockOutcome: outcome });
};

export default {
  initiatePayment,
  confirmPayment,
  mockOutcome,
};
