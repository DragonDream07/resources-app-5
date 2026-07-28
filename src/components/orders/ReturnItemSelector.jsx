import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function ReturnItemSelector({ items, onSelectionChange }) {
  const [selected, setSelected] = useState({});
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    items.forEach((item) => {
      init[item.orderItemId] = item.quantity;
    });
    return init;
  });
  const [reasons, setReasons] = useState({});

  const handleToggle = useCallback(
    (orderItemId) => {
      setSelected((prev) => {
        const next = { ...prev, [orderItemId]: !prev[orderItemId] };
        notifyParent(next, quantities, reasons, items, onSelectionChange);
        return next;
      });
    },
    [quantities, reasons, items, onSelectionChange]
  );

  const handleQuantityChange = useCallback(
    (orderItemId, maxQty, value) => {
      const numVal = Math.min(Math.max(1, Number(value)), maxQty);
      setQuantities((prev) => {
        const next = { ...prev, [orderItemId]: numVal };
        notifyParent(selected, next, reasons, items, onSelectionChange);
        return next;
      });
    },
    [selected, reasons, items, onSelectionChange]
  );

  const handleReasonChange = useCallback(
    (orderItemId, value) => {
      setReasons((prev) => {
        const next = { ...prev, [orderItemId]: value };
        notifyParent(selected, quantities, next, items, onSelectionChange);
        return next;
      });
    },
    [selected, quantities, items, onSelectionChange]
  );

  const hasAnySelected = Object.values(selected).some(Boolean);

  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4 text-center">
        No eligible items for return.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Select the items you wish to return and provide a reason.
      </p>

      {items.map((item) => {
        const isChecked = !!selected[item.orderItemId];
        return (
          <div
            key={item.orderItemId}
            className={`border rounded-lg p-4 transition-colors ${
              isChecked
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(item.orderItemId)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                aria-label={`Select ${item.productName} for return`}
              />
              <img
                src={item.imageUrl || placeholderProduct}
                alt={item.productName || 'Product'}
                className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {item.productName}
                </p>
                {item.skuAttributes && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {Object.entries(item.skuAttributes)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  Qty ordered: {item.quantity} &nbsp;|&nbsp; ₹{Number(item.unitPrice).toFixed(2)} each
                </p>
              </div>
            </label>

            {isChecked && (
              <div className="mt-3 ml-7 space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`qty-${item.orderItemId}`}
                    className="text-xs font-medium text-gray-600 w-28 flex-shrink-0"
                  >
                    Return Qty:
                  </label>
                  <input
                    id={`qty-${item.orderItemId}`}
                    type="number"
                    min={1}
                    max={item.quantity}
                    value={quantities[item.orderItemId] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.orderItemId,
                        item.quantity,
                        e.target.value
                      )
                    }
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <label
                    htmlFor={`reason-${item.orderItemId}`}
                    className="text-xs font-medium text-gray-600 w-28 flex-shrink-0 mt-1"
                  >
                    Reason:
                  </label>
                  <select
                    id={`reason-${item.orderItemId}`}
                    value={reasons[item.orderItemId] || ''}
                    onChange={(e) =>
                      handleReasonChange(item.orderItemId, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  >
                    <option value="" disabled>
                      Select a reason
                    </option>
                    <option value="DEFECTIVE">Defective / Damaged</option>
                    <option value="WRONG_ITEM">Wrong item delivered</option>
                    <option value="NOT_AS_DESCRIBED">Not as described</option>
                    <option value="CHANGE_OF_MIND">Change of mind</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!hasAnySelected && (
        <p className="text-xs text-gray-400 text-center">
          Please select at least one item to continue.
        </p>
      )}
    </div>
  );
}

function notifyParent(selected, quantities, reasons, items, onSelectionChange) {
  if (!onSelectionChange) return;
  const result = items
    .filter((item) => !!selected[item.orderItemId])
    .map((item) => ({
      orderItemId: item.orderItemId,
      quantity: quantities[item.orderItemId] || item.quantity,
      reason: reasons[item.orderItemId] || '',
    }));
  onSelectionChange(result);
}

ReturnItemSelector.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      orderItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      productName: PropTypes.string,
      imageUrl: PropTypes.string,
      skuAttributes: PropTypes.object,
      quantity: PropTypes.number.isRequired,
      unitPrice: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectionChange: PropTypes.func,
};

ReturnItemSelector.defaultProps = {
  onSelectionChange: null,
};

export default ReturnItemSelector;
