'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradeOfferPage() {
  const router = useRouter();
  const [trade, setTrade] = useState('Local Service');

  useEffect(() => {
    // Pull the trade they just entered to personalize the upsell
    const savedData = localStorage.getItem('flyer_form_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.field) {
        setTrade(parsed.field);
      }
    }
  }, []);

  const handleAccept = () => {
    // In a production environment, this routes to a Stripe Checkout link for the $25 product.
    // For now, we simulate success and push to the dashboard.
    alert('Routing to Stripe Checkout for $25...');
    router.push('/dashboard');
  };

  const handleDecline = () => {
    // If they decline, send them straight to the dashboard to access their free assets.
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full bg-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(255,255,255,0.2)]">
        
        {/* Progress Bar / Status */}
        <div className="bg-green-500 p-3 text-center border-b-4 border-black">
          <p className="font-black uppercase text-sm text-black tracking-widest">
            Step 1 Complete: Your Free Account is Created
          </p>
        </div>

        <div className="p-10 md:p-14 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-red-600">
            Wait! Read This Before <br/> Accessing Your Dashboard.
          </h1>
          
          <p className="text-xl font-bold text-slate-800 mb-8 max-w-xl mx-auto">
            Thousands of contractors use our standard free templates. Separate yourself from the competition with the <span className="underline decoration-4 decoration-yellow-400">Premium AI Asset Pack</span>.
          </p>

          {/* The Offer Box */}
          <div className="bg-slate-50 border-4 border-black p-8 text-left mb-10 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-black uppercase italic px-4 py-1 border-2 border-black text-sm">
              One-Time Offer
            </div>
            
            <h2 className="text-2xl font-black uppercase mb-4">What you get for $25:</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-black text-xl">✓</span>
                <span className="font-bold text-slate-700">5 Completely Unique, Photorealistic Ad Backgrounds</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-black text-xl">✓</span>
                <span className="font-bold text-slate-700">Generated from scratch by AI specifically for your {trade} business</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-black text-xl">✓</span>
                <span className="font-bold text-slate-700">Commercial-use rights to completely dominate Facebook Marketplace</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 font-black text-xl">✕</span>
                <span className="font-bold text-slate-500 line-through">Never look like a generic template again</span>
              </li>
            </ul>

            <div className="flex items-center justify-between border-t-2 border-slate-200 pt-6">
              <div className="text-slate-500 font-bold line-through text-xl">Normal Price: $99</div>
              <div className="text-4xl font-black">Only $25</div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="space-y-4">
            <button 
              onClick={handleAccept}
              className="w-full bg-blue-600 text-white font-black py-6 uppercase text-2xl italic tracking-tight border-b-8 border-blue-800 hover:bg-blue-500 active:translate-y-2 active:border-b-0 transition-all"
            >
              Yes! Upgrade My Assets for $25
            </button>
            
            <button 
              onClick={handleDecline}
              className="w-full py-4 text-slate-400 font-bold uppercase text-xs hover:text-slate-600 underline decoration-slate-300 transition-colors"
            >
              No thanks, I want to look like everyone else using the standard free templates. Take me to my dashboard.
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
