import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPasswordUser,
  resetPasswordUser,
  guestRegisterUser,
} from './auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;
    const result = await logoutUser(token);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await forgotPasswordUser(req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const result = await resetPasswordUser(req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function guestRegister(req, res, next) {
  try {
    const result = await guestRegisterUser(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
