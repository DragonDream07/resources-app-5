import {
  fetchMe,
  updateProfile,
  changeUserPassword,
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from './users.service.js';

export async function getMe(req, res, next) {
  try {
    const user = await fetchMe(req.user.id);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    await changeUserPassword(req.user.id, req.body);
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const result = await fetchAllUsers({ page: Number(page), limit: Number(limit), role, search });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await fetchUserById(req.params.userId);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await updateUserById(req.params.userId, req.body);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await deleteUserById(req.params.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
