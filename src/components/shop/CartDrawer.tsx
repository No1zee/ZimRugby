"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight, Shield, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [pledgeActive, setPledgeActive] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Sables 2024 Home Jersey",
      price: 85,
      image: "/images/campaign/jersey-detail.png", // Using existing artifact path placeholder
      quantity: 1
    }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const pledgeAmount = 10;
  const total = pledgeActive ? subtotal + pledgeAmount : subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-rich-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-clubhouse-charcoal border-l border-white/5 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-clubhouse-gold" />
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Your Bag</h2>
                <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest">{cartItems.length} Items</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 bg-white/5 rounded-lg overflow-hidden shrink-0 border border-white/5">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate pr-4">{item.name}</h3>
                        <span className="text-sm font-bold text-white">${item.price}</span>
                      </div>
                      <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-4">Size: L | Qty: {item.quantity}</p>
                      <button className="flex items-center gap-2 text-[9px] font-black text-white/20 hover:text-red-500 uppercase tracking-[0.2em] transition-colors">
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Your bag is empty</p>
                  <Button variant="ghost" onClick={onClose}>Continue Shopping</Button>
                </div>
              )}

              {/* CAMPAIGN PLEDGE HOOK */}
              {cartItems.length > 0 && (
                <div className="mt-12 p-6 bg-clubhouse-gold/5 border border-clubhouse-gold/20 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-clubhouse-gold/10 blur-3xl pointer-events-none group-hover:bg-clubhouse-gold/20 transition-all duration-700" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-4 h-4 text-clubhouse-gold" fill="currentColor" opacity={0.2} />
                      <span className="text-[10px] font-black text-clubhouse-gold uppercase tracking-[0.2em]">World Cup Campaign</span>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Back the Sables</h3>
                    <p className="text-xs text-white/50 font-medium leading-relaxed mb-6">
                      Add a $10 monthly pledge to your order to fuel a high-performance youth session. Build the legacy.
                    </p>
                    
                    <button 
                      onClick={() => setPledgeActive(!pledgeActive)}
                      className={`w-full p-4 border rounded-xl flex items-center justify-between transition-all duration-300
                        ${pledgeActive 
                          ? 'bg-clubhouse-gold border-clubhouse-gold' 
                          : 'bg-white/5 border-white/10 hover:border-clubhouse-gold/50'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors
                          ${pledgeActive ? 'bg-rich-black' : 'bg-white/10'}
                        `}>
                          <Heart className={`w-3 h-3 ${pledgeActive ? 'text-clubhouse-gold fill-current' : 'text-white/20'}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest
                          ${pledgeActive ? 'text-rich-black' : 'text-white/60'}
                        `}>
                          Add $10 Monthly Pledge
                        </span>
                      </div>
                      <span className={`text-xs font-black
                        ${pledgeActive ? 'text-rich-black' : 'text-white'}
                      `}>+$10.00</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-white/40 uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {pledgeActive && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-clubhouse-gold uppercase tracking-widest flex items-center gap-2">
                        <Heart className="w-3 h-3 fill-current" />
                        Campaign Pledge
                      </span>
                      <span className="font-bold text-clubhouse-gold">+${pledgeAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xl font-black text-white uppercase tracking-tighter">Total</span>
                    <span className="text-xl font-black text-white">${total.toFixed(2)}</span>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <Button variant="secondary" size="xl" className="w-full">
                    Checkout Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                    Taxes and shipping calculated at checkout
                  </p>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
