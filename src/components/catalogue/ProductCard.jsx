import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '@/assets/icons/star.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import PriceDisplay from './PriceDisplay';

function RatingBadge({ rating, reviewCount }) {
  if (rating == null) return null;
  return (
    <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
      <img src={starIcon} alt="" className="w-3 h-3 brightness-0 invert" />
      {Number(rating).toFixed(1)}
      {reviewCount != null && (
        <span className="text-green-100 font-normal">({reviewCount})</span>
      )}
    </span>
  );
}

export default function ProductCard({ product }) {
  const {
    id,
    name,
    slug,
    price,
    originalPrice,
    taxInclusive,
    rating,
    reviewCount,
    images,
  } = product || {};

  const imageSrc =
    images && images.length > 0 ? images[0].url : placeholderProduct;
  const to = `/products/${slug || id}`;

  return (
    <Link
      to={to}
      className="group block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
      aria-label={name}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {rating != null && (
          <div className="absolute bottom-2 left-2">
            <RatingBadge rating={rating} reviewCount={reviewCount} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2 min-h-[2.5rem]">
          {name}
        </p>
        <PriceDisplay
          price={price}
          originalPrice={originalPrice}
          taxInclusive={taxInclusive}
        />
      </div>
    </Link>
  );
}
