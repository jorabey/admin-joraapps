import { Card } from './Primitives';
import './metric-card.css';

export function MetricCard({ icon, label, value, delta, deltaLabel, color = 'red' }) {
  return (
    <Card className="metric-card">
      <div className={`metric-card__icon metric-card__icon--${color}`}>{icon}</div>
      <div className="metric-card__body">
        <p className="metric-card__value display">{value}</p>
        <p className="metric-card__label">{label}</p>
        {delta !== undefined && (
          <p className={`metric-card__delta ${delta >= 0 ? 'is-up' : 'is-down'}`}>
            {delta >= 0 ? '+' : ''}{delta} {deltaLabel}
          </p>
        )}
      </div>
    </Card>
  );
}
