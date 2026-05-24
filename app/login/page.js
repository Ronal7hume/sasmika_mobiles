'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Lock, Phone, User, ArrowRight } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const { loginUser, currentUser } = useCart();
  const { showToast } = useToast();

  const [username, setUsername] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to profile
    if (currentUser) {
      router.push('/profile');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please fill in both fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type: 'user' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        loginUser(data.user);
        router.push('/profile');
      } else {
        showToast(data.error || 'Invalid username or password', 'error');
      }
    } catch (err) {
      showToast('An error occurred during authentication', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-6">
      <div className="w-full max-w-md glass-card p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500 rounded-full filter blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500 rounded-full filter blur-[100px] opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-display text-2xl font-extrabold text-white">Customer Login</h1>
          <p className="text-slate-400 text-xs mt-2">Sign in to track orders, save profiles, and quick checkout</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number or Email</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <Phone size={16} className="text-slate-400" />
              <input 
                type="text"
                placeholder="Enter phone or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <Lock size={16} className="text-slate-400" />
              <input 
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Action submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer signup link */}
        <div className="text-center mt-6 relative z-10 text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link href="/signup" className="text-pink-500 hover:text-pink-400 font-bold underline transition-colors">
            Register Account
          </Link>
        </div>

      </div>
    </div>
  );
}
