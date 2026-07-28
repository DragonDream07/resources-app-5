import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminPromotionList() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPromoCodes() {
      try {
        const res = await fetch('/api/promo-codes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to load promo codes');
        const data = await res.json();
        setPromoCodes(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPromoCodes();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-page__loading">Loading promo codes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-page__error">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Promo Codes</h1>
        <Link to="/admin/promotions/new" className="admin-page__btn admin-page__btn--primary">
          <img src="/src/assets/icons/plus.svg" alt="" className="admin-page__btn-icon" />
          New Promo Code
        </Link>
      </div>

      {promoCodes.length === 0 ? (
        <div className="admin-page__empty">
          <img src="/src/assets/images/empty-state.svg" alt="No promo codes" className="admin-page__empty-img" />
          <p className="admin-page__empty-text">No promo codes found.</p>
          <Link to="/admin/promotions/new" className="admin-page__btn admin-page__btn--primary">
            Create your first promo code
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead className="admin-table__head">
              <tr>
                <th className="admin-table__th">Code</th>
                <th className="admin-table__th">Type</th>
                <th className="admin-table__th">Discount</th>
                <th className="admin-table__th">Expiry</th>
                <th className="admin-table__th">Status</th>
                <th className="admin-table__th">Actions</th>
              </tr>
            </thead>
            <tbody className="admin-table__body">
              {promoCodes.map((promo) => (
                <tr key={promo.id} className="admin-table__row">
                  <td className="admin-table__td admin-table__td--code">{promo.code}</td>
                  <td className="admin-table__td">{promo.type}</td>
                  <td className="admin-table__td">
                    {promo.type === 'percentage'
                      ? `${promo.discount_value}%`
                      : `$${Number(promo.discount_value).toFixed(2)}`}
                  </td>
                  <td className="admin-table__td">
                    {promo.expires_at
                      ? new Date(promo.expires_at).toLocaleDateString()
                      : <span className="admin-table__no-expiry">No expiry</span>}
                  </td>
                  <td className="admin-table__td">
                    <span
                      className={`admin-table__badge ${
                        promo.is_active
                          ? 'admin-table__badge--active'
                          : 'admin-table__badge--inactive'
                      }`}
                    >
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="admin-table__td admin-table__td--actions">
                    <Link
                      to={`/admin/promotions/${promo.id}/edit`}
                      className="admin-table__action-btn"
                      aria-label={`Edit ${promo.code}`}
                    >
                      <img src="/src/assets/icons/edit.svg" alt="Edit" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
