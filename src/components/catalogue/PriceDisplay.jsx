import React from 'react';

function formatPrice(amount) {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function discountPercent(original, current) {
  if (!original || !current || original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}

export default function PriceDisplay({
  price,
  originalPrice,
  taxInclusive = true,
  size = 'md',
}) {
  const priceClass =
    size === 'lg'
      ? 'text-2xl font-bold text-gray-900'
      : size === 'sm'
      ? 'text-sm font-semibold text-gray-900'
      : 'text-base font-semibold text-gray-900';

  const originalClass =
    size === 'lg'
      ? 'text-base text-gray-400 line-through'
      : 'text-sm text-gray-400 line-through';

  const discount = discountPercent(originalPrice, price);

  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
      <span className={priceClass}>{formatPrice(price)}</span>
      {originalPrice != null && originalPrice > price && (
        <span className={originalClass}>{formatPrice(originalPrice)}</span>
      )}
      {discount != null && (
        <span className="text-xs font-semibold text-green-600">{discount}% off</span>
      )}
      {taxInclusive && (
        <span className="text-xs text-gray-400">(incl. tax)</span>
      )}
    </div>
  );
}
