import React from 'react';
import { Link } from 'react-router-dom';
import emptyStateImg from '@/assets/images/empty-state.svg';

function EmptyCart() {
  return (
    <div className="empty-cart">
      <div className="empty-cart__illustration">
        <img
          src={emptyStateImg}
          alt="Your cart is empty"
          className="empty-cart__image"
          width={240}
          height={240}
        />
      </div>

      <h2 className="empty-cart__heading">Your cart is empty</h2>
      <p className="empty-cart__subtext">
        Looks like you haven't added anything yet. Browse our products and find something you love!
      </p>

      <Link to="/products" className="empty-cart__cta">
        Shop Now
      </Link>
    </div>
  );
}

export default EmptyCart;
