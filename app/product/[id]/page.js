'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Sparkles, 
  Check, 
  Share2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProductDetails() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const productData = await res.json();
          setProduct(productData);

          // Load related products of same category
          const relatedRes = await fetch(`/api/products?category=${productData.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            // Filter out current product
            setRelated(relatedData.filter(p => p.id !== id).slice(0, 4));
          }
        } else {
          showToast('Product not found in catalog', 'error');
          router.push('/gallery');
        }
      } catch (err) {
        showToast('Error loading details', 'error');
        router.push('/gallery');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProductDetails();
    }
  }, [id, router, showToast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Sasmika Mobiles!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard! 🔗', 'info');
    }
  };

  const handleWhatsAppOrder = () => {
    const finalPrice = product.offerPrice || product.price;
    const message = `Hi Sasmika Mobiles! I want to order this product:
*Name*: ${product.name}
*Brand*: ${product.brand}
*Color*: ${product.color || 'Default'}
*Price*: ₹${finalPrice.toLocaleString()}
*Quantity*: ${quantity}
*Total*: ₹${(finalPrice * quantity).toLocaleString()}

Is this product in stock?`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/918526033272?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Specifications...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isFav = isFavorite(product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-16">
      
      {/* Back button link */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <Link 
          href="/gallery"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Gallery</span>
        </Link>
        <button 
          onClick={handleShare}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-colors flex items-center gap-2 text-xs"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Large visual representation */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 rounded-3xl p-12 min-h-[300px] flex items-center justify-center text-8xl shadow-xl relative select-none">
          <span>
            {product.category === 'headsets' ? '🎧' : product.category === 'chargers' ? '🔌' : product.category === 'covers' ? '📱' : product.category === 'cables' ? '🔗' : product.category === 'speakers' ? '🔊' : product.category === 'powerbanks' ? '🔋' : product.category === 'tempered' ? '🛡️' : '🗜️'}
          </span>
          {product.offerPercent > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-bold text-white rounded-full">
              {product.offerPercent}% OFF
            </span>
          )}
        </div>

        {/* Content details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-purple-400 font-extrabold uppercase tracking-widest">{product.brand}</span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 capitalize mt-2">
              <span className="px-2.5 py-0.5 rounded bg-white/5">{product.category}</span>
              <span>•</span>
              <span>{product.type}</span>
              {product.color && (
                <>
                  <span>•</span>
                  <span>Color: {product.color}</span>
                </>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 border-t border-b border-white/5 py-4">
            <span className="text-3xl font-display font-black text-white">
              ₹{(product.offerPrice || product.price).toLocaleString()}
            </span>
            {product.offerPrice && (
              <>
                <span className="text-lg text-slate-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-pink-500">
                  You Save: ₹{(product.price - product.offerPrice).toLocaleString()} ({product.offerPercent}%)
                </span>
              </>
            )}
          </div>

          {/* Specs */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features & Specifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
              {product.specs.split('|').map((spec, index) => (
                <div key={index} className="flex gap-2.5 items-start p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                  <Check size={16} className="text-pink-500 shrink-0 mt-0.5" />
                  <span>{spec.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory stock levels warning */}
          <div className="flex items-center gap-2 text-xs font-bold mt-2">
            {isOutOfStock ? (
              <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Out of Stock - Restocking Soon
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <AlertTriangle size={12} />
                Only {product.stock} items left in stock!
              </span>
            ) : (
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                In Stock & Ready to Deliver
              </span>
            )}
          </div>

          {/* Cart Quantity Controls & Action Buttons */}
          {!isOutOfStock && (
            <div className="flex flex-wrap items-center gap-6 mt-4">
              {/* Quantity */}
              <div className="flex items-center bg-slate-900 border border-white/5 rounded-xl px-4 py-2 shrink-0 select-none">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-lg font-bold text-slate-400 hover:text-white px-2 py-1"
                >
                  -
                </button>
                <span className="text-sm font-bold text-white px-4">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-lg font-bold text-slate-400 hover:text-white px-2 py-1"
                >
                  +
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-grow">
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-4 text-sm font-bold text-white rounded-2xl transition-all flex-grow whitespace-nowrap"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-4 rounded-2xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all ${
                    isFav ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : ''
                  }`}
                >
                  <Heart size={18} className={isFav ? 'fill-pink-500 text-pink-500' : ''} />
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Direct order button */}
          {!isOutOfStock && (
            <button 
              onClick={handleWhatsAppOrder}
              className="mt-2 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <span>Instant Buy via WhatsApp Checkout</span>
              <span>💬</span>
            </button>
          )}

        </div>

      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="flex flex-col gap-8 border-t border-white/5 pt-16">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-extrabold text-white">Related Products</h2>
            <p className="text-slate-400 text-xs mt-0.5">Other popular accessories in the {product.category} catalog</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => {
              const fav = isFavorite(p.id);
              return (
                <div 
                  key={p.id} 
                  className="glass-card border border-white/5 overflow-hidden shadow-xl hover:border-pink-500/30 transition-all hover:-translate-y-1.5 flex flex-col justify-between group"
                >
                  <Link href={`/product/${p.id}`} className="block bg-slate-900/60 p-6 flex items-center justify-center min-h-[160px] text-5xl group-hover:scale-105 transition-transform duration-300">
                    {p.category === 'headsets' ? '🎧' : p.category === 'chargers' ? '🔌' : p.category === 'covers' ? '📱' : p.category === 'cables' ? '🔗' : '🔋'}
                  </Link>

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
                      <span className="font-bold text-white text-sm">
                        ₹{(p.offerPrice || p.price).toLocaleString()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => toggleFavorite(p.id)}
                          className={`p-1.5 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all ${
                            fav ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : ''
                          }`}
                        >
                          <Heart size={14} className={fav ? 'fill-pink-500 text-pink-500' : ''} />
                        </button>
                        <button 
                          onClick={() => addToCart(p, 1)}
                          disabled={p.stock === 0}
                          className="p-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg transition-all disabled:opacity-50"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
