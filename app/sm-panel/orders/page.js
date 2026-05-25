'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { 
  Search, 
  ShoppingCart, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  RefreshCw, 
  DollarSign 
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Load orders list
  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        showToast('Failed to load customer orders', 'error');
      }
    } catch (e) {
      showToast('Error loading orders from API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast(`Order status updated to ${newStatus}!`, 'success');
        // Update local list state
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        showToast('Failed to update order status', 'error');
      }
    } catch (e) {
      showToast('An error occurred during updating status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerPhone.includes(search) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Customer Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Customer Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Review purchases, update fulfillment status, and inspect custom printing parameters</p>
        </div>
        <button 
          onClick={loadOrders}
          className="p-3 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl transition-all"
          title="Refresh List"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Control Bar (Search / Filters) */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl max-w-md w-full">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by ID, Customer Name, or Phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm bg-transparent text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Orders List Container */}
      <div className="flex flex-col gap-6">
        {filteredOrders.length === 0 ? (
          <div className="glass-card py-16 border border-white/5 text-center text-slate-500 shadow-xl">
            <ShoppingCart size={48} className="mx-auto text-slate-600 mb-3" />
            <span>No orders found matching search criteria.</span>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="glass-card border border-white/5 overflow-hidden shadow-2xl hover:border-white/10 transition-all">
              
              {/* Order Header Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 border-b border-white/5 bg-slate-950/40 text-sm items-center">
                
                {/* ID & Date */}
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-bold text-pink-500">{order.id}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Calendar size={12} />
                    {new Date(order.date).toLocaleString()}
                  </span>
                </div>

                {/* Customer */}
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <User size={12} className="text-purple-400" />
                    {order.customerName}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Phone size={12} className="text-purple-400" />
                    {order.customerPhone}
                  </span>
                </div>

                {/* Amount Details */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-400">Total Purchase Value</span>
                  <span className="font-extrabold text-white text-base">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>

                {/* Status Picker Selector */}
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className={`px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-bold w-full max-w-[150px] outline-none ${
                      order.status === 'Completed' ? 'text-emerald-400' :
                      order.status === 'Processing' ? 'text-blue-400' :
                      order.status === 'Cancelled' ? 'text-red-400' :
                      'text-amber-400'
                    }`}
                  >
                    <option value="Pending" className="text-amber-400 bg-slate-950">Pending 🟡</option>
                    <option value="Processing" className="text-blue-400 bg-slate-950">Processing 🔵</option>
                    <option value="Completed" className="text-emerald-400 bg-slate-950">Completed 🟢</option>
                    <option value="Cancelled" className="text-red-400 bg-slate-950">Cancelled 🔴</option>
                  </select>
                  {updatingId === order.id && (
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-pink-500 animate-spin shrink-0" />
                  )}
                </div>

              </div>

              {/* Order Body Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Items Bought list */}
                <div className="md:col-span-2 flex flex-col gap-4 border-r border-white/5 pr-0 md:pr-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Purchased Products</h4>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                        <div className="flex flex-col gap-0.5 max-w-[280px]">
                          <span className="text-sm font-semibold text-white truncate">{item.name}</span>
                          <div className="text-xs text-slate-400 flex flex-wrap gap-2 items-center">
                            {item.brand && <span>{item.brand}</span>}
                            {item.type && (
                              <>
                                <span className="text-slate-600">|</span>
                                <span className="px-1.5 py-0.5 rounded bg-white/5">{item.type}</span>
                              </>
                            )}
                            {item.customDetails && (
                              <>
                                <span className="text-slate-600">|</span>
                                <span className="text-pink-400 font-medium">Specs: {item.customDetails}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <span className="text-slate-400 text-xs mr-2">₹{item.price} x {item.quantity}</span>
                          <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping / Delivery Destination */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Destination</h4>
                  <div className="flex flex-col gap-3 bg-slate-900/20 p-4 border border-white/5 rounded-xl text-sm leading-relaxed text-slate-300">
                    <div className="flex gap-2.5 items-start">
                      <MapPin size={16} className="text-pink-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-white block mb-1">Address Details</span>
                        <p className="text-slate-400 text-xs">{order.customerAddress || 'No shipping address specified.'}</p>
                      </div>
                    </div>
                    {order.customerEmail && (
                      <div className="border-t border-white/5 pt-3 mt-1 text-xs text-slate-400">
                        Email: <span className="text-slate-300 font-mono">{order.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
