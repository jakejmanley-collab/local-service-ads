'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const PLANS = {
  network: { name: 'Network Site', priceMonthly: 15, priceAnnual: 135 }, // 25% off $180
  seo: { name: 'SEO Dominator', priceMonthly: 49, priceAnnual: 441 },    // 25% off $588
};

export default function CheckoutPage() {
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
    <main className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
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
                    checked={includeOTO}
                    onChange={(e) => setIncludeOTO(e.target.checked)}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-red-700 leading-tight mb-1">
                    Yes, Add 5 Premium AI-Designed Flyers to my order
                  </h3>
                  <p className="text-sm font-bold text-slate-800 mb-2">
                    Separate yourself from the competition. For a <span className="underline decoration-2">one-time $25 fee</span>, our AI will generate 5 completely unique, photorealistic backgrounds built specifically for your trade.
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    (Normal Price: $99 - You Save $74)
                  </p>
                </div>
              </label>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white border-4 border-black p-6 md:p-8 sticky top-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase border-b-2 border-slate-700 pb-2 mb-6">Order Summary</h2>

              {/* Billing Cycle Toggle */}
              <div className="flex bg-slate-800 border-2 border-slate-700 p-1 mb-8">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-2 text-xs font-black uppercase transition-colors ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  Pay Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle('annual')}
                  className={`flex-1 py-2 text-xs font-black uppercase transition-colors ${billingCycle === 'annual' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  Pay Annually (Save 25%)
                </button>
              </div>

              {/* Line Items */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{selectedPlan.name}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Billed {billingCycle}</div>
                  </div>
                  <div className="font-black text-xl">${basePrice}</div>
                </div>

                {includeOTO && (
                  <div className="flex justify-between items-center text-yellow-400">
                    <div>
                      <div className="font-bold text-lg">Premium AI Asset Pack</div>
                      <div className="text-xs uppercase font-bold">One-Time Charge</div>
                    </div>
                    <div className="font-black text-xl">+$25</div>
                  </div>
                )}
              </div>

              {/* Total & Checkout */}
              <div className="border-t-2 border-slate-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xl font-bold uppercase">Total Due Today</div>
                  <div className="text-4xl font-black">${totalPrice}</div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white font-black py-5 uppercase text-xl italic tracking-tight border-b-4 border-blue-800 hover:bg-blue-500 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay $${totalPrice} Now`}
                </button>
                
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Secure 256-bit Encrypted Checkout
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
