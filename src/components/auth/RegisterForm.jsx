import { useState } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = {};

  if (!fields.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!fields.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

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

export default function RegisterForm({ onSubmit, isLoading, serverError }) {
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
      const { confirmPassword: _ignored, ...payload } = fields;
      onSubmit(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="register-firstName">First name</label>
        <input
          id="register-firstName"
          type="text"
          name="firstName"
          value={fields.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="given-name"
          aria-describedby={errors.firstName && touched.firstName ? 'register-firstName-error' : undefined}
          aria-invalid={!!(errors.firstName && touched.firstName)}
          disabled={isLoading}
        />
        {errors.firstName && touched.firstName && (
          <span id="register-firstName-error" role="alert" className="field-error">
            {errors.firstName}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-lastName">Last name</label>
        <input
          id="register-lastName"
          type="text"
          name="lastName"
          value={fields.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="family-name"
          aria-describedby={errors.lastName && touched.lastName ? 'register-lastName-error' : undefined}
          aria-invalid={!!(errors.lastName && touched.lastName)}
          disabled={isLoading}
        />
        {errors.lastName && touched.lastName && (
          <span id="register-lastName-error" role="alert" className="field-error">
            {errors.lastName}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-describedby={errors.email && touched.email ? 'register-email-error' : undefined}
          aria-invalid={!!(errors.email && touched.email)}
          disabled={isLoading}
        />
        {errors.email && touched.email && (
          <span id="register-email-error" role="alert" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={errors.password && touched.password ? 'register-password-error' : undefined}
          aria-invalid={!!(errors.password && touched.password)}
          disabled={isLoading}
        />
        {errors.password && touched.password && (
          <span id="register-password-error" role="alert" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirmPassword">Confirm password</label>
        <input
          id="register-confirmPassword"
          type="password"
          name="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={
            errors.confirmPassword && touched.confirmPassword
              ? 'register-confirmPassword-error'
              : undefined
          }
          aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
          disabled={isLoading}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <span id="register-confirmPassword-error" role="alert" className="field-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary btn-full">
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  serverError: PropTypes.string,
};

RegisterForm.defaultProps = {
  isLoading: false,
  serverError: null,
};
