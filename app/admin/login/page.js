'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    const adminSession = localStorage.getItem('sasmika_admin_logged');
    if (adminSession) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please enter both username and password', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, type: 'admin' }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('sasmika_admin_logged', 'true');
        showToast('Login successful! Welcome to Dashboard.', 'success');
        router.push('/admin');
      } else {
        showToast(data.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      showToast('An error occurred during authentication', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md glass-card p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500 rounded-full filter blur-[100px] opacity-25" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500 rounded-full filter blur-[100px] opacity-25" />

        {/* Headings */}
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-pink-500/20">
            ⚡
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">Admin Access</h1>
          <p className="text-sm text-slate-400 mt-2">Sign in to manage Sasmika Mobiles products and orders</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Username</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 border border-white/5 focus-within:border-pink-500/40 rounded-xl transition-all">
              <User size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-sm bg-transparent text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 border border-white/5 focus-within:border-pink-500/40 rounded-xl transition-all">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm bg-transparent text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
