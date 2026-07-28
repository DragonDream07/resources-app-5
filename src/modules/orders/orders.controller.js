import {
  fetchOrders,
  fetchOrderById,
  fetchOrderTimeline,
  fetchOrderTracking,
  fetchOrderRefunds,
  cancelOrderById,
  advanceOrderById,
  createReturnRequestForOrder,
} from './orders.service.js';

export async function listOrders(req, res, next) {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const { page = 1, limit = 20, status } = req.query;

    const filters = {};
    if (!isAdmin) {
      filters.userId = userId;
    }
    if (status) {
      filters.status = status;
    }

    const result = await fetchOrders({ filters, page: Number(page), limit: Number(limit) });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const order = await fetchOrderById({ orderId, userId: isAdmin ? null : userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrderTimeline(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const timeline = await fetchOrderTimeline({ orderId, userId: isAdmin ? null : userId });
    if (!timeline) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
}

export async function getOrderTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const tracking = await fetchOrderTracking({ orderId, userId: isAdmin ? null : userId });
    if (!tracking) {
      return res.status(404).json({ message: 'Order or tracking info not found.' });
    }
    return res.status(200).json(tracking);
  } catch (err) {
    next(err);
  }
}

export async function getOrderRefunds(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const refunds = await fetchOrderRefunds({ orderId, userId: isAdmin ? null : userId });
    if (!refunds) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(refunds);
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const { reason } = req.body;

    const result = await cancelOrderById({ orderId, userId: isAdmin ? null : userId, reason, isAdmin });
    if (!result) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function advanceOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const result = await advanceOrderById({ orderId, status });
    if (!result) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const { items, reason } = req.body;

    const result = await createReturnRequestForOrder({ orderId, userId, items, reason });
    if (!result) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
