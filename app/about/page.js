import React from 'react';
import Link from 'next/link';
import { CheckCircle, Phone, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const qualities = [
    { title: 'Tested Premium Brands', desc: 'We only stock original, fully-tested mobile accessories from top manufacturers like boAt, OnePlus, Samsung, JBL, and Spigen.' },
    { title: 'Premium Photo Framing', desc: 'Our customized frames use ultra-high-resolution gloss prints and premium borders, lasting memories for anniversaries and birthdays.' },
    { title: 'Dynamic Magic Mug Prints', desc: 'Our custom-printed heat-sensitive magic mugs change colors instantly when hot drinks are poured, a premium surprise gift choice.' },
    { title: 'Customer First Service', desc: 'We provide immediate local regions home delivery and coordinate customizations directly via friendly WhatsApp interactions.' }
  ];

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-20">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-pink-500">Who We Are</span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">About Sasmika Mobiles</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Your trusted local partner for genuine mobile accessories and stunning personalized printing gifts.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Visual graphic */}
        <div className="lg:col-span-5 bg-gradient-to-r from-pink-900/25 to-purple-900/25 border border-pink-500/20 rounded-3xl p-16 flex items-center justify-center text-8xl shadow-xl relative select-none">
          <span>👑</span>
        </div>

        {/* Content Story */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="font-display text-2xl font-extrabold text-white leading-tight">Our Humble Journey & Promise</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Founded on <span className="text-white font-bold">January 21, 2020</span> with a passion to deliver premium tech gear and customizable printing services to our community, Sasmika Mobiles has grown into a highly trusted regional brand. We believe in providing premium grade accessories and photo printing templates that bring precious smiles to our customers.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Whether you are looking for military-grade protective phone covers, fast wall chargers, noise-cancelling earbuds, or personalized heat-sensitive mugs, name-bracelets, and premium photo frames — we verify every single item to ensure supreme satisfaction!
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link 
              href="/gallery"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3.5 text-xs font-bold text-white rounded-xl shadow-lg transition-all"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* Why choose lists */}
      <section className="flex flex-col gap-10 border-t border-white/5 pt-16">
        <div className="text-center flex flex-col gap-1">
          <h3 className="font-display text-2xl font-extrabold text-white">Why Customers Trust Sasmika</h3>
          <p className="text-slate-400 text-xs mt-0.5">We maintain strict standards for every single product we sell</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qualities.map((q, idx) => (
            <div key={idx} className="glass-card border border-white/5 p-6 shadow-md flex gap-4 items-start hover:border-pink-500/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0 font-bold text-base">
                <CheckCircle size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-white text-sm">{q.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{q.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
