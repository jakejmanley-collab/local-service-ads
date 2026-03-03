'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const PLANS = {
  network: { name: 'Network Site', priceMonthly: 15, priceAnnual: 135 }, // 25% off $180
  seo: { name: 'SEO Dominator', priceMonthly: 49, priceAnnual: 441 },    // 25% off $588
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [planId, setPlanId] = useState<'network' | 'seo'>('network');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [includeOTO, setIncludeOTO] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const p = searchParams?.get('plan');
    if (p === 'seo') setPlanId('seo');
    if (p === 'network') setPlanId('network');
  }, [searchParams]);

  const selectedPlan = PLANS[planId];
  const basePrice = billingCycle === 'monthly' ? selectedPlan.priceMonthly : selectedPlan.priceAnnual;
  const totalPrice = basePrice + (includeOTO ? 25 : 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate Stripe processing
    setTimeout(() => {
      alert(`Payment of $${totalPrice} processed successfully! Welcome to ${selectedPlan.name}.`);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm font-bold uppercase text-slate-500 hover:text-black transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-10">
        Complete Your Upgrade
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Checkout Form & OTO */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Billing Information */}
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-6">Billing Details</h2>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="First Name" className="w-full border-4 p-4 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" />
                <input required placeholder="Last Name" className="w-full border-4 p-4 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" />
              </div>
              <input required type="email" placeholder="Email Address" className="w-full border-4 p-4 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" />
              
              {/* Simulated Stripe Element */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Payment Method</h3>
                <div className="w-full border-4 border-black p-4 bg-slate-100 flex items-center justify-between opacity-70">
                  <span className="font-bold text-slate-600">Card number, expiration, CVC...</span>
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
              </div>
            </form>
          </div>

          {/* The Order Bump (Tripwire) */}
          <div className={`border-4 transition-colors ${includeOTO ? 'border-blue-600 bg-blue-50' : 'border-dashed border-red-600 bg-red-50'} p-6 relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="absolute -top-4 left-6 bg-red-600 text-white font-black uppercase italic px-4 py-1 border-2 border-black text-xs flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              One Time Offer
            </div>
            
            <label className="flex items-start gap-4 cursor-pointer pt-2">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  className="w-6 h-6 accent-red-600 cursor-pointer"
                  checked
