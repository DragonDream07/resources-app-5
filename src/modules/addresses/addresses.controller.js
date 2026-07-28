import {
  getAddressesByUserId,
  getAddressByIdAndUserId,
  createAddressForUser,
  updateAddressForUser,
  deleteAddressForUser,
} from './addresses.service.js';

export async function listAddresses(req, res, next) {
  try {
    const userId = req.user.id;
    const addresses = await getAddressesByUserId(userId);
    return res.status(200).json({ data: addresses });
  } catch (err) {
    next(err);
  }
}

export async function getAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const address = await getAddressByIdAndUserId(addressId, userId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    return res.status(200).json({ data: address });
  } catch (err) {
    next(err);
  }
}

export async function createAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const payload = req.body;
    const address = await createAddressForUser(userId, payload);
    return res.status(201).json({ data: address });
  } catch (err) {
    next(err);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const payload = req.body;
    const address = await updateAddressForUser(addressId, userId, payload);
    if (!address) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    return res.status(200).json({ data: address });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const deleted = await deleteAddressForUser(addressId, userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    return res.status(200).json({ message: 'Address deleted successfully.' });
  } catch (err) {
    next(err);
  }
}
