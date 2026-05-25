'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, Tag, Loader2 } from 'lucide-react';

const colorThemes = {
  pink: 'border-pink-500/20 bg-pink-900/10 shadow-pink-500/5 hover:border-pink-500/40 text-pink-400',
  purple: 'border-purple-500/20 bg-purple-900/10 shadow-purple-500/5 hover:border-purple-500/40 text-purple-400',
};

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        // Only show active offers
        setOffers(data.filter(o => o.active !== false));
      })
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-16">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-pink-500">Exclusive Discounts</span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">Special Deals & Offers</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Grab incredible discounts and combo pricing on tech gear and personalized frames today!
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="text-pink-500 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && offers.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Tag size={40} className="mx-auto mb-4 text-slate-600" />
          <p className="font-semibold text-slate-400">No active offers right now</p>
          <p className="text-xs text-slate-500 mt-1">Check back soon for exciting deals!</p>
        </div>
      )}

      {/* Offers List Grid */}
      {!loading && offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className={`glass-card border p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 relative overflow-hidden ${colorThemes[offer.colorTheme] || colorThemes.pink}`}
            >
              
              {/* Header info */}
              <div className="flex flex-col items-start gap-3 relative z-10">
                <div className="flex items-center justify-between w-full">
                  <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-sm">
                    {offer.badge}
                  </span>
                  <span className="text-2xl font-display font-black text-white bg-white/5 border border-white/5 px-3 py-1.5 rounded-2xl">
                    {offer.discount}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-white text-xl md:text-2xl mt-2">{offer.title}</h3>
                <p className="text-slate-350 text-xs leading-relaxed">{offer.description}</p>
              </div>

              {/* Footer validation & action */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 relative z-10 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-550" />
                  Valid till: {offer.validTill}
                </span>
                
                <Link 
                  href={offer.link}
                  className="flex items-center gap-1 text-white hover:underline font-bold text-xs group"
                >
                  <span>Shop this Offer</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 rounded-full filter blur-[60px] pointer-events-none" />

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
