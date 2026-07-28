import React from 'react';
import PropTypes from 'prop-types';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4 text-center">No items found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.orderItemId} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl || placeholderProduct}
                    alt={item.productName || 'Product'}
                    className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-800 leading-tight">
                      {item.productName}
                    </p>
                    {item.skuAttributes && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {Object.entries(item.skuAttributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}
                    {item.skuCode && (
                      <p className="text-xs text-gray-400 font-mono">SKU: {item.skuCode}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-gray-700">
                {item.quantity}
              </td>
              <td className="px-4 py-3 text-right text-gray-700">
                ₹{Number(item.unitPrice).toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                ₹{Number(item.unitPrice * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

OrderItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      orderItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      productName: PropTypes.string,
      imageUrl: PropTypes.string,
      skuCode: PropTypes.string,
      skuAttributes: PropTypes.object,
      quantity: PropTypes.number.isRequired,
      unitPrice: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default OrderItemsList;
