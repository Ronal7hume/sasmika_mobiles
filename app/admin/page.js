'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    lowStock: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);

        if (productsRes.ok && ordersRes.ok) {
          const products = await productsRes.json();
          const orders = await ordersRes.json();

          // Calculate stats
          const totalProducts = products.length;
          const totalOrders = orders.length;
          const revenue = orders
            .filter(o => o.status === 'Completed' || o.status === 'Processing')
            .reduce((sum, o) => sum + o.total, 0);

          const lowStockList = products.filter(p => p.stock !== undefined && p.stock <= 5);
          const lowStock = lowStockList.length;

          setStats({
            totalProducts,
            totalOrders,
            revenue,
            lowStock
          });

          setLowStockProducts(lowStockList.slice(0, 5));
          setRecentOrders(orders.slice(0, 5));
        } else {
          showToast('Failed to load dashboard metrics', 'error');
        }
      } catch (err) {
        showToast('Error loading dashboard data', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [showToast]);

  const statsCards = [
    {
      title: 'Total Active Products',
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-500/10',
      link: '/admin/products'
    },
    {
      title: 'Customer Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/10',
      link: '/admin/orders'
    },
    {
      title: 'Total Sales Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10',
      link: '/admin/orders'
    },
    {
      title: 'Critical Low Stock',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: stats.lowStock > 0 ? 'from-amber-500 to-orange-500 animate-pulse' : 'from-slate-600 to-slate-700',
      shadow: 'shadow-amber-500/10',
      link: '/admin/products'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time indicators of your store's inventory and sales performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link 
              key={idx} 
              href={card.link}
              className={`glass-card p-6 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 block shadow-lg ${card.shadow}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{card.title}</span>
                  <span className="text-3xl font-display font-black text-white mt-2">{card.value}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon size={22} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 border border-white/5 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-white">Recent Placed Orders</h2>
              <p className="text-xs text-slate-400 mt-0.5">Quick lookup of the last 5 transactions</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-pink-500 hover:text-pink-400 flex items-center gap-1.5 transition-colors">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Total</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 font-mono text-xs font-bold text-slate-400 group-hover:text-pink-500 transition-colors">
                        <Link href={`/admin/orders?search=${order.id}`}>
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{order.customerName}</span>
                          <span className="text-xs text-slate-400">{order.customerPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs text-slate-400">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-bold text-white">
                        ₹{order.total.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card p-6 md:p-8 border border-white/5 flex flex-col gap-6 shadow-xl">
          <div>
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Low Stock Alerts</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Products running critically low on inventory</p>
          </div>

          <div className="flex flex-col gap-4 flex-grow">
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 flex-grow text-slate-500 text-sm">
                <PackageCheck size={36} className="text-emerald-500" />
                <span>All products are fully in stock!</span>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1 max-w-[150px]">
                    <span className="text-sm font-semibold text-white truncate">{p.name}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{p.brand}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.stock === 0 ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}>
                      {p.stock} left
                    </span>
                    <Link 
                      href={`/admin/products?edit=${p.id}`}
                      className="text-[10px] text-pink-500 hover:text-pink-400 font-semibold tracking-wider uppercase transition-colors"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
