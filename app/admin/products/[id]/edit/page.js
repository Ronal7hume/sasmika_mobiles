'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Save, Sparkles, Upload, ImagePlus, X, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);

  // Handle image file upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid image type. Use JPEG, PNG, WebP, GIF or SVG.', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image too large. Max size is 5MB.', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setImage(data.path);
        showToast('Image uploaded successfully! 📸', 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Upload error. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Load categories and initial product details
  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesRes, productRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${id}`)
        ]);

        if (categoriesRes.ok && productRes.ok) {
          const categoriesData = await categoriesRes.json();
          const product = await productRes.json();

          setCategories(categoriesData);
          
          // Seed form details
          setName(product.name || '');
          setCategory(product.category || '');
          setBrand(product.brand || '');
          setPrice(product.price !== undefined ? product.price.toString() : '');
          setOfferPercent(product.offerPercent !== undefined ? product.offerPercent.toString() : '');
          setOfferPrice(product.offerPrice !== undefined && product.offerPrice !== null ? product.offerPrice.toString() : '');
          setColor(product.color || '');
          setStock(product.stock !== undefined ? product.stock.toString() : '');
          setSpecs(product.specs || '');
          setImage(product.image || '');
          setFeatured(product.featured === true || product.featured === 'true');

          // Seed sub-types specifically
          const selected = categoriesData.find(c => c.id === product.category);
          if (selected && selected.types) {
            setSubtypes(selected.types);
            setType(product.type || '');
          }
        } else {
          showToast('Failed to load product details', 'error');
          router.push('/admin/products');
        }
      } catch (err) {
        showToast('Error loading details from API', 'error');
        router.push('/admin/products');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id, router, showToast]);

  // Update subtypes when category changes
  useEffect(() => {
    if (category && categories.length > 0) {
      const selected = categories.find(c => c.id === category);
      if (selected && selected.types) {
        setSubtypes(selected.types);
        // Avoid overriding the initially seeded type
        if (!type || !selected.types.includes(type)) {
          setType(selected.types[0] || '');
        }
      } else {
        setSubtypes([]);
        setType('');
      }
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

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast('Product updated successfully! ✨', 'success');
        router.push('/admin/products');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Failed to save product edits', 'error');
      }
    } catch (err) {
      showToast('An error occurred during submission', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Product details...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="font-display text-2xl font-extrabold text-white">Edit Product: {id}</h1>
          <p className="text-slate-400 text-xs mt-0.5">Modify specifications and inventory level</p>
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
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full text-slate-300"
              required
            >
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
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product Image</label>
              <button
                type="button"
                onClick={() => setUseUrlMode(!useUrlMode)}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                {useUrlMode ? <><ImagePlus size={12} /> Upload File</> : <><Link2 size={12} /> Paste URL</>}
              </button>
            </div>

            {useUrlMode ? (
              <input 
                type="text"
                placeholder="e.g. https://example.com/image.jpg or /uploads/photo.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="px-4 py-3 bg-slate-900/60 border border-white/5 focus:border-pink-500/40 rounded-xl text-sm outline-none w-full"
              />
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !isUploading && document.getElementById('edit-product-image-input')?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 min-h-[180px] ${
                  isDragging
                    ? 'border-pink-500 bg-pink-500/5 scale-[1.01]'
                    : image
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/10 bg-slate-900/30 hover:border-pink-500/30 hover:bg-slate-900/50'
                }`}
              >
                <input
                  id="edit-product-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = '';
                  }}
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-pink-500 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Uploading image...</span>
                  </div>
                ) : image ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="relative group">
                      <img
                        src={image}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-xl border border-white/10 shadow-lg"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImage(''); }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Image ready — click to replace</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-xs">{image}</span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-center">
                      <Upload size={24} className="text-pink-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-300">Drag & drop your image here</p>
                      <p className="text-[10px] text-slate-500 mt-1">or click to browse — JPEG, PNG, WebP, GIF up to 5MB</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Specifications Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product Description / Specifications</label>
            <textarea
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
                  <span>Update Product Details</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
