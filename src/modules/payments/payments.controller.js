import {
  initiatePaymentService,
  confirmPaymentService,
  handleWebhookService,
  getPaymentService,
  retryPaymentService,
} from './payments.service.js';

export async function initiatePayment(req, res, next) {
  try {
    const result = await initiatePaymentService(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function confirmPayment(req, res, next) {
  try {
    const result = await confirmPaymentService(req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const result = await handleWebhookService(req.body, req.headers);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await getPaymentService(paymentId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function retryPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await retryPaymentService(paymentId, req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
