import React from 'react';
import PropTypes from 'prop-types';

const STAGES = [
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const STAGE_ORDER = STAGES.map((s) => s.key);

function getStageIndex(status) {
  const idx = STAGE_ORDER.indexOf(status);
  return idx;
}

function StatusTimeline({ currentStatus }) {
  const currentIndex = getStageIndex(currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  return (
    <div className="w-full px-2 py-4">
      {isCancelled ? (
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            Order Cancelled
          </span>
        </div>
      ) : (
        <ol className="flex items-start justify-between w-full">
          {STAGES.map((stage, idx) => {
            const isCompleted = currentIndex >= idx;
            const isActive = currentIndex === idx;

            return (
              <li key={stage.key} className="flex-1 flex flex-col items-center relative">
                {idx < STAGES.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-0.5 ${
                      currentIndex > idx ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                )}

                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-300'
                  } ${
                    isActive ? 'ring-2 ring-green-300 ring-offset-1' : ''
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" aria-hidden="true" />
                  )}
                </div>

                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isCompleted ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {stage.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

StatusTimeline.propTypes = {
  currentStatus: PropTypes.string.isRequired,
};

export default StatusTimeline;
