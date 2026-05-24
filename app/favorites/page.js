'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Filter to only matching favorited product ids
          setProducts(data.filter(p => favorites.includes(p.id)));
        }
      } catch (err) {
        console.error('Failed to fetch catalog', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [favorites]);

  const handleMoveToCart = (p) => {
    addToCart(p, 1);
    toggleFavorite(p.id); // remove from wishlist after moving to cart
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Wishlist...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 flex flex-col items-center justify-center gap-6 text-center text-slate-500">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-4xl">
          ❤️
        </div>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white">Your Wishlist is Empty</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Save accessories here that you love. Click the heart icon on catalog cards to populate this list!
          </p>
        </div>
        <Link 
          href="/gallery"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3.5 text-xs font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5"
        >
          <span>Explore Catalog</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-10">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">My Favorites</h1>
        <p className="text-slate-400 text-sm mt-1">You have saved {products.length} products to your wishlist</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div 
            key={p.id} 
            className="glass-card border border-white/5 overflow-hidden shadow-xl hover:border-pink-500/30 transition-all hover:-translate-y-1 flex flex-col justify-between group"
          >
            {/* Image */}
            <div className="relative bg-slate-900/60 p-6 flex items-center justify-center min-h-[160px] text-5xl">
              <span>
                {p.category === 'headsets' ? '🎧' : p.category === 'chargers' ? '🔌' : p.category === 'covers' ? '📱' : p.category === 'cables' ? '🔗' : '🔋'}
              </span>
              <button 
                onClick={() => toggleFavorite(p.id)}
                className="absolute top-3 right-3 p-2 bg-slate-950/80 hover:bg-red-500/10 border border-white/5 rounded-lg text-red-400 transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-[9px] text-purple-400 font-bold uppercase">{p.brand}</span>
                <h3 className="font-display font-bold text-white text-sm truncate mt-0.5">
                  <Link href={`/product/${p.id}`} className="hover:text-pink-500 transition-colors">
                    {p.name}
                  </Link>
                </h3>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-bold text-white text-base">
                  ₹{(p.offerPrice || p.price).toLocaleString()}
                </span>

                <button 
                  onClick={() => handleMoveToCart(p)}
                  disabled={p.stock === 0}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <ShoppingCart size={12} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
