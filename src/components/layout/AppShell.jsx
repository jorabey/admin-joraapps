import { Outlet } from 'react-router-dom';
import { Sidebar, MobileTabBar } from './Sidebar';
import './shell.css';

export function AppShell() {
  return (
    <div className="dshell">
      <Sidebar />
      <main className="dshell__content">
        <Outlet />
      </main>
      <MobileTabBar />
    </div>
  );
}

export function PlainShell() {
  return (
    <div className="dshell dshell--plain">
      <Sidebar />
      <main className="dshell__content dshell__content--full">
        <Outlet />
      </main>
      <MobileTabBar />
    </div>
  );
}
