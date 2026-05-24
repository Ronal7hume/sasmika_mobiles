'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { ShoppingCart, Heart, User, Menu, X, Phone, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, favorites, currentUser } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Offers', path: '/offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
      isScrolled 
        ? 'bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] py-3 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <span className="text-2xl animate-pulse">📱</span>
          <span className="font-display text-xl font-extrabold tracking-tight text-[var(--white)]">
            Sasmika <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Mobiles</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--white)] rounded-lg ${
                  isActive ? 'text-[var(--white)]' : 'text-[var(--white-60)]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Action Icons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--white-60)] hover:text-[var(--white)] hover:bg-[var(--white-05)] rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Favorites */}
          <Link href="/favorites" className="relative p-2 text-[var(--white-60)] hover:text-[var(--white)] hover:bg-[var(--white-05)] rounded-lg transition-colors">
            <Heart size={20} className={favorites.length > 0 ? 'fill-pink-500 text-pink-500' : ''} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-[var(--white-60)] hover:text-[var(--white)] hover:bg-[var(--white-05)] rounded-lg transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          <Link href={currentUser ? '/profile' : '/login'} className="p-2 text-[var(--white-60)] hover:text-[var(--white)] hover:bg-[var(--white-05)] rounded-lg transition-colors flex items-center gap-2">
            <User size={20} />
            {currentUser && <span className="text-xs max-w-[80px] truncate text-[var(--white-90)]">{currentUser.name}</span>}
          </Link>
        </div>

        {/* Mobile Actions and Hamburger */}
        <div className="flex md:hidden items-center gap-2 z-50">
          {/* Theme Toggle Mobile */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--white-60)] hover:text-[var(--white)]"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/cart" className="relative p-2 text-[var(--white-60)] hover:text-[var(--white)]">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[var(--white-60)] hover:text-[var(--white)]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="fixed inset-0 top-0 bg-[var(--dark-900)]/98 backdrop-blur-lg z-40 md:hidden flex flex-col pt-24 px-6 gap-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-semibold py-2 border-b border-[var(--glass-border)] ${
                    isActive ? 'text-pink-500' : 'text-[var(--white-80)]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Link
              href="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-[var(--white-80)] py-2"
            >
              <Heart size={22} className="text-pink-500 fill-pink-500" />
              <span>Favorites ({favorites.length})</span>
            </Link>

            <Link
              href={currentUser ? '/profile' : '/login'}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-[var(--white-80)] py-2"
            >
              <User size={22} className="text-purple-500" />
              <span>{currentUser ? `My Profile (${currentUser.name})` : 'Login / Sign Up'}</span>
            </Link>

            <a
              href="https://wa.me/918526033272"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg"
            >
              <Phone size={18} />
              <span>Contact Shop (WhatsApp)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
