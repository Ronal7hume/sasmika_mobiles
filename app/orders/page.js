'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  ShoppingCart,
  ArrowRight,
  Phone,
  RefreshCw
} from 'lucide-react';

export default function UserOrdersPage() {
  const router = useRouter();
  const { currentUser, isLoaded } = useCart();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Filter orders that match the customer's phone number!
        const userOrders = data.filter(
          o => o.customerPhone === currentUser.phone || o.customerPhone === currentUser.phone.replace(/[^0-9]/g, '')
        );
        setOrders(userOrders);
      } else {
        showToast('Failed to load order history', 'error');
      }
    } catch (e) {
      showToast('Error loading orders from API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (!currentUser) {
        showToast('Please log in to view your orders', 'warning');
        router.push('/login');
      } else {
        fetchOrders();
      }
    }
  }, [currentUser, isLoaded, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Order History...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 flex flex-col items-center justify-center gap-6 text-center text-slate-500">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-4xl">
          📦
        </div>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white">No Orders Placed Yet</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            You haven't placed any accessories orders yet with Sasmika Mobiles. Add gear to your cart and checkout!
          </p>
        </div>
        <Link 
          href="/gallery"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3.5 text-xs font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5"
        >
          <span>Shop Products</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">My Orders History</h1>
          <p className="text-slate-400 text-sm mt-1">Review processing statuses and delivery estimations of your gear</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-3 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl transition-colors"
          title="Refresh Orders"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order.id} className="glass-card border border-white/5 overflow-hidden shadow-xl hover:border-white/10 transition-colors">
            
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-4 bg-slate-950/40 border-b border-white/5 text-sm items-center">
              
              {/* ID & Date */}
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-xs font-bold text-pink-500">{order.id}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar size={12} />
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>

              {/* Bill Details */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Purchase Price</span>
                <span className="font-extrabold text-white text-base">₹{order.total.toLocaleString()}</span>
              </div>

              {/* Status Badge */}
              <div className="sm:text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {order.status === 'Completed' ? '🟢 Delivered' :
                   order.status === 'Processing' ? '🔵 Processing' :
                   order.status === 'Cancelled' ? '🔴 Cancelled' :
                   '🟡 Pending Confirmation'}
                </span>
              </div>

            </div>

            {/* Purchased Items details */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Items List */}
              <div className="md:col-span-8 flex flex-col gap-4 border-r border-white/5 pr-0 md:pr-6">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Purchased Products</h4>
                <div className="flex flex-col gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-white/5 rounded-xl text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-xl shrink-0">
                          {item.productId?.startsWith('s') ? '🖼️' : '🎧'}
                        </div>
                        <div className="flex flex-col gap-0.5 max-w-[200px]">
                          <span className="font-semibold text-white truncate">{item.name}</span>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {item.brand} {item.type && `• ${item.type}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 mr-2">₹{item.price} x {item.quantity}</span>
                        <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping address details */}
              <div className="md:col-span-4 flex flex-col gap-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fulfillment Address</h4>
                <div className="flex gap-3 bg-slate-900/20 p-4 border border-white/5 rounded-xl text-xs leading-relaxed text-slate-350">
                  <MapPin size={16} className="text-pink-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-1 text-xs">Home Delivery Location</span>
                    <p className="text-slate-400 mt-0.5">{order.customerAddress}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
