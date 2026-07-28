import { useState } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  email: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  return errors;
}

export default function ForgotPasswordForm({ onSubmit, isLoading, serverError, successMessage }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate(updated) }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate(fields) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.keys(initialState).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(fields);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Forgot password form">
      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div role="status" className="form-success-banner">
          {successMessage}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="forgot-email">Email address</label>
        <input
          id="forgot-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-describedby={errors.email && touched.email ? 'forgot-email-error' : undefined}
          aria-invalid={!!(errors.email && touched.email)}
          disabled={isLoading}
        />
        {errors.email && touched.email && (
          <span id="forgot-email-error" role="alert" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary btn-full">
        {isLoading ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  serverError: PropTypes.string,
  successMessage: PropTypes.string,
};

ForgotPasswordForm.defaultProps = {
  isLoading: false,
  serverError: null,
  successMessage: null,
};
