import { OrbitMark } from '../ui/OrbitMark';
import './mobile-topbar.css';

export function MobileTopBar({ title, showBrand = false }) {
  return (
    <header className="mtopbar">
      {showBrand ? (
        <div className="mtopbar__brand">
          <OrbitMark size={22} alert />
          <span className="display">Jora Apps Admin</span>
        </div>
      ) : (
        <h1 className="mtopbar__title display">{title}</h1>
      )}
    </header>
  );
}
