import React from 'react';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function CartItem({ item, onQuantityChange, onRemove }) {
  const {
    id,
    name,
    sku,
    variantLabel,
    quantity,
    price,
    imageUrl,
  } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const lineTotal = (price * quantity).toFixed(2);

  return (
    <div className="cart-item">
      <div className="cart-item__image-wrapper">
        <img
          src={imageUrl || placeholderProduct}
          alt={name}
          className="cart-item__image"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
      </div>

      <div className="cart-item__details">
        <p className="cart-item__name">{name}</p>
        {variantLabel && (
          <p className="cart-item__variant">{variantLabel}</p>
        )}
        {sku && (
          <p className="cart-item__sku">SKU: {sku}</p>
        )}
        <p className="cart-item__unit-price">₹{Number(price).toFixed(2)} each</p>
      </div>

      <div className="cart-item__qty-stepper">
        <button
          className="cart-item__qty-btn"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <img src={minusIcon} alt="minus" width={16} height={16} />
        </button>
        <span className="cart-item__qty-value" aria-label={`Quantity: ${quantity}`}>
          {quantity}
        </span>
        <button
          className="cart-item__qty-btn"
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <img src={plusIcon} alt="plus" width={16} height={16} />
        </button>
      </div>

      <div className="cart-item__line-total">
        ₹{lineTotal}
      </div>

      <button
        className="cart-item__remove-btn"
        onClick={handleRemove}
        aria-label={`Remove ${name} from cart`}
      >
        <img src={trashIcon} alt="Remove" width={18} height={18} />
      </button>
    </div>
  );
}

export default CartItem;
