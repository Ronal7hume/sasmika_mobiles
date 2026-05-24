'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Lock, Phone, User, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function UserSignupPage() {
  const router = useRouter();
  const { loginUser, currentUser } = useCart();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, redirect
    if (currentUser) {
      router.push('/profile');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      showToast('Name, phone, and password are required!', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, address }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Registration successful!', 'success');
        loginUser(data.user);
        router.push('/profile');
      } else {
        showToast(data.error || 'Failed to create account', 'error');
      }
    } catch (err) {
      showToast('An error occurred during registration', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-6 py-10">
      <div className="w-full max-w-md glass-card p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500 rounded-full filter blur-[100px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500 rounded-full filter blur-[100px] opacity-15 pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-display text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-slate-400 text-xs mt-2">Join Sasmika Mobiles to save addresses and track shipping</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Full Name *</label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <User size={16} className="text-slate-400" />
              <input 
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">WhatsApp Phone *</label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <Phone size={16} className="text-slate-400" />
              <input 
                type="tel"
                placeholder="Enter contact number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Email (Optional)</label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <Mail size={16} className="text-slate-400" />
              <input 
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Create Password *</label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <Lock size={16} className="text-slate-400" />
              <input 
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Default Delivery Address</label>
            <div className="flex items-start gap-3 px-4 py-2.5 bg-slate-900 border border-white/5 focus-within:border-pink-500/20 rounded-xl transition-all">
              <MapPin size={16} className="text-slate-400 mt-1" />
              <textarea 
                placeholder="Enter default street, pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs bg-transparent text-white placeholder-slate-500 outline-none h-16 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer login link */}
        <div className="text-center mt-6 relative z-10 text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link href="/login" className="text-pink-500 hover:text-pink-400 font-bold underline transition-colors">
            Login Now
          </Link>
        </div>

      </div>
    </div>
  );
}
