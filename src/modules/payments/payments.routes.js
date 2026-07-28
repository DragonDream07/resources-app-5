import { Router } from 'express';
import {
  initiatePayment,
  confirmPayment,
  handleWebhook,
  getPayment,
  retryPayment,
} from './payments.controller.js';
import {
  validateInitiatePayment,
  validateConfirmPayment,
  validateWebhook,
} from './payments.validator.js';

const router = Router();

router.post('/initiate', validateInitiatePayment, initiatePayment);
router.post('/confirm', validateConfirmPayment, confirmPayment);
router.post('/webhook', validateWebhook, handleWebhook);
router.get('/:paymentId', getPayment);
router.post('/:paymentId/retry', retryPayment);

export default router;
