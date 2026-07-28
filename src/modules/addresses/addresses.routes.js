import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import {
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from './addresses.controller.js';
import { validateCreateAddress, validateUpdateAddress } from './addresses.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', listAddresses);
router.get('/:addressId', getAddress);
router.post('/', validateCreateAddress, createAddress);
router.put('/:addressId', validateUpdateAddress, updateAddress);
router.delete('/:addressId', deleteAddress);

export default router;
