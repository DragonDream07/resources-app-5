import React, { useState } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import starIcon from '@/assets/icons/star.svg';

const RATING_OPTIONS = [4, 3, 2, 1];

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <img
          src={chevronDownIcon}
          alt=""
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function FilterPanel({
  brands = [],
  selectedBrands = [],
  onBrandChange,
  priceRange = { min: 0, max: 100000 },
  appliedPriceRange = { min: 0, max: 100000 },
  onPriceRangeChange,
  selectedRating = null,
  onRatingChange,
  facetCounts = {},
}) {
  const [localMin, setLocalMin] = useState(
    appliedPriceRange.min ?? priceRange.min
  );
  const [localMax, setLocalMax] = useState(
    appliedPriceRange.max ?? priceRange.max
  );

  function handleBrandToggle(brandId) {
    if (!onBrandChange) return;
    if (selectedBrands.includes(brandId)) {
      onBrandChange(selectedBrands.filter((b) => b !== brandId));
    } else {
      onBrandChange([...selectedBrands, brandId]);
    }
  }

  function handlePriceApply() {
    if (onPriceRangeChange) {
      onPriceRangeChange({ min: Number(localMin), max: Number(localMax) });
    }
  }

  function handleRatingSelect(rating) {
    if (!onRatingChange) return;
    onRatingChange(selectedRating === rating ? null : rating);
  }

  return (
    <aside className="w-full" aria-label="Filters">
      <h2 className="text-base font-bold text-gray-900 mb-2">Filters</h2>

      {brands.length > 0 && (
        <CollapsibleSection title="Brand">
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => {
              const count = facetCounts?.brands?.[brand.id];
              return (
                <li key={brand.id}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                    />
                    <span className="flex-1">{brand.name}</span>
                    {count != null && (
                      <span className="text-gray-400 text-xs">({count})</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Price Range">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                min={priceRange.min}
                max={localMax}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                min={localMin}
                max={priceRange.max}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handlePriceApply}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded transition-colors"
          >
            Apply
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Customer Rating">
        <ul className="space-y-2">
          {RATING_OPTIONS.map((rating) => {
            const count = facetCounts?.ratings?.[rating];
            return (
              <li key={rating}>
                <button
                  type="button"
                  onClick={() => handleRatingSelect(rating)}
                  className={`flex items-center gap-2 w-full text-sm px-2 py-1.5 rounded transition-colors ${
                    selectedRating === rating
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-pressed={selectedRating === rating}
                >
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: rating }).map((_, i) => (
                      <img
                        key={i}
                        src={starIcon}
                        alt=""
                        className="w-3.5 h-3.5"
                      />
                    ))}
                  </span>
                  <span>&amp; above</span>
                  {count != null && (
                    <span className="ml-auto text-gray-400 text-xs">({count})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </CollapsibleSection>
    </aside>
  );
}
