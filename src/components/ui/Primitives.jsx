import './primitives.css';

export function Card({ children, className = '', glow = false, danger = false, ...rest }) {
  return (
    <div className={`card ${glow ? 'card--glow' : ''} ${danger ? 'card--danger' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

const BADGE_VARIANTS = {
  live: { bg: 'var(--green-dim)', fg: 'var(--green)' },
  review: { bg: 'var(--amber-dim)', fg: 'var(--amber)' },
  suspended: { bg: 'var(--red-dim)', fg: 'var(--red)' },
  blocked: { bg: 'var(--red-dim)', fg: 'var(--red)' },
  neutral: { bg: 'var(--bg-overlay)', fg: 'var(--text-secondary)' },
  info: { bg: 'var(--blue-dim)', fg: 'var(--blue)' },
  violet: { bg: 'var(--violet-dim)', fg: 'var(--violet)' },
  silver: { bg: 'var(--silver-dim)', fg: 'var(--silver)' },
};

export function Badge({ variant = 'neutral', dot = false, children, className = '' }) {
  const c = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;
  return (
    <span
      className={`badge ${className}`}
      style={{ background: c.bg, color: c.fg }}
    >
      {dot && <span className="badge__dot" style={{ background: c.fg }} />}
      {children}
    </span>
  );
}

export function Divider({ className = '' }) {
  return <div className={`divider ${className}`} />;
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <p className="empty-state__title">{title}</p>
      {desc && <p className="empty-state__desc">{desc}</p>}
      {action}
    </div>
  );
}

export function SkeletonRow({ height = 56 }) {
  return <div className="skeleton-row" style={{ height }} />;
}

export function Spinner({ size = 18 }) {
  return <span className="spinner" style={{ width: size, height: size }} />;
}

export function RoleBadge({ role }) {
  const map = {
    super_admin: { label: 'Super Admin', variant: 'violet' },
    moderator: { label: 'Moderator', variant: 'info' },
    support: { label: 'Support', variant: 'silver' },
  };
  const r = map[role] || map.support;
  return <Badge variant={r.variant}>{r.label}</Badge>;
}
