'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  ShoppingCart, 
  LogOut, 
  Home, 
  Menu, 
  X,
  FileText
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic local session check for admin
    const adminSession = localStorage.getItem('sasmika_admin_logged');
    
    // Skip auth check if we are on the login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    if (!adminSession) {
      showToast('Admin session expired. Please log in.', 'error');
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [pathname, router, showToast]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalog', path: '/admin/products', icon: ShoppingBag },
    { name: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sasmika_admin_logged');
    showToast('Logged out of Admin Panel', 'info');
    router.push('/admin/login');
  };

  // If on login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <div className="bg-[#0c0a1a] min-h-screen text-slate-100">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0a1a] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-pink-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#0c0a1a] min-h-screen text-slate-100 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-white/5 p-6 shrink-0 h-screen sticky top-0">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <span className="text-2xl">⚡</span>
          <span className="font-display text-lg font-extrabold text-white">
            Admin<span className="text-pink-500">Panel</span>
          </span>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/20 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-pink-500' : ''} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <Home size={18} />
            <span>Go to Shop</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-grow min-h-screen">
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-display text-base font-extrabold text-white">
              Admin<span className="text-pink-500">Panel</span>
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 top-16 bg-slate-950/98 backdrop-blur-lg z-40 md:hidden flex flex-col p-6 gap-6">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-white'
                        : 'text-slate-300'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-pink-500' : ''} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 mt-auto border-t border-white/5 pt-6">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-300"
              >
                <Home size={20} />
                <span>Go to Shop</span>
              </Link>
              
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-400 w-full text-left"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Children Container */}
        <main className="flex-grow p-6 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
