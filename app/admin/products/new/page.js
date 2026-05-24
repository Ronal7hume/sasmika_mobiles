'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [offerPercent, setOfferPercent] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [color, setColor] = useState('');
  const [stock, setStock] = useState('');
  const [specs, setSpecs] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Update subtypes when category changes
  useEffect(() => {
    if (category) {
      const selected = categories.find(c => c.id === category);
      if (selected && selected.types) {
        setSubtypes(selected.types);
        setType(selected.types[0] || ''); // default to first subtype
      } else {
        setSubtypes([]);
        setType('');
      }
    } else {
      setSubtypes([]);
      setType('');
    }
  }, [category, categories]);

  // Auto calculate offer price when price or offer percent changes
  useEffect(() => {
    const numPrice = parseFloat(price) || 0;
    const numPercent = parseInt(offerPercent) || 0;

    if (numPrice > 0 && numPercent > 0) {
      const calculated = numPrice - (numPrice * numPercent) / 100;
      setOfferPrice(Math.round(calculated).toString());
    } else {
      setOfferPrice('');
    }
  }, [price, offerPercent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !category || !type || !brand || !price || !stock) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        name,
        category,
        type,
        brand,
        price: parseFloat(price) || 0,
        offerPercent: parseInt(offerPercent) || 0,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        color,
        stock: parseInt(stock) || 0,
        specs,
        image: image || '/images/placeholder.jpg',
        featured
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast('Product added successfully! 📦', 'success');
        router.push('/admin/products');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Failed to save product', 'error');
      }
    } catch (err) {
      showToast('An error occurred during submission', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Back Button Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="p-2.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">Add New Product</h1>
          <p className="text-slate-400 text-xs mt-0.5">Register a brand new accessory item to the catalog</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-card border border-white/5 p-6 md:p-8 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Product Name */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product Name <span className="text-red-500">*</span></label>
            <input 
              type="text"
              placeholder="e.g. boAt Rockerz 255 Pro+"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
              required
            />
          </div>

          {/* Brand Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Brand Name <span className="text-red-500">*</span></label>
            <input 
              type="text"
              placeholder="e.g. boAt, OnePlus, Samsung"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
              required
            />
          </div>

          {/* Color Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Color Options</label>
            <input 
              type="text"
              placeholder="e.g. Active Black, Thunder Gray"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
            />
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full text-slate-300"
              required
            >
              <option value="" className="bg-slate-950">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-950 capitalize">{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subtype Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Type / Style <span className="text-red-500">*</span></label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full text-slate-300 disabled:opacity-50"
              disabled={!category}
              required
            >
              <option value="" className="bg-slate-950">Select Category First</option>
              {subtypes.map((typeOption) => (
                <option key={typeOption} value={typeOption} className="bg-slate-950">{typeOption}</option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Base Price (₹) <span className="text-red-500">*</span></label>
            <input 
              type="number"
              placeholder="e.g. 1299"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
              required
            />
          </div>

          {/* Offer % */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Discount Offer (%)</label>
            <input 
              type="number"
              placeholder="e.g. 30"
              value={offerPercent}
              onChange={(e) => setOfferPercent(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
            />
          </div>

          {/* Calculated Offer Price */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 text-slate-400">
              <span>Final Retail Price (₹)</span>
              {offerPrice && <Sparkles size={12} className="text-pink-500" />}
            </label>
            <input 
              type="text"
              placeholder="Calculated automatically..."
              value={offerPrice ? `₹${offerPrice}` : ''}
              className="px-4 py-3 bg-slate-900/30 border border-white/5 rounded-xl text-sm outline-none w-full text-slate-500 cursor-not-allowed font-bold"
              disabled
            />
          </div>

          {/* Initial Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Stock Inventory <span className="text-red-500">*</span></label>
            <input 
              type="number"
              placeholder="e.g. 50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
              required
            />
          </div>

          {/* Image Path Selector */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product Image File Name / Path</label>
            <input 
              type="text"
              placeholder="e.g. /images/products/neckband.jpg (or paste URL)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
            />
          </div>

          {/* Specifications Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product Description / Specifications</label>
            <textarea
              placeholder="e.g. Bluetooth 5.0 | 40H Playtime | Fast Charge support"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full h-32 resize-none"
            />
          </div>

          {/* Featured Product Checkbox */}
          <div className="flex items-center gap-3 md:col-span-2 py-2">
            <input 
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-pink-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm text-slate-300 font-medium cursor-pointer selection:bg-transparent">
              Feature on Homepage (displays in hero highlights section)
            </label>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Save New Product</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
