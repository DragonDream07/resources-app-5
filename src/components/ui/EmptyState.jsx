import React from 'react';
import emptyStateImage from '@/assets/images/empty-state.svg';

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
  image,
  className = '',
}) {
  const imgSrc = image !== undefined ? image : emptyStateImage;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="h-32 w-auto opacity-80"
        />
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="max-w-xs text-sm text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-2">{action}</div>
      )}
    </div>
  );
}
