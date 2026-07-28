import React, { useId } from 'react';

export default function Input({
  label,
  error,
  helpText,
  id: propId,
  className = '',
  required = false,
  ...rest
}) {
  const generatedId = useId();
  const id = propId ?? generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const describedBy = [
    error ? errorId : null,
    helpText ? helpId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-required={required || undefined}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
          error
            ? 'border-red-500 focus-visible:ring-red-400'
            : 'border-gray-300 focus-visible:ring-blue-500',
          'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
        ].join(' ')}
        {...rest}
      />
      {helpText && !error && (
        <p id={helpId} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
