import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Orders', path: '/orders' },
  ]

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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              System Online
            </span>
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
      </div>
    </div>
  )
}
