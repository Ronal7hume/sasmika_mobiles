'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname ? pathname.startsWith('/sm-panel') : false;

  return (
    <ToastProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          {/* Main User Navigation */}
          {!isAdmin && <Navbar />}
          
          {/* Main Content Area */}
          <main className={`flex-grow ${!isAdmin ? 'pt-24 pb-24' : ''}`}>
            {children}
          </main>
          
          {/* Main User Footer */}
          {!isAdmin && <Footer />}
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
