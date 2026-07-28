import React from 'react';
import PropTypes from 'prop-types';
import '@/assets/icons/check.svg';

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function CheckoutStepper({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className="checkout-stepper">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';

          return (
            <li
              key={step.id}
              className={`checkout-stepper__step checkout-stepper__step--${status}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="checkout-stepper__indicator">
                {isCompleted ? (
                  <img
                    src="/src/assets/icons/check.svg"
                    alt="Completed"
                    className="checkout-stepper__check-icon"
                  />
                ) : (
                  <span className="checkout-stepper__step-number">{index + 1}</span>
                )}
              </span>
              <span className="checkout-stepper__label">{step.label}</span>
              {index < STEPS.length - 1 && (
                <span
                  className={`checkout-stepper__connector${isCompleted ? ' checkout-stepper__connector--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .checkout-stepper {
          width: 100%;
          padding: 1rem 0;
        }
        .checkout-stepper__list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0;
        }
        .checkout-stepper__step {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .checkout-stepper__step:last-child {
          flex: 0;
        }
        .checkout-stepper__indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
          border: 2px solid #d1d5db;
          background: #fff;
          color: #6b7280;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .checkout-stepper__step--completed .checkout-stepper__indicator {
          background: #16a34a;
          border-color: #16a34a;
          color: #fff;
        }
        .checkout-stepper__step--active .checkout-stepper__indicator {
          background: #2563eb;
          border-color: #2563eb;
          color: #fff;
        }
        .checkout-stepper__check-icon {
          width: 1rem;
          height: 1rem;
          filter: brightness(0) invert(1);
        }
        .checkout-stepper__label {
          margin-left: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          white-space: nowrap;
        }
        .checkout-stepper__step--active .checkout-stepper__label {
          color: #1d4ed8;
          font-weight: 600;
        }
        .checkout-stepper__step--completed .checkout-stepper__label {
          color: #15803d;
          font-weight: 500;
        }
        .checkout-stepper__connector {
          flex: 1;
          height: 2px;
          background: #d1d5db;
          margin: 0 0.5rem;
          display: block;
        }
        .checkout-stepper__connector--completed {
          background: #16a34a;
        }
      `}</style>
    </nav>
  );
}

CheckoutStepper.propTypes = {
  currentStep: PropTypes.oneOf(['address', 'payment', 'review']).isRequired,
};

export default CheckoutStepper;
