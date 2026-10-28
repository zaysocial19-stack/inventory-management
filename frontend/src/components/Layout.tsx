import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Suppliers', path: '/suppliers' },
    { label: 'Orders', path: '/orders' },
  ];


  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-950 text-rose-300 border-rose-800/80';
      case 'MANAGER':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/80';
      case 'STAFF':
        return 'bg-amber-950 text-amber-300 border-amber-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Inventory & Order Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Store Administration & Real-Time Tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-white">{user.fullName}</span>
                  <span className="text-[10px] text-slate-400">{user.email}</span>
                </div>
                {(() => {
                  const roleName =
                    typeof user.role === 'object' && user.role !== null
                      ? user.role.name
                      : String(user.role || '');
                  return (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${getRoleBadge(
                        roleName
                      )}`}
                    >
                      {roleName}
                    </span>
                  );
                })()}
                <button
                  onClick={logout}
                  className="ml-2 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-slate-700"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shadow-sm shadow-sky-950/40"
              >
                🔐 Sign In
              </button>
            )}
          </div>
        </header>

        {/* Navigation Bar using NavLink */}
        <nav className="flex gap-2 mb-8 border-b border-slate-800 pb-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* The active page content renders here */}
        <main>
          <Outlet />
        </main>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </div>
  );
}
