import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Package,
  FileText,
  HelpCircle,
  File,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'PBN Sites', path: '/admin/pbn', icon: <Globe size={20} /> },
    { name: 'Aged Domains', path: '/admin/domains', icon: <Globe size={20} /> },
    { name: 'Packages', path: '/admin/packages', icon: <Package size={20} /> },
    { name: 'Blog', path: '/admin/blog', icon: <FileText size={20} /> },
    { name: 'FAQ', path: '/admin/faq', icon: <HelpCircle size={20} /> },
    { name: 'Pages', path: '/admin/pages', icon: <File size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-lg font-semibold text-white">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Back to Site */}
          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-3 font-medium transition-colors"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-slate-900/50 border-b border-white/10 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="text-white font-medium">DomainPBN Admin</div>
          <div className="text-slate-400 text-sm">Welcome, Admin</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;