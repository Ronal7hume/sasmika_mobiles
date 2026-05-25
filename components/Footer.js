import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--dark-800)] border-t border-[var(--glass-border)] pt-16 pb-8 text-[var(--white-60)]">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* About Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <span className="font-display text-xl font-extrabold text-[var(--white)]">
              Sasmika <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Mobiles</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--white-60)]">
            Your destination for premium mobile accessories and beautiful customized gift services. We bring quality products and your precious memories to life.
          </p>
        </div>

        {/* Categories / Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-[var(--white)] text-base">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-[var(--white-60)]">
            <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <Link href="/gallery" className="hover:text-pink-500 transition-colors">All Accessories</Link>
            <Link href="/services" className="hover:text-pink-500 transition-colors">Custom Gifts</Link>
            <Link href="/offers" className="hover:text-pink-500 transition-colors">Special Offers</Link>
            <Link href="/about" className="hover:text-pink-500 transition-colors">About Shop</Link>
            <Link href="/contact" className="hover:text-pink-500 transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Accessories Categories */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-[var(--white)] text-base">Accessories</h3>
          <div className="flex flex-col gap-2 text-sm text-[var(--white-60)]">
            <Link href="/gallery?category=headsets" className="hover:text-purple-400 transition-colors">Headsets & Neckbands</Link>
            <Link href="/gallery?category=chargers" className="hover:text-purple-400 transition-colors">Fast Chargers</Link>
            <Link href="/gallery?category=covers" className="hover:text-purple-400 transition-colors">Designer Covers</Link>
            <Link href="/gallery?category=speakers" className="hover:text-purple-400 transition-colors">Bluetooth Speakers</Link>
            <Link href="/gallery?category=services" className="hover:text-purple-400 transition-colors">Custom Mug & Frames</Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-[var(--white)] text-base">Shop Contact</h3>
          <div className="flex flex-col gap-3 text-sm text-[var(--white-60)]">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-pink-500" />
              <a href="tel:8526033272" className="hover:text-[var(--white)] transition-colors">8526033272</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-pink-500" />
              <a href="mailto:sasmikamobiles@gmail.com" className="hover:text-[var(--white)] transition-colors">sasmikamobiles@gmail.com</a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-pink-500 mt-1 shrink-0" />
              <span className="leading-relaxed">7/419, Main Road, Bus Stand, Venkateswarapuram, Alangulam(T.K), Tenkasi(D.t) - 627 854</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-purple-500 mt-1 shrink-0" />
              <div>
                <p>Mon - Sat: 9:00 AM - 10:00 PM</p>
                <p>Sunday: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="container mx-auto px-6 border-t border-[var(--glass-border)] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--white-60)]">
        <p>&copy; {new Date().getFullYear()} Sasmika Mobiles. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
          <span className="text-[var(--white-10)]">|</span>
          <span>Quality Accessories & Customized Prints</span>
        </div>
      </div>
    </footer>
  );
}
