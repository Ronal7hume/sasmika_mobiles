'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  SlidersHorizontal,
  X,
  PackageX
} from 'lucide-react';

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter and Search states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(catParam || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync category param from URL
  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
      setSelectedType('all');
    }
  }, [catParam]);

  // Load products & categories
  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (productsRes.ok && categoriesRes.ok) {
          const productsData = await productsRes.json();
          const categoriesData = await categoriesRes.json();
          
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Failed to load gallery items', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update types list when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const matched = categories.find(c => c.id === selectedCategory);
      if (matched && matched.types) {
        setTypes(matched.types);
      } else {
        setTypes([]);
      }
    } else {
      setTypes([]);
    }
    setSelectedType('all');
  }, [selectedCategory, categories]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setMobileFiltersOpen(false);
    // Update URL quietly
    if (catId === 'all') {
      router.push('/gallery', { scroll: false });
    } else {
      router.push(`/gallery?category=${catId}`, { scroll: false });
    }
  };

  // Perform filtering and sorting
  let processedProducts = [...products];

  if (selectedCategory !== 'all') {
    processedProducts = processedProducts.filter(p => p.category === selectedCategory);
  }
  if (selectedType !== 'all') {
    processedProducts = processedProducts.filter(p => p.type === selectedType);
  }
  if (search) {
    const q = search.toLowerCase();
    processedProducts = processedProducts.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.specs.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sortBy === 'price-low') {
    processedProducts.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
  } else if (sortBy === 'price-high') {
    processedProducts.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
  } else if (sortBy === 'rating') {
    processedProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // Default/Featured - products with featured: true first
    processedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Accessories Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-8">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">Accessories Catalog</h1>
        <p className="text-slate-400 text-sm mt-1">Explore our range of premium mobile items and gear</p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border border-white/5 focus-within:border-pink-500/40 rounded-2xl w-full md:max-w-md transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search headsets, charger brands, covers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Sort & Mobile Filters button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0">
          <button 
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-5 py-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-300 hover:text-white transition-colors"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap hidden sm:inline">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-sm font-medium outline-none text-slate-300 w-full sm:w-auto"
            >
              <option value="featured" className="bg-slate-950">Recommended</option>
              <option value="price-low" className="bg-slate-950">Price: Low to High</option>
              <option value="price-high" className="bg-slate-950">Price: High to Low</option>
              <option value="rating" className="bg-slate-950">Top Rated</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-6 shrink-0 sticky top-24 self-start">
          {/* Categories Filter */}
          <div className="glass-card p-6 border border-white/5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-2.5">Category</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize flex items-center justify-between ${
                    selectedCategory === c.id
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white font-bold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-xs opacity-75">{c.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subtype Filter (if category selected) */}
          {selectedCategory !== 'all' && types.length > 0 && (
            <div className="glass-card p-6 border border-white/5 flex flex-col gap-4">
              <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-2.5">Product Type</h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white font-bold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  All Types
                </button>
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedType === t
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white font-bold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {processedProducts.length === 0 ? (
            <div className="glass-card border border-white/5 py-24 flex flex-col items-center justify-center gap-4 text-center text-slate-500">
              <PackageX size={60} className="text-slate-700 animate-bounce" />
              <div>
                <h3 className="font-display text-lg font-bold text-white">No Products Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  We couldn't find any products matching your specific combinations. Try modifying your search query or category filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {processedProducts.map((p) => {
                const isFav = isFavorite(p.id);
                return (
                  <div 
                    key={p.id} 
                    className="glass-card border border-white/5 overflow-hidden shadow-xl hover:border-pink-500/30 transition-all hover:-translate-y-1.5 flex flex-col justify-between group relative"
                  >
                    {/* Image */}
                    <Link href={`/product/${p.id}`} className="block bg-slate-900/40 p-6 flex items-center justify-center min-h-[200px] relative overflow-hidden">
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {p.category === 'headsets' ? '🎧' : p.category === 'chargers' ? '🔌' : p.category === 'covers' ? '📱' : p.category === 'cables' ? '🔗' : p.category === 'speakers' ? '🔊' : p.category === 'powerbanks' ? '🔋' : p.category === 'tempered' ? '🛡️' : '🗜️'}
                      </span>
                      {p.offerPercent > 0 && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white rounded-full">
                          -{p.offerPercent}% OFF
                        </span>
                      )}
                      {p.stock === 0 && (
                        <span className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center font-bold text-xs text-red-400">
                          OUT OF STOCK
                        </span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-purple-400">{p.brand}</span>
                          <span className="text-slate-500">{p.type}</span>
                        </div>
                        <h3 className="font-display font-bold text-white text-base truncate mt-0.5">
                          <Link href={`/product/${p.id}`} className="hover:text-pink-500 transition-colors">
                            {p.name}
                          </Link>
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{p.specs}</p>
                      </div>

                      {/* Footer price & cart */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-lg">
                            ₹{(p.offerPrice || p.price).toLocaleString()}
                          </span>
                          {p.offerPrice && (
                            <span className="text-xs text-slate-500 line-through">
                              ₹{p.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleFavorite(p.id)}
                            className={`p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-all ${
                              isFav ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : ''
                            }`}
                          >
                            <Heart size={16} className={isFav ? 'fill-pink-500 text-pink-500' : ''} />
                          </button>
                          <button 
                            onClick={() => addToCart(p, 1)}
                            disabled={p.stock === 0}
                            className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Filters modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-80 h-full bg-slate-950 border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto animate-slideIn">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-display font-extrabold text-white text-lg">Sidebar Filters</h3>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider">Categories</h4>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                    selectedCategory === 'all' ? 'bg-white/10 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryClick(c.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                      selectedCategory === c.id ? 'bg-white/10 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs">{c.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtypes */}
            {selectedCategory !== 'all' && types.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider">Subtypes</h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setSelectedType('all');
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                      selectedType === 'all' ? 'bg-white/10 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    All Types
                  </button>
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedType(t);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                        selectedType === t ? 'bg-white/10 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
