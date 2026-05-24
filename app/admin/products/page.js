'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get('edit');
  const { showToast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load products list
  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        showToast('Failed to load products list', 'error');
      }
    } catch (e) {
      showToast('Error fetching products list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Redirect to edit if edit param is present (for quick restock from dashboard)
  useEffect(() => {
    if (editParam) {
      router.push(`/admin/products/${editParam}/edit`);
    }
  }, [editParam, router]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Product deleted successfully', 'success');
        // Refresh products list locally
        setProducts(products.filter(p => p.id !== deleteId));
      } else {
        showToast(data.error || 'Failed to delete product', 'error');
      }
    } catch (err) {
      showToast('An error occurred during deletion', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Product Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Products Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and edit your store's mobile accessories and stock</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-5 py-3 text-sm font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Control Bar (Search / Filters) */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl max-w-md w-full">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by ID, name, brand, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm bg-transparent text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Product Table List */}
      <div className="glass-card border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold text-xs uppercase tracking-wider bg-slate-950/40">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category / Type</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Package size={48} className="mx-auto text-slate-600 mb-3" />
                    <span>No products found.</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">
                      {p.id}
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-white text-sm">{p.name}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">{p.brand}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-slate-200 capitalize">{p.category}</span>
                        <span className="text-xs text-slate-400">{p.type}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base">
                          ₹{(p.offerPrice || p.price).toLocaleString()}
                        </span>
                        {p.offerPrice && (
                          <span className="text-xs text-slate-400 text-decoration-line-through">
                            ₹{p.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        p.stock <= 5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/product/${p.id}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="View on Live Site"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        
                        <Link 
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={16} />
                        </Link>

                        <button 
                          onClick={() => handleDeleteClick(p.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card max-w-sm w-full p-8 border border-white/5 shadow-2xl flex flex-col gap-6 text-center animate-slideUp">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Delete Product?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to permanently delete this product? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setDeleteId(null)}
                className="py-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/15 flex items-center justify-center transition-all"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
