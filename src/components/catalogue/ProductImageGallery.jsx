import React, { useState } from 'react';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

export default function ProductImageGallery({ images = [], productName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages =
    images && images.length > 0
      ? images
      : [{ url: placeholderProduct, altText: productName }];

  const current = safeImages[activeIndex];

  function handlePrev() {
    setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  }

  function handleNext() {
    setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Product image gallery"
      >
        <img
          src={current.url || placeholderProduct}
          alt={current.altText || productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow transition"
              aria-label="Previous image"
            >
              <img src={chevronLeftIcon} alt="" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow transition"
              aria-label="Next image"
            >
              <img src={chevronRightIcon} alt="" className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {safeImages.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all ${
                    i === activeIndex
                      ? 'bg-blue-600 w-4 h-1.5'
                      : 'bg-gray-300 w-1.5 h-1.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                i === activeIndex
                  ? 'border-blue-600'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <img
                src={img.url || placeholderProduct}
                alt={img.altText || productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = placeholderProduct;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
