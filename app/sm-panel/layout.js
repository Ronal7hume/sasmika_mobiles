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
  FileText,
  Sun,
  Moon,
  Tag
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic local session check for admin
    const adminSession = localStorage.getItem('sasmika_admin_logged');
    
    // Skip auth check if we are on the login page
    if (pathname === '/sm-panel/login') {
      setIsLoading(false);
      return;
    }

    if (!adminSession) {
      showToast('Admin session expired. Please log in.', 'error');
      router.push('/sm-panel/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [pathname, router, showToast]);

  const menuItems = [
    { name: 'Dashboard', path: '/sm-panel', icon: LayoutDashboard },
    { name: 'Products Catalog', path: '/sm-panel/products', icon: ShoppingBag },
    { name: 'Add Product', path: '/sm-panel/products/new', icon: PlusCircle },
    { name: 'Manage Offers', path: '/sm-panel/offers', icon: Tag },
    { name: 'Customer Orders', path: '/sm-panel/orders', icon: ShoppingCart },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sasmika_admin_logged');
    showToast('Logged out of Admin Panel', 'info');
    router.push('/sm-panel/login');
  };

  // If on login page, render children directly without sidebar
  if (pathname === '/sm-panel/login') {
    return <div className="bg-[var(--dark-900)] min-h-screen text-[var(--white-90)] transition-colors duration-300">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--dark-900)] text-[var(--white-90)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--dark-500)] border-t-pink-500 animate-spin" />
          <p className="text-sm text-[var(--white-60)] font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[var(--dark-900)] min-h-screen text-[var(--white-90)] flex transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--dark-800)] border-r border-[var(--glass-border)] p-6 shrink-0 h-screen sticky top-0">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <span className="text-2xl">⚡</span>
          <span className="font-display text-lg font-extrabold text-[var(--white)]">
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
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/20 text-[var(--white)]'
                    : 'text-[var(--white-60)] hover:bg-[var(--white-05)] hover:text-[var(--white)]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-pink-500' : ''} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-[var(--glass-border)]">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--white-60)] hover:bg-[var(--white-05)] hover:text-[var(--white)] w-full text-left"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--white-60)] hover:bg-[var(--white-05)] hover:text-[var(--white)]"
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
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[var(--dark-800)] border-b border-[var(--glass-border)] sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-display text-base font-extrabold text-[var(--white)]">
              Admin<span className="text-pink-500">Panel</span>
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[var(--white-60)] hover:text-[var(--white)]"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 top-16 bg-[var(--dark-800)]/98 backdrop-blur-lg z-40 md:hidden flex flex-col p-6 gap-6">
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
                        ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-[var(--white)]'
                        : 'text-[var(--white-80)]'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-pink-500' : ''} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 mt-auto border-t border-[var(--glass-border)] pt-6">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 text-[var(--white-80)] w-full text-left"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[var(--white-80)]"
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

        {/* Admin Footer Bar */}
        <div className="border-t border-[var(--glass-border)] mt-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[var(--white-40)]">
          <p>&copy; {new Date().getFullYear()} Sasmika Mobiles. All rights reserved.</p>
          <span>Admin Panel v1.0</span>
        </div>
      </div>
    </div>
  );
}
