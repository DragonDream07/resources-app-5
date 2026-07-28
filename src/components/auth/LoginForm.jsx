import { useState } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  email: '',
  password: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

export default function LoginForm({ onSubmit, isLoading, serverError }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...fields, [name]: value }) }));
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
    <form onSubmit={handleSubmit} noValidate aria-label="Login form">
      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-describedby={errors.email && touched.email ? 'login-email-error' : undefined}
          aria-invalid={!!(errors.email && touched.email)}
          disabled={isLoading}
        />
        {errors.email && touched.email && (
          <span id="login-email-error" role="alert" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="current-password"
          aria-describedby={errors.password && touched.password ? 'login-password-error' : undefined}
          aria-invalid={!!(errors.password && touched.password)}
          disabled={isLoading}
        />
        {errors.password && touched.password && (
          <span id="login-password-error" role="alert" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn btn-primary btn-full">
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  serverError: PropTypes.string,
};

LoginForm.defaultProps = {
  isLoading: false,
  serverError: null,
};
