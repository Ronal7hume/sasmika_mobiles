'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, Mail, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'When you place an order, we collect your name, phone number, email address (optional), and delivery address.',
        'We may collect device and browser information for improving our website experience.',
        'No payment card data is collected or stored — all payments are handled via WhatsApp coordination and direct bank transfers.'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To process and fulfill your product orders and custom printing requests.',
        'To communicate with you about your order status via WhatsApp or phone.',
        'To improve our services, website functionality, and product offerings.',
        'To send promotional offers and deals (only if you opt in).'
      ]
    },
    {
      icon: Lock,
      title: 'Data Protection & Security',
      content: [
        'All customer data is stored securely and accessed only by authorized Sasmika Mobiles staff.',
        'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
        'We implement reasonable security measures to protect against unauthorized access, alteration, or destruction of data.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'You have the right to access, update, or request deletion of your personal data at any time.',
        'You can opt out of promotional messages by contacting us directly.',
        'You may request a copy of the data we hold about you by emailing us.'
      ]
    },
    {
      icon: Shield,
      title: 'Cookies & Tracking',
      content: [
        'Our website uses essential cookies to remember your cart items and login sessions.',
        'We do not use third-party advertising cookies or trackers.',
        'You can disable cookies in your browser settings, though some features may not work properly.'
      ]
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: [
        'If you have any questions about our privacy practices, please contact us:',
        'Email: sasmikamobiles@gmail.com',
        'Phone: +91 85260 33272',
        'Address: 7/419, Main Road, Bus Stand, Venkateswarapuram, Alangulam(T.K), Tenkasi(D.t) - 627 854'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-16 max-w-4xl">
      
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-pink-500 transition-colors mx-auto mb-4">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-center mx-auto">
          <Shield size={28} className="text-pink-500" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black text-white leading-tight">Privacy Policy</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
          At Sasmika Mobiles, we value your privacy and are committed to protecting your personal information. 
          This policy explains how we collect, use, and safeguard your data.
        </p>
        <span className="text-xs text-slate-600 font-medium mt-2">Last updated: May 25, 2026</span>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div 
              key={idx} 
              className="glass-card border border-white/5 p-6 md:p-8 shadow-lg hover:border-pink-500/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={18} className="text-pink-500" />
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="font-display text-lg font-bold text-white">{section.title}</h2>
                  <ul className="flex flex-col gap-2.5">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-slate-400 text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-pink-500/60 mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center border-t border-white/5 pt-8">
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          This privacy policy is effective as of January 21, 2020 and will remain in effect until modified. 
          We reserve the right to update this policy at any time. Changes will be posted on this page.
        </p>
        <p className="text-xs text-slate-600 mt-3">
          © {new Date().getFullYear()} Sasmika Mobiles. All rights reserved.
        </p>
      </div>

    </div>
  );
}
