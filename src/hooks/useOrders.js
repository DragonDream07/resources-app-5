import { useState, useEffect, useCallback } from 'react';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  return response.json();
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const data = await apiFetch(`/orders${query ? `?${query}` : ''}`);
      setOrders(data.orders ?? data.data ?? data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, fetchOrders };
}

export function useOrderDetail(orderId) {
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const [orderData, timelineData] = await Promise.all([
        apiFetch(`/orders/${orderId}`),
        apiFetch(`/orders/${orderId}/timeline`),
      ]);
      setOrder(orderData.order ?? orderData);
      setTimeline(timelineData.timeline ?? timelineData.data ?? timelineData ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;
    try {
      const data = await apiFetch(`/orders/${orderId}/tracking`);
      setTracking(data.tracking ?? data);
    } catch (err) {
      setError(err.message);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, timeline, tracking, loading, error, fetchOrder, fetchTracking };
}
