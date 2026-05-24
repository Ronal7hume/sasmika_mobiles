'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!name || !message) {
      showToast('Please fill in both Name and Message fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedMessage = `Hi Sasmika Mobiles! I have a general inquiry:
*Name*: ${name}
*Email*: ${email || 'Not specified'}
*Inquiry*: "${message}"

Please get back to me!`;

      const encoded = encodeURIComponent(formattedMessage);
      const waUrl = `https://wa.me/918526033272?text=${encoded}`;
      
      showToast('Opening WhatsApp Chat...', 'success');
      window.open(waUrl, '_blank');
      
      // Clear message field
      setMessage('');
    } catch (err) {
      showToast('Failed to coordinate WhatsApp send', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    { title: 'Call Us Directly', value: '+91 85260 33272', desc: 'Mon-Sat (9am - 10pm)', icon: Phone, color: 'text-pink-500 bg-pink-500/10' },
    { title: 'Email Inquiries', value: 'sasmikamobiles@gmail.com', desc: 'Immediate replies within 24h', icon: Mail, color: 'text-purple-500 bg-purple-500/10' },
    { title: 'Shop Location', value: 'Sasmika Mobiles', desc: 'Bus stand, Venkateswarapuram, Alangulam, Tenkasi', icon: MapPin, color: 'text-pink-500 bg-pink-500/10' },
    { title: 'Operating Hours', value: '9:00 AM - 10:00 PM', desc: 'Open all days of the week', icon: Clock, color: 'text-purple-500 bg-purple-500/10' }
  ];

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-16">
      
      {/* Title */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-pink-500">Get in Touch</span>
        <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">Contact Us</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Have any questions about custom printing sizes or bulk accessory rates? Shoot us a WhatsApp message!
        </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card border border-white/5 p-6 shadow-md flex flex-col gap-4 hover:border-white/10 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} shrink-0`}>
                <Icon size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="font-display font-bold text-white text-sm">{card.title}</h4>
                <span className="text-sm font-black text-slate-200 mt-1">{card.value}</span>
                <span className="text-xs text-slate-550 leading-relaxed mt-0.5">{card.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Form & Location Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-t border-white/5 pt-16">
        
        {/* Form */}
        <div className="lg:col-span-6 glass-card border border-white/5 p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2 border-b border-white/5 pb-2.5">
            <MessageSquare size={18} className="text-pink-500" />
            <span>Send Direct Message</span>
          </h3>

          <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
            {/* Sender Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Name *</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-350 w-full"
                required
              />
            </div>

            {/* Sender Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-350 w-full"
              />
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message *</label>
              <textarea 
                placeholder="Write your questions about frames, mugs or products stock..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-350 w-full h-28 resize-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Submit to WhatsApp Chat</span>
                  <Send size={12} />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Map Coordinates Mockup */}
        <div className="lg:col-span-6 glass-card border border-white/5 p-6 md:p-8 shadow-xl flex flex-col gap-4 min-h-[300px]">
          <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-2.5">
            Visit Our Retail Shop
          </h3>
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex-grow flex flex-col items-center justify-center gap-4 text-center p-8 select-none relative overflow-hidden">
            <span className="text-6xl animate-bounce">📍</span>
            <div className="z-10 flex flex-col gap-1">
              <span className="font-display font-bold text-white text-base">Sasmika Mobiles Retail Shop</span>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xs mx-auto">
                Bus stand, Main road, Venkateswarapuram, Alangulam(T.K), Tenkasi(D.t). - 627854. Located right at the main bus stand area!
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none" />
          </div>
        </div>

      </div>

    </div>
  );
}
