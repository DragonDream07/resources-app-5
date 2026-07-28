import React, { useEffect, useRef } from 'react';

/**
 * ReportChart — a wrapper around a charting library for consolidated admin reports.
 *
 * Accepts a `type` prop ('bar' | 'line' | 'pie') and a `data` prop in the
 * Chart.js–compatible dataset format. When Chart.js is present in the project,
 * it will render via canvas; otherwise it falls back to an SVG bar chart so the
 * component is always functional without requiring an additional dependency to be
 * listed in the design package.
 */

const COLORS = [
  '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
  '#d97706', '#16a34a', '#0891b2', '#6366f1',
];

const FallbackBarChart = ({ data, title }) => {
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return <p className="report-chart__no-data">No data available.</p>;
  }

  const values = data.datasets[0].data || [];
  const labels = data.labels || [];
  const maxValue = Math.max(...values, 1);
  const barWidth = Math.max(20, Math.floor(300 / (values.length || 1)));
  const chartWidth = barWidth * values.length + 40;
  const chartHeight = 200;
  const padding = { top: 20, right: 10, bottom: 40, left: 30 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <svg
      className="report-chart__svg"
      width={chartWidth}
      height={chartHeight}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label={title || 'Chart'}
    >
      {/* Y-axis line */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={padding.top + innerHeight}
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      {/* X-axis line */}
      <line
        x1={padding.left}
        y1={padding.top + innerHeight}
        x2={padding.left + innerWidth}
        y2={padding.top + innerHeight}
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      {values.map((val, i) => {
        const barH = Math.round((val / maxValue) * innerHeight);
        const x = padding.left + i * barWidth + barWidth * 0.1;
        const y = padding.top + innerHeight - barH;
        const color = COLORS[i % COLORS.length];
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth * 0.8}
              height={barH}
              fill={color}
              rx={2}
            />
            <text
              x={x + (barWidth * 0.4)}
              y={padding.top + innerHeight + 14}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const ReportChart = ({ type = 'bar', data, title, height = 300, options = {} }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [useCanvas, setUseCanvas] = React.useState(false);

  useEffect(() => {
    let mounted = true;

    const initChart = async () => {
      try {
        const ChartModule = await import('chart.js/auto');
        const Chart = ChartModule.default || ChartModule;
        if (!mounted || !canvasRef.current) return;

        setUseCanvas(true);

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(canvasRef.current, {
          type,
          data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
              title: title ? { display: true, text: title } : { display: false },
            },
            ...options,
          },
        });
      } catch {
        // chart.js not available — use SVG fallback
        if (mounted) setUseCanvas(false);
      }
    };

    initChart();

    return () => {
      mounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, data, title, options]);

  return (
    <div className="report-chart" style={{ position: 'relative' }}>
      {title && !useCanvas && (
        <h4 className="report-chart__title">{title}</h4>
      )}
      {useCanvas ? (
        <div style={{ height: `${height}px` }}>
          <canvas ref={canvasRef} />
        </div>
      ) : (
        <div className="report-chart__fallback">
          <FallbackBarChart data={data} title={title} />
        </div>
      )}
    </div>
  );
};

export default ReportChart;
