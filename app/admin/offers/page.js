'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { 
  Tag, Plus, Pencil, Trash2, Save, X, Eye, EyeOff, 
  Sparkles, ArrowRight, Calendar, Loader2, Link2
} from 'lucide-react';

const colorOptions = [
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
];

const badgePresets = [
  '🔥 Hot Deal', '🎁 Combo Deal', '💝 Gift Bundle', '🆕 New Arrival',
  '⚡ Flash Sale', '🌟 Featured', '💰 Budget Pick', '🏷️ Clearance'
];

export default function AdminOffersPage() {
  const { showToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [validTill, setValidTill] = useState('');
  const [badge, setBadge] = useState('');
  const [link, setLink] = useState('/gallery');
  const [colorTheme, setColorTheme] = useState('pink');
  const [active, setActive] = useState(true);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setOffers(data);
    } catch {
      showToast('Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const resetForm = () => {
    setTitle(''); setDescription(''); setDiscount(''); setValidTill('');
    setBadge(''); setLink('/gallery'); setColorTheme('pink'); setActive(true);
    setEditingId(null); setShowForm(false);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (offer) => {
    setTitle(offer.title);
    setDescription(offer.description);
    setDiscount(offer.discount);
    setValidTill(offer.validTill);
    setBadge(offer.badge);
    setLink(offer.link);
    setColorTheme(offer.colorTheme || 'pink');
    setActive(offer.active !== false);
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !discount) {
      showToast('Title and Discount are required', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const body = { title, description, discount, validTill, badge, link, colorTheme, active };
      const isEdit = !!editingId;
      const url = isEdit ? `/api/offers/${editingId}` : '/api/offers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(isEdit ? 'Offer updated! ✨' : 'Offer created! 🎉', 'success');
        resetForm();
        fetchOffers();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to save offer', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this offer permanently?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Offer deleted', 'success');
        fetchOffers();
      } else {
        showToast('Failed to delete offer', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (offer) => {
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...offer, active: !offer.active }),
      });
      if (res.ok) {
        showToast(offer.active ? 'Offer hidden from customers' : 'Offer is now live! 🎯', 'success');
        fetchOffers();
      }
    } catch {
      showToast('Failed to toggle visibility', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
              <Tag size={20} className="text-white" />
            </div>
            Manage Offers
          </h1>
          <p className="text-sm text-slate-400 mt-1">Create, edit and control your promotional offers</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5"
        >
          <Plus size={14} />
          <span>New Offer</span>
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="glass-card border border-white/10 p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-pink-500" />
                {editingId ? 'Edit Offer' : 'Create New Offer'}
              </h2>
              <button onClick={resetForm} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Offer Title *</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mega Headset Sale"
                  className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
                  required
                />
              </div>

              {/* Discount Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Discount Label *</label>
                <input 
                  type="text" value={discount} onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g. 50% OFF, Free Cable, ₹100 OFF"
                  className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea 
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the offer details..."
                  className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full h-20 resize-none"
                />
              </div>

              {/* Badge */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Badge Label</label>
                <input 
                  type="text" value={badge} onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. 🔥 Hot Deal"
                  className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {badgePresets.map(b => (
                    <button 
                      key={b} type="button" onClick={() => setBadge(b)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all ${
                        badge === b 
                          ? 'bg-pink-500/20 border-pink-500/40 text-pink-400' 
                          : 'bg-slate-900/60 border-white/5 text-slate-500 hover:text-slate-300'
                      }`}
                    >{b}</button>
                  ))}
                </div>
              </div>

              {/* Valid Till */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valid Till</label>
                <input 
                  type="text" value={validTill} onChange={(e) => setValidTill(e.target.value)}
                  placeholder="e.g. December 31, 2026"
                  className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
                />
              </div>

              {/* Link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 size={12} /> Shop Link
                </label>
                <input 
                  type="text" value={link} onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /gallery?category=headsets"
                  className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
                />
              </div>

              {/* Color Theme */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color Theme</label>
                <div className="flex gap-3">
                  {colorOptions.map(c => (
                    <button 
                      key={c.value} type="button" onClick={() => setColorTheme(c.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        colorTheme === c.value 
                          ? 'border-pink-500/40 bg-pink-500/10 text-white' 
                          : 'border-white/5 bg-slate-900/40 text-slate-500 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${c.class}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 md:col-span-2">
                <button 
                  type="button" onClick={() => setActive(!active)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${active ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
                <span className="text-xs font-semibold text-slate-400">
                  {active ? '🟢 Live — visible to customers' : '⚫ Hidden — not shown on offers page'}
                </span>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 text-xs font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>{editingId ? 'Update Offer' : 'Create Offer'}</span>
                </button>
                <button
                  type="button" onClick={resetForm}
                  className="px-5 py-3 bg-slate-900 border border-white/5 text-xs font-bold text-slate-400 rounded-xl hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="text-pink-500 animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <div className="glass-card border border-white/5 p-16 text-center">
          <Tag size={40} className="mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400 font-semibold">No offers created yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "New Offer" above to create your first promotional offer</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {offers.map(offer => (
            <div 
              key={offer.id}
              className={`glass-card border border-white/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-white/10 ${
                offer.active === false ? 'opacity-50' : ''
              }`}
            >
              {/* Info */}
              <div className="flex items-center gap-4 flex-grow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0 ${
                  offer.colorTheme === 'purple' 
                    ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' 
                    : 'bg-pink-500/10 border border-pink-500/20 text-pink-400'
                }`}>
                  {offer.discount.substring(0, 3)}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-bold text-white truncate">{offer.title}</span>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                    <span>{offer.badge || 'No badge'}</span>
                    <span>•</span>
                    <span>{offer.discount}</span>
                    <span>•</span>
                    <span>{offer.active !== false ? '🟢 Live' : '⚫ Hidden'}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 truncate">{offer.description}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(offer)}
                  title={offer.active ? 'Hide offer' : 'Show offer'}
                  className="p-2 text-slate-500 hover:text-yellow-400 transition-colors"
                >
                  {offer.active !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => openEditForm(offer)}
                  className="p-2 text-slate-500 hover:text-blue-400 transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  disabled={deletingId === offer.id}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deletingId === offer.id 
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Trash2 size={16} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
