'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  ShoppingBag,
  Send,
  User,
  Phone,
  MapPin,
  Mail
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    clearCart,
    currentUser
  } = useCart();

  // Buyer Form details
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  
  const [isPlacing, setIsPlacing] = useState(false);

  const deliveryCharge = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 50;
  const grandTotal = cartSubtotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your shopping cart is empty!', 'warning');
      return;
    }

    if (!customerName || !customerPhone || !customerAddress) {
      showToast('Please fill in Name, Phone, and Delivery Address', 'warning');
      return;
    }

    setIsPlacing(true);
    try {
      const orderBody = {
        customerName,
        customerPhone,
        customerAddress,
        customerEmail,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          type: item.type,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: cartSubtotal,
        discount: 0,
        deliveryCharge,
        total: grandTotal
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Order placed successfully! 📦', 'success');
        // Construct WhatsApp message and open it in new tab automatically!
        triggerWhatsAppMessage(data.id);
        clearCart();
        router.push('/orders');
      } else {
        showToast(data.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      showToast('An error occurred during placing order', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  const triggerWhatsAppMessage = (orderId) => {
    const itemsList = cart.map(
      (item, idx) => `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const message = `Hi Sasmika Mobiles! I have placed an order:
*Order ID*: ${orderId}
*Customer Name*: ${customerName}
*Customer Phone*: ${customerPhone}
*Address*: ${customerAddress}

*Items Ordered*:
${itemsList}

*Subtotal*: ₹${cartSubtotal.toLocaleString()}
*Delivery*: ₹${deliveryCharge}
*Grand Total*: ₹${grandTotal.toLocaleString()}

Please confirm my order and share payment details!`;

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/918526033272?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 flex flex-col items-center justify-center gap-6 text-center text-slate-500">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-4xl">
          🛒
        </div>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white">Your Cart is Empty</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Looks like you haven't added any accessories yet. Explore our catalog to find awesome deals!
          </p>
        </div>
        <Link 
          href="/gallery"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3.5 text-xs font-bold text-white rounded-xl shadow-lg shadow-pink-500/10 transition-all hover:-translate-y-0.5"
        >
          <span>Browse Accessories</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col gap-10">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">Shopping Cart</h1>
        <p className="text-slate-400 text-sm mt-1">You have {cartCount} items in your shopping cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="glass-card border border-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg hover:border-white/10 transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-2xl shrink-0">
                  {item.category === 'headsets' ? '🎧' : item.category === 'chargers' ? '🔌' : item.category === 'covers' ? '📱' : item.category === 'cables' ? '🔗' : '🔋'}
                </div>
                <div className="flex flex-col gap-0.5 max-w-[240px]">
                  <span className="text-sm font-semibold text-white truncate">{item.name}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>{item.brand}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>
              </div>

              {/* Price and Quantities */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                {/* Quantity select */}
                <div className="flex items-center bg-slate-900 border border-white/5 rounded-lg px-2 py-1 select-none">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-slate-400 hover:text-white px-2 py-0.5 text-base font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white px-3">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-slate-400 hover:text-white px-2 py-0.5 text-base font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Price Total */}
                <div className="flex flex-col text-right shrink-0">
                  <span className="font-bold text-white text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">₹{item.price} each</span>
                </div>

                {/* Remove */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove from Cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Checkout Form & Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Form */}
          <div className="glass-card border border-white/5 p-6 md:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
            <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-2.5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-pink-500" />
              <span>Checkout Information</span>
            </h3>

            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
              
              {/* Buyer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={12} className="text-pink-500" />
                  <span>Buyer Full Name <span className="text-red-500">*</span></span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-300 w-full"
                  required
                />
              </div>

              {/* Buyer Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone size={12} className="text-pink-500" />
                  <span>WhatsApp Contact Phone <span className="text-red-500">*</span></span>
                </label>
                <input 
                  type="tel" 
                  placeholder="Enter contact number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-300 w-full"
                  required
                />
              </div>

              {/* Buyer Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={12} className="text-purple-500" />
                  <span>Email (Optional)</span>
                </label>
                <input 
                  type="email" 
                  placeholder="Enter email address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-300 w-full"
                />
              </div>

              {/* Buyer Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} className="text-pink-500" />
                  <span>Delivery Address <span className="text-red-500">*</span></span>
                </label>
                <textarea 
                  placeholder="Enter full street, city, landmark & pincode"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-900 border border-white/5 focus:border-pink-500/20 rounded-xl text-sm outline-none text-slate-300 w-full h-24 resize-none"
                  required
                />
              </div>

              {/* Order summary breakdown */}
              <div className="flex flex-col gap-2 bg-slate-950/40 p-4 border border-white/5 rounded-xl text-xs font-medium text-slate-400 mt-2">
                <div className="flex justify-between">
                  <span>Cart Items Subtotal</span>
                  <span className="text-white">₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-white">
                    {deliveryCharge === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <span className="text-[10px] text-slate-500 font-semibold leading-tight">
                    *Tip: Add ₹{(1000 - cartSubtotal)} more in items to get FREE Delivery!
                  </span>
                )}
                <div className="border-t border-white/5 pt-3 mt-1 flex justify-between text-sm font-bold text-white">
                  <span>Total Bill Amount</span>
                  <span className="text-pink-400 text-base">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={isPlacing}
                className="mt-4 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isPlacing ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Confirm Order & WhatsApp Checkout</span>
                    <Send size={14} />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
