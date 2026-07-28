import React from 'react';

const TrendIndicator = ({ trend }) => {
  if (trend === undefined || trend === null) return null;

  const isPositive = trend >= 0;
  const arrow = isPositive ? '▲' : '▼';
  const colorClass = isPositive ? 'stats-card__trend--up' : 'stats-card__trend--down';

  return (
    <span className={`stats-card__trend ${colorClass}`}>
      {arrow} {Math.abs(trend)}%
    </span>
  );
};

const StatsCard = ({ label, value, trend, unit, description }) => {
  return (
    <div className="stats-card">
      <div className="stats-card__header">
        <span className="stats-card__label">{label}</span>
        <TrendIndicator trend={trend} />
      </div>
      <div className="stats-card__value">
        {unit && <span className="stats-card__unit">{unit}</span>}
        <span className="stats-card__number">{value}</span>
      </div>
      {description && (
        <div className="stats-card__description">{description}</div>
      )}
    </div>
  );
};

export default StatsCard;
