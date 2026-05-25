'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  ArrowRight, 
  Phone, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ShoppingBag,
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag
} from 'lucide-react';

export default function Home() {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load featured products from dynamic API
  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4)); // Show top 4 featured products
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  // Load active offers for banner slideshow
  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          setOffers(data.filter(o => o.active !== false));
        }
      } catch (err) {
        console.error('Failed to load offers', err);
      }
    }
    loadOffers();
  }, []);

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    if (offers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const categories = [
    { id: 'headsets', name: 'Headsets', icon: '🎧', desc: 'Wired, Neckband & Airpods' },
    { id: 'chargers', name: 'Chargers', icon: '🔌', desc: 'Fast & Wireless Charger' },
    { id: 'covers', name: 'Phone Covers', icon: '📱', desc: 'Custom & Flip Cases' },
    { id: 'cables', name: 'Cables', icon: '🔗', desc: 'Type-C, Lightning & Micro' },
    { id: 'speakers', name: 'Speakers', icon: '🔊', desc: 'Bluetooth & Party Speaker' },
    { id: 'powerbanks', name: 'Power Banks', icon: '🔋', desc: '10000 & 20000 mAh' }
  ];

  const services = [
    { id: 'frames', name: 'Photo Frames', icon: '🖼️', desc: 'Custom photo frames in multiple sizes. Perfect for gifting memories.', price: '₹199', del: '3-5 days' },
    { id: 'mugs', name: 'Mug Printing', icon: '☕', desc: 'Custom printed mugs — magic mugs, white mugs & more.', price: '₹249', del: '2-4 days' },
    { id: 'pillows', name: 'Custom Pillows', icon: '🛋️', desc: 'Personalized photo pillows — a perfect gift for any occasion.', price: '₹399', del: '4-6 days' },
    { id: 'backcase', name: 'Phone Backcase', icon: '📲', desc: 'Custom photo printed phone back cases for all models.', price: '₹299', del: '3-5 days' },
    { id: 'bracelet', name: 'Custom Bracelets', icon: '📿', desc: 'Personalized bracelets with custom names & designs.', price: '₹149', del: '2-3 days' }
  ];

  return (
    <div className="flex flex-col gap-14 overflow-x-hidden relative">
      
      {/* Hero Section */}
      <section className="relative pt-4 pb-10 md:pt-6 md:pb-12 flex items-center min-h-[85vh]">
        {/* Background shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500 rounded-full filter blur-[120px] opacity-15" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500 rounded-full filter blur-[120px] opacity-15" />
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider rounded-full">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span>Premium Tech & Custom Gifts</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              Your One-Stop <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">Mobile</span> Accessories & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Custom Gift</span> Store
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg max-w-lg leading-relaxed">
              Premium mobile accessories, custom photo frames, personalized mug printing, custom phone back cases & pillows. High quality prints at the best prices!
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link 
                href="/gallery"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-8 py-4 text-base font-bold text-white rounded-2xl shadow-lg shadow-pink-500/15 transition-all hover:-translate-y-0.5"
              >
                <span>Shop Accessories</span>
                <ArrowRight size={18} />
              </Link>
              <Link 
                href="/services"
                className="flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all"
              >
                <span>Our Custom Services</span>
              </Link>
            </div>

            {/* Metrics */}
            <div className="flex gap-8 mt-8 border-t border-white/5 pt-8 w-full md:w-auto">
              <div className="flex flex-col">
                <span className="text-2xl font-display font-black text-white">500+</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Branded Gear</span>
              </div>
              <div className="w-[1px] bg-white/5" />
              <div className="flex flex-col">
                <span className="text-2xl font-display font-black text-white">1000+</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Happy Customers</span>
              </div>
              <div className="w-[1px] bg-white/5" />
              <div className="flex flex-col">
                <span className="text-2xl font-display font-black text-white">Since 2020</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Trusted Shop</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-5 hidden lg:flex justify-center relative dark-mockup">
            {/* Phone visualization */}
            <div className="w-80 h-[500px] border-4 border-slate-900 rounded-[50px] bg-slate-950 shadow-2xl relative p-3 overflow-hidden ring-4 ring-white/5 flex items-center justify-center">
              <div className="absolute top-0 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
              {/* Screen Content */}
              <div className="w-full h-full rounded-[40px] bg-slate-900/60 p-4 flex flex-col justify-between border border-white/5 relative z-10">
                <span className="text-4xl text-center block mt-12 animate-bounce">📱</span>
                <div className="flex flex-col gap-2 bg-slate-950/70 backdrop-blur-md p-4 border border-white/5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">Premium Shop</span>
                  <h4 className="text-sm font-bold text-white leading-tight">Sasmika Mobiles</h4>
                  <p className="text-[10px] text-slate-400">Order customized frames, mugs, and tech gear via WhatsApp checkout!</p>
                </div>
              </div>
            </div>

            {/* Floating Tags */}
            <div className="absolute -top-4 -left-6 bg-slate-900/80 backdrop-blur-md border border-pink-500/20 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm text-white font-bold animate-pulse">
              <span>🎧</span> Headsets
            </div>
            <div className="absolute top-1/3 -right-6 bg-slate-900/80 backdrop-blur-md border border-purple-500/20 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm text-white font-bold animate-pulse delay-75">
              <span>🖼️</span> Custom Frames
            </div>
            <div className="absolute bottom-1/4 -left-8 bg-slate-900/80 backdrop-blur-md border border-purple-500/20 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm text-white font-bold animate-pulse delay-150">
              <span>☕</span> Magic Mugs
            </div>
            <div className="absolute -bottom-4 right-2 bg-slate-900/80 backdrop-blur-md border border-pink-500/20 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm text-white font-bold animate-pulse delay-200">
              <span>📲</span> Custom Cases
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Offers Banner Slideshow ═══════ */}
      {offers.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-pink-500/5 border border-white/5">
            
            {/* Slides Container */}
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {offers.map((offer, idx) => (
                <div 
                  key={offer.id}
                  className={`w-full shrink-0 relative ${
                    offer.colorTheme === 'purple'
                      ? 'bg-gradient-to-r from-purple-950 via-purple-900/80 to-slate-950'
                      : 'bg-gradient-to-r from-pink-950 via-pink-900/80 to-slate-950'
                  }`}
                >
                  {/* Glow Effects */}
                  <div className={`absolute top-0 left-0 w-72 h-72 rounded-full filter blur-[120px] opacity-20 pointer-events-none ${
                    offer.colorTheme === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-72 h-72 rounded-full filter blur-[120px] opacity-10 pointer-events-none ${
                    offer.colorTheme === 'purple' ? 'bg-pink-500' : 'bg-purple-500'
                  }`} />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 md:px-14 md:py-14">
                    {/* Left Content */}
                    <div className="flex flex-col items-start gap-4 max-w-lg">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 bg-white/10 border border-white/10 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                          {offer.badge}
                        </span>
                        {offer.validTill && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Calendar size={10} /> Valid till: {offer.validTill}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-2xl md:text-4xl font-black text-white leading-tight">
                        {offer.title}
                      </h2>
                      <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                        {offer.description}
                      </p>
                      <Link 
                        href={offer.link || '/offers'}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 text-sm font-bold text-white rounded-xl shadow-lg shadow-pink-500/15 transition-all hover:-translate-y-0.5 mt-2"
                      >
                        <span>Shop this Offer</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>

                    {/* Right — Big Discount Badge */}
                    <div className="flex items-center justify-center shrink-0">
                      <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center border-2 shadow-2xl ${
                        offer.colorTheme === 'purple'
                          ? 'bg-purple-500/10 border-purple-500/30 shadow-purple-500/10'
                          : 'bg-pink-500/10 border-pink-500/30 shadow-pink-500/10'
                      }`}>
                        <span className="font-display text-2xl md:text-3xl font-black text-white text-center leading-tight px-2">
                          {offer.discount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {offers.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentSlide(prev => prev === 0 ? offers.length - 1 : prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-black/50 transition-all z-20"
                  aria-label="Previous offer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentSlide(prev => (prev + 1) % offers.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-black/50 transition-all z-20"
                  aria-label="Next offer"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {offers.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {offers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? 'w-8 h-2.5 bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to offer ${idx + 1}`}
                  />
                ))}
              </div>
            )}

          </div>
        </section>
      )}

      {/* Shop By Category */}
      <section className="container mx-auto px-6 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-500">Catalog Collections</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Shop By Category</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">Browse through our vast catalog of top accessory products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((c) => (
            <Link 
              key={c.id} 
              href={`/gallery?category=${c.id}`}
              className="glass-card p-6 border border-white/5 hover:border-pink-500/40 text-center flex flex-col gap-4 items-center justify-center transition-all hover:-translate-y-1.5 shadow-lg group relative overflow-hidden"
            >
              <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{c.icon}</div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display font-bold text-white text-base group-hover:text-pink-400 transition-colors">{c.name}</h3>
                <span className="text-[10px] text-slate-500 leading-tight">{c.desc}</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 transform translate-y-1 group-hover:translate-y-0 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      {!isLoading && featuredProducts.length > 0 && (
        <section className="container mx-auto px-6 flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-500">Trending Accessories</span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Featured Products</h2>
              <p className="text-slate-400 text-sm max-w-xs">Curated recommendations and best-sellers this week</p>
            </div>
            <Link 
              href="/gallery" 
              className="text-sm font-bold text-pink-500 hover:text-pink-400 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const fav = isFavorite(p.id);
              return (
                <div 
                  key={p.id} 
                  className="glass-card border border-white/5 overflow-hidden shadow-xl hover:border-pink-500/30 hover:shadow-pink-500/5 transition-all hover:-translate-y-1.5 flex flex-col justify-between group relative"
                >
                  {/* Image */}
                  <Link href={`/product/${p.id}`} className="block bg-slate-900/60 p-6 flex items-center justify-center min-h-[180px] relative overflow-hidden">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {p.category === 'headsets' ? '🎧' : p.category === 'chargers' ? '🔌' : p.category === 'covers' ? '📱' : p.category === 'cables' ? '🔗' : '🔋'}
                    </span>
                    {p.offerPercent > 0 && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white rounded-full">
                        -{p.offerPercent}% OFF
                      </span>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{p.brand}</span>
                      <h3 className="font-display font-bold text-white text-base truncate">
                        <Link href={`/product/${p.id}`} className="hover:text-pink-500 transition-colors">
                          {p.name}
                        </Link>
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.specs}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      {/* Price */}
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

                      {/* Action */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleFavorite(p.id)}
                          className={`p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-all ${
                            fav ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : ''
                          }`}
                        >
                          <Heart size={16} className={fav ? 'fill-pink-500 text-pink-500' : ''} />
                        </button>
                        <button 
                          onClick={() => addToCart(p, 1)}
                          className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-all"
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
        </section>
      )}

      {/* Printing Services Highlights */}
      <section className="container mx-auto px-6 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-500">Customized Gifts & Printing</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">Our Printing Services</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">Create beautiful memories with our personalized gift printing services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 3).map((s) => (
            <div 
              key={s.id}
              className="glass-card border border-white/5 overflow-hidden shadow-xl flex flex-col justify-between hover:border-purple-500/30 transition-all hover:-translate-y-1"
            >
              <div className="p-6 bg-slate-900/60 flex items-center justify-center min-h-[140px] text-6xl">
                {s.icon}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-extrabold text-white text-lg">{s.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{s.desc}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-semibold text-slate-400">
                  <span>Starting {s.price}</span>
                  <span>📦 Delivery: {s.del}</span>
                </div>

                <Link 
                  href="/services"
                  className="mt-2 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-center text-xs rounded-xl shadow-md transition-all"
                >
                  Customise & Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link 
            href="/services"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white font-bold text-sm transition-colors"
          >
            <span>View All Custom Gifts</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Offers Banner Card */}
      <section className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-pink-500/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500 rounded-full filter blur-[150px] opacity-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500 rounded-full filter blur-[150px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-start gap-3">
              <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-400 text-xs font-extrabold uppercase rounded-full tracking-wide">
                🔥 Limited Hot Offer
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Mega Mobile accessories & Gift Sale
              </h2>
              <p className="text-slate-300 text-sm max-w-md">
                Get up to 50% discount on Bluetooth Headsets, Fast Chargers, and amazing combo orders on Mugs and Photo Frames!
              </p>
            </div>
            
            <Link 
              href="/offers"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-pink-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              Inspect Active Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-6 bg-slate-950/40 border border-white/5 rounded-3xl py-12 px-8 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0 font-bold text-xl">
              ✅
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-white text-sm">Tested Quality</h4>
              <p className="text-slate-500 text-xs">Genuine and inspected high brand products only</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0 font-bold text-xl">
              💰
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-white text-sm">Best Local Pricing</h4>
              <p className="text-slate-500 text-xs">Highly competitive local wholesale rates</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0 font-bold text-xl">
              🚚
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-white text-sm">Express Deliveries</h4>
              <p className="text-slate-500 text-xs">Lightning fast packaging and regional deliveries</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0 font-bold text-xl">
              💬
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-white text-sm">WhatsApp Care</h4>
              <p className="text-slate-500 text-xs">Direct chat communication with the store owner</p>
            </div>
          </div>

        </div>
      </section>

      {/* Floating WhatsApp Widget */}
      <a 
        href="https://wa.me/918526033272?text=Hi%20Sasmika%20Mobiles!%20I'm%20interested%20in%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105"
        title="Chat on WhatsApp"
      >
        <span className="text-2xl">💬</span>
      </a>

    </div>
  );
}
