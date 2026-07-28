import React, { useId } from 'react';

export default function Checkbox({
  label,
  error,
  id: propId,
  className = '',
  disabled = false,
  ...rest
}) {
  const generatedId = useId();
  const id = propId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            'h-4 w-4 rounded border-gray-300 text-blue-600',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {label && (
          <label
            htmlFor={id}
            className={[
              'select-none text-sm text-gray-700',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
