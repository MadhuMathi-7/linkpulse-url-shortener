import React, { useState } from 'react';
import { Navigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Link2 
} from 'lucide-react';
import Button from '../components/ui/Button';

const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If session is loading, show standard loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="text-dark-400 text-sm font-semibold tracking-wider animate-pulse">
          INITIALIZING SECURE SESSION...
        </p>
      </div>
    );
  }

  // Redirect to login if user session is invalid
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const menuItems = [
    { label: 'Links Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-grid text-dark-100 flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-dark-900 border-r border-dark-700/60 p-6 flex-shrink-0 z-30 justify-between">
        <div>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 px-2 py-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-neon-indigo">
              <Link2 className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Link<span className="text-brand-cyan font-semibold">Pulse</span>
              </span>
              <p className="text-[10px] text-dark-400 tracking-widest font-semibold uppercase leading-none mt-0.5">
                Shorten. Track.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/10 border border-brand-indigo/20'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-dark-400 group-hover:text-white'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with user profile details */}
        <div className="border-t border-dark-700/60 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-brand-indigo flex items-center justify-center font-bold text-base uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate leading-tight">{user.name}</h4>
              <span className="text-xs text-dark-400 truncate block leading-none mt-0.5">{user.email}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-brand-danger hover:bg-brand-danger/10 hover:text-brand-danger px-4 py-2.5 rounded-xl text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-dark-900 border-b border-dark-700/60 px-6 py-4 flex justify-between items-center z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white">
            <Link2 className="w-4 h-4 rotate-45" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Link<span className="text-brand-cyan">Pulse</span>
          </span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-dark-400 hover:text-white transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-dark-950/95 backdrop-blur-md z-30 flex flex-col justify-between p-6 border-t border-dark-700/30">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-indigo text-white'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-dark-700/60 pt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-brand-indigo flex items-center justify-center font-bold text-base">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{user.name}</h4>
                <span className="text-xs text-dark-400">{user.email}</span>
              </div>
            </div>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                setIsMobileOpen(false);
                handleLogout();
              }}
              className="w-full justify-center"
            >
              <LogOut className="w-4 h-4" />
              Logout Session
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
