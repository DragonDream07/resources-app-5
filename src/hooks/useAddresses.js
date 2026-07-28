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

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/users/me/addresses');
      setAddresses(data.addresses ?? data.data ?? data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/users/me/addresses', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const newAddress = data.address ?? data;
      setAddresses((prev) => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/users/me/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const updatedAddress = data.address ?? data;
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? updatedAddress : a))
      );
      return updatedAddress;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/users/me/addresses/${addressId}`, {
        method: 'DELETE',
      });
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/users/me/addresses/${addressId}`);
      return data.address ?? data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddress,
  };
}
