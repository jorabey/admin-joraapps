import { MobileTopBar } from './MobileTopBar';
import './page-header.css';

export function PageHeader({ title, subtitle, right }) {
  return (
    <>
      <MobileTopBar title={title} />
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title display">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        {right && <div className="page-header__right">{right}</div>}
      </div>
    </>
  );
}
