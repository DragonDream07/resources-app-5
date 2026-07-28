import { useState, useCallback } from 'react';

export const CHECKOUT_STEPS = {
  ADDRESS: 'address',
  PAYMENT: 'payment',
  REVIEW: 'review',
};

const STEP_ORDER = [
  CHECKOUT_STEPS.ADDRESS,
  CHECKOUT_STEPS.PAYMENT,
  CHECKOUT_STEPS.REVIEW,
];

const initialState = {
  step: CHECKOUT_STEPS.ADDRESS,
  address: null,
  payment: null,
  review: null,
  placedOrder: null,
  error: null,
  loading: false,
};

export function useCheckout() {
  const [state, setState] = useState(initialState);

  const setStep = useCallback((step) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.step);
      if (currentIndex < STEP_ORDER.length - 1) {
        return { ...prev, step: STEP_ORDER[currentIndex + 1] };
      }
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.step);
      if (currentIndex > 0) {
        return { ...prev, step: STEP_ORDER[currentIndex - 1] };
      }
      return prev;
    });
  }, []);

  const setAddress = useCallback((address) => {
    setState((prev) => ({ ...prev, address }));
  }, []);

  const setPayment = useCallback((payment) => {
    setState((prev) => ({ ...prev, payment }));
  }, []);

  const setReview = useCallback((review) => {
    setState((prev) => ({ ...prev, review }));
  }, []);

  const setLoading = useCallback((loading) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setPlacedOrder = useCallback((placedOrder) => {
    setState((prev) => ({ ...prev, placedOrder }));
  }, []);

  const resetCheckout = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    step: state.step,
    address: state.address,
    payment: state.payment,
    review: state.review,
    placedOrder: state.placedOrder,
    loading: state.loading,
    error: state.error,
    setStep,
    nextStep,
    prevStep,
    setAddress,
    setPayment,
    setReview,
    setLoading,
    setError,
    setPlacedOrder,
    resetCheckout,
    steps: STEP_ORDER,
  };
}
