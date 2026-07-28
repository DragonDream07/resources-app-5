import React from 'react';

export function SkeletonBox({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div aria-hidden="true" className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={[
            'h-3 animate-pulse rounded bg-gray-200',
            i === lines - 1 ? 'w-3/4' : 'w-full',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 40, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-full bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      aria-label="Loading content"
      className={`flex flex-col gap-3 rounded-lg border border-gray-100 p-4 ${className}`}
    >
      <SkeletonBox className="h-40 w-full" />
      <SkeletonText lines={2} />
      <SkeletonBox className="h-4 w-1/3" />
    </div>
  );
}

// Default export is a generic rectangular skeleton
export default function Skeleton({ width, height, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
      }}
    />
  );
}
