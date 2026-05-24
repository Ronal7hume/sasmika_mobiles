'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { 
  Sparkles, 
  Calendar, 
  Smile, 
  Image as ImageIcon,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function ServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Customizer state
  const [selectedSize, setSelectedSize] = useState('6x4 inch');
  const [selectedMugType, setSelectedMugType] = useState('White Mug');
  const [customText, setCustomText] = useState('');
  const [photoInfo, setPhotoInfo] = useState('');

  // Live prices calculation
  const getFramePrice = () => {
    switch (selectedSize) {
      case '6x4 inch': return 199;
      case '8x6 inch': return 299;
      case '10x8 inch': return 399;
      case '12x10 inch': return 549;
      case 'A4 Size': return 699;
      case 'A3 Size': return 999;
      default: return 199;
    }
  };

  const getMugPrice = () => {
    switch (selectedMugType) {
      case 'White Mug': return 249;
      case 'Inner Color Mug': return 299;
      case 'Color Changing Mug': return 349;
      case 'Magic Mug': return 399;
      default: return 249;
    }
  };

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleWhatsAppOrder = (service) => {
    let finalPrice = service.price;
    let customizationStr = '';

    if (service.type === 'frame') {
      finalPrice = getFramePrice();
      customizationStr = `\n- *Size Selected*: ${selectedSize}`;
    } else if (service.type === 'mug') {
      finalPrice = getMugPrice();
      customizationStr = `\n- *Mug Type Selected*: ${selectedMugType}`;
    }

    if (customText) {
      customizationStr += `\n- *Custom Text/Names*: "${customText}"`;
    }
    if (photoInfo) {
      customizationStr += `\n- *Photo Specification*: "${photoInfo}"`;
    }

    const message = `Hi Sasmika Mobiles! I want to order this custom print service:
*Service*: ${service.name}
*Price*: ₹${finalPrice.toLocaleString()}
*Delivery Estimation*: ${service.deliveryDays} days${customizationStr}

Please let me know how to share my photos and pay!`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/918526033272?text=${encodedText}`;
    window.open(waUrl, '_blank');
    showToast('Redirecting to WhatsApp Checkout...', 'success');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-16">
      
      {/* Headings */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-pink-500">Custom Printing & Gifts</span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">Our Printing Services</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Order high-quality customized gifts. Choose your options, add custom text/notes, and checkout instantly to WhatsApp!
        </p>
      </div>

      {/* Services List Grid */}
      <div className="flex flex-col gap-12">
        {services.map((service) => {
          const isFrame = service.type === 'frame';
          const isMug = service.type === 'mug';
          
          return (
            <div 
              key={service.id} 
              className="glass-card border border-white/5 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8"
              id={service.type}
            >
              {/* Icon / Image representation */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-7xl p-8 min-h-[180px] shadow-inner select-none relative">
                <span>{service.icon}</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-4">
                  {service.name}
                </span>
              </div>

              {/* Specification Form */}
              <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                
                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-extrabold text-white text-xl md:text-2xl">{service.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-1">{service.description}</p>
                </div>

                {/* Customized Variables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 border border-white/5 rounded-xl text-sm">
                  
                  {/* Photo Frame Sizes */}
                  {isFrame && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Frame Size</label>
                      <select 
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-slate-300 outline-none w-full"
                      >
                        {service.sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Mug Printing Types */}
                  {isMug && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Mug Type</label>
                      <select 
                        value={selectedMugType}
                        onChange={(e) => setSelectedMugType(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-white/5 rounded-lg text-slate-300 outline-none w-full"
                      >
                        {service.mugTypes.map(mType => (
                          <option key={mType} value={mType}>{mType}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Custom names/text */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Custom Text / Names</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Happy Anniversary, Raja & Anu"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-lg text-slate-300 outline-none w-full"
                    />
                  </div>

                  {/* Photo attachments specification notes */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Photo Description / Notes</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Use a collage layout of 5 photos, bright color background"
                      value={photoInfo}
                      onChange={(e) => setPhotoInfo(e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-lg text-slate-300 outline-none w-full"
                    />
                  </div>

                </div>

                {/* Footer price & WhatsApp action */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estimated Price</span>
                    <span className="text-2xl font-display font-black text-white mt-0.5">
                      ₹{
                        isFrame ? getFramePrice().toLocaleString() :
                        isMug ? getMugPrice().toLocaleString() :
                        service.price.toLocaleString()
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <span>📦 Ready: {service.deliveryDays} Days</span>
                  </div>

                  <button 
                    onClick={() => handleWhatsAppOrder(service)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3.5 text-xs font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5 whitespace-nowrap self-stretch sm:self-auto"
                  >
                    <span>Customize & Order via WhatsApp</span>
                    <span>💬</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
