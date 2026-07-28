import React from 'react';
import checkIcon from '@/assets/icons/check.svg';

const COLOUR_SWATCHES = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Black: '#111827',
  White: '#f9fafb',
  Yellow: '#eab308',
  Pink: '#ec4899',
  Purple: '#8b5cf6',
  Grey: '#6b7280',
  Gray: '#6b7280',
  Brown: '#92400e',
  Orange: '#f97316',
  Navy: '#1e3a5f',
};

function SizeOption({ value, selected, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative px-3 py-1.5 text-sm font-medium rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled
          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 line-through'
          : selected
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-300 text-gray-700 hover:border-blue-400 bg-white'
      }`}
    >
      {value}
    </button>
  );
}

function ColourOption({ value, selected, disabled, onClick }) {
  const swatch = COLOUR_SWATCHES[value] || '#d1d5db';
  const needsBorder = value === 'White' || value === 'white';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={value}
      title={value}
      className={`relative w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        selected ? 'border-blue-600 scale-110' : needsBorder ? 'border-gray-300' : 'border-transparent'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
      style={{ backgroundColor: swatch }}
    >
      {selected && (
        <img
          src={checkIcon}
          alt="selected"
          className="absolute inset-0 m-auto w-4 h-4 brightness-0 invert"
        />
      )}
    </button>
  );
}

export default function VariantPicker({
  attributes = [],
  skus = [],
  selectedAttributes = {},
  onAttributeChange,
}) {
  function isOptionAvailable(attrName, attrValue) {
    const tentative = { ...selectedAttributes, [attrName]: attrValue };
    return skus.some((sku) => {
      if (!sku.attributes) return false;
      return Object.entries(tentative).every(
        ([k, v]) => sku.attributes[k] === v
      ) && (sku.stock == null || sku.stock > 0);
    });
  }

  function handleSelect(attrName, attrValue) {
    if (!onAttributeChange) return;
    const next = { ...selectedAttributes, [attrName]: attrValue };
    onAttributeChange(next);
  }

  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="space-y-4">
      {attributes.map((attr) => {
        const isColour =
          attr.name.toLowerCase() === 'colour' ||
          attr.name.toLowerCase() === 'color';
        return (
          <div key={attr.name}>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {attr.name}:
              {selectedAttributes[attr.name] && (
                <span className="font-normal text-gray-500 ml-1">
                  {selectedAttributes[attr.name]}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {attr.values.map((val) => {
                const available = isOptionAvailable(attr.name, val);
                const selected = selectedAttributes[attr.name] === val;
                if (isColour) {
                  return (
                    <ColourOption
                      key={val}
                      value={val}
                      selected={selected}
                      disabled={!available}
                      onClick={() => !selected && handleSelect(attr.name, val)}
                    />
                  );
                }
                return (
                  <SizeOption
                    key={val}
                    value={val}
                    selected={selected}
                    disabled={!available}
                    onClick={() => !selected && handleSelect(attr.name, val)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
