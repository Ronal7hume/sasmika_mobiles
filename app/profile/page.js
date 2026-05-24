'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  LogOut, 
  Heart, 
  ShoppingCart, 
  ShoppingBag,
  Save
} from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const { currentUser, logout, loginUser, isLoaded } = useCart();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isLoaded && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoaded, router]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = () => {
    if (!name || !phone) {
      showToast('Name and Phone are required fields', 'warning');
      return;
    }

    const updatedUser = {
      ...currentUser,
      name,
      phone,
      email,
      address
    };

    // Update currentUser state in context
    loginUser(updatedUser);
    setIsEditing(false);
    showToast('Profile updated successfully! ✨', 'success');
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/');
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-10">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your customer account and view shopping shortcuts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Card & Details Form */}
        <div className="lg:col-span-7 glass-card border border-white/5 p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <User size={18} className="text-pink-500" />
              <span>Personal Information</span>
            </h3>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-pink-500 hover:text-pink-400 underline transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold text-slate-450 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-slate-350">
                <User size={16} className="text-slate-500 shrink-0" />
                {isEditing ? (
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-white outline-none text-xs"
                  />
                ) : (
                  <span>{currentUser.name}</span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-slate-350">
                <Phone size={16} className="text-slate-500 shrink-0" />
                {isEditing ? (
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-white outline-none text-xs"
                  />
                ) : (
                  <span>{currentUser.phone}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-slate-350">
                <Mail size={16} className="text-slate-500 shrink-0" />
                {isEditing ? (
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white outline-none text-xs"
                  />
                ) : (
                  <span>{currentUser.email || <span className="text-slate-600 font-semibold italic">Not specified</span>}</span>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping Address</label>
              <div className="flex items-start gap-3 px-4 py-2.5 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-slate-350">
                <MapPin size={16} className="text-slate-500 mt-1 shrink-0" />
                {isEditing ? (
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-transparent text-white outline-none h-16 resize-none text-xs"
                  />
                ) : (
                  <span className="leading-relaxed">{currentUser.address || <span className="text-slate-600 font-semibold italic">Not specified</span>}</span>
                )}
              </div>
            </div>

            {/* Save Profile Button */}
            {isEditing && (
              <button 
                onClick={handleUpdateProfile}
                className="mt-2 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            )}
          </div>
        </div>

        {/* Shortcuts Links Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card border border-white/5 p-6 shadow-xl flex flex-col gap-4">
            <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-2.5">
              Account Shortcuts
            </h3>
            
            <div className="flex flex-col gap-2">
              <Link 
                href="/orders"
                className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-sm font-semibold transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={16} className="text-purple-400" />
                  <span>My Placed Orders</span>
                </div>
                <span className="text-xs text-slate-550 group-hover:text-white transition-colors">→</span>
              </Link>

              <Link 
                href="/favorites"
                className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-sm font-semibold transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Heart size={16} className="text-pink-500 fill-pink-500" />
                  <span>My Wishlist items</span>
                </div>
                <span className="text-xs text-slate-550 group-hover:text-white transition-colors">→</span>
              </Link>

              <Link 
                href="/cart"
                className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-sm font-semibold transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={16} className="text-indigo-400" />
                  <span>Inspect Shopping Cart</span>
                </div>
                <span className="text-xs text-slate-550 group-hover:text-white transition-colors">→</span>
              </Link>
            </div>

            <button 
              onClick={handleLogoutClick}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-red-650/10 hover:bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs rounded-xl transition-all"
            >
              <LogOut size={14} />
              <span>Logout Account</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
