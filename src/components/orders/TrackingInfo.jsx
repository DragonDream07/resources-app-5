import React from 'react';
import PropTypes from 'prop-types';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';

function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
        Tracking information is not available yet.
      </div>
    );
  }

  const {
    carrier,
    trackingNumber,
    estimatedDelivery,
    currentLocation,
    events,
  } = tracking;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100">
        <img src={packageIcon} alt="" className="w-5 h-5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {carrier ? `Carrier: ${carrier}` : 'Shipment Tracking'}
          </p>
          {trackingNumber && (
            <p className="text-xs text-gray-500 font-mono">
              Tracking #: {trackingNumber}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        {estimatedDelivery && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">Estimated Delivery:</span>
            <span>
              {new Date(estimatedDelivery).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              })}
            </span>
          </div>
        )}

        {currentLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <img src={mapPinIcon} alt="" className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">Current Location:</span>
            <span>{currentLocation}</span>
          </div>
        )}
      </div>

      {events && events.length > 0 && (
        <div className="px-4 pb-4">
          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">
            Tracking History
          </h4>
          <ol className="relative border-l border-gray-200 space-y-3 ml-2">
            {events.map((event, idx) => (
              <li key={idx} className="ml-4">
                <div
                  className="absolute w-2.5 h-2.5 bg-blue-400 rounded-full -left-1.5 border border-white"
                  aria-hidden="true"
                />
                <p className="text-xs text-gray-400">
                  {event.timestamp
                    ? new Date(event.timestamp).toLocaleString('en-IN')
                    : ''}
                </p>
                <p className="text-sm font-medium text-gray-800">{event.status}</p>
                {event.location && (
                  <p className="text-xs text-gray-500">{event.location}</p>
                )}
                {event.description && (
                  <p className="text-xs text-gray-500">{event.description}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

TrackingInfo.propTypes = {
  tracking: PropTypes.shape({
    carrier: PropTypes.string,
    trackingNumber: PropTypes.string,
    estimatedDelivery: PropTypes.string,
    currentLocation: PropTypes.string,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string,
        status: PropTypes.string,
        location: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }),
};

TrackingInfo.defaultProps = {
  tracking: null,
};

export default TrackingInfo;
