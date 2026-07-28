import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';

const initialState = {
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = {};

  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function ResetPasswordForm({ onSubmit, isLoading, serverError, successMessage }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

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
      onSubmit({ token, password: fields.password });
    }
  }

  if (!token) {
    return (
      <p className="form-error-banner" role="alert">
        Invalid or missing reset token. Please request a new password reset link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Reset password form">
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
        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={errors.password && touched.password ? 'reset-password-error' : undefined}
          aria-invalid={!!(errors.password && touched.password)}
          disabled={isLoading}
        />
        {errors.password && touched.password && (
          <span id="reset-password-error" role="alert" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="reset-confirmPassword">Confirm new password</label>
        <input
          id="reset-confirmPassword"
          type="password"
          name="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={
            errors.confirmPassword && touched.confirmPassword
              ? 'reset-confirmPassword-error'
              : undefined
          }
          aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
          disabled={isLoading}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <span id="reset-confirmPassword-error" role="alert" className="field-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary btn-full">
        {isLoading ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  serverError: PropTypes.string,
  successMessage: PropTypes.string,
};

ResetPasswordForm.defaultProps = {
  isLoading: false,
  serverError: null,
  successMessage: null,
};
