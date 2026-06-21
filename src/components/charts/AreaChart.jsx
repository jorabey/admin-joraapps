import { useState, useId, useMemo } from 'react';
import './chart.css';

/**
 * AreaChart
 * data: [{ label, value }]
 * Pure SVG, no chart library — gradient fill + hover tooltip.
 */
export function AreaChart({ data, color = '#FF4545', height = 180 }) {
  const gradId = useId();
  const [hoverIdx, setHoverIdx] = useState(null);

  const { points, maxVal, minVal } = useMemo(() => {
    if (!data || data.length === 0) return { points: [], maxVal: 0, minVal: 0 };
    const values = data.map((d) => d.value);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal || 1;
    const w = 100;
    const h = 100;
    const step = data.length > 1 ? w / (data.length - 1) : 0;
    const points = data.map((d, i) => ({
      x: i * step,
      y: h - ((d.value - minVal) / range) * h,
      ...d,
    }));
    return { points, maxVal, minVal };
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data</div>;
  }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} 100 L 0 100 Z`;

  const hover = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="chart-container" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="chart-svg"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} className="chart-grid-line" vectorEffect="non-scaling-stroke" />
        ))}

        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - (100 / points.length) / 2}
            y={0}
            width={100 / points.length}
            height={100}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}

        {hover && (
          <>
            <line x1={hover.x} y1="0" x2={hover.x} y2="100" className="chart-hover-line" vectorEffect="non-scaling-stroke" />
            <circle cx={hover.x} cy={hover.y} r="2.2" fill={color} vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {hover && (
        <div
          className="chart-tooltip"
          style={{ left: `${hover.x}%`, top: `${Math.max(8, hover.y)}%` }}
        >
          <span className="chart-tooltip__label">{hover.label}</span>
          <span className="chart-tooltip__value">{hover.value}</span>
        </div>
      )}
    </div>
  );
}
