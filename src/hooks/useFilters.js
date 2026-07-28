import { useState, useCallback, useMemo } from 'react';

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const existing = Array.isArray(prev[key]) ? prev[key] : [];
      const idx = existing.indexOf(value);
      const next =
        idx === -1
          ? [...existing, value]
          : existing.filter((v) => v !== value);
      if (next.length === 0) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: next };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value !== undefined && value !== null && value !== '') {
        params.set(key, value);
      }
    });
    return params;
  }, [filters]);

  return {
    filters,
    setFilter,
    removeFilter,
    toggleArrayFilter,
    resetFilters,
    queryParams,
  };
}
