'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState({ name: '', price: '', interval: '', desc: '', link: '' });

  // 1. PASTE YOUR 3 UNIQUE STRIPE LINKS HERE
  const LINKS = {
    FLYERS_OTO: "https://buy.stripe.com/aFa28l6uL2WY11G3Tt3gk01",
    VERIFIED_PRO: "https://buy.stripe.com/aFadR38CT9lm7q475F3gk02",
    PRO_PLUS: "https://buy.stripe.com/eVq9AN4mD556cKogGf3gk03"
  };

  useEffect(() => {
    const oto = searchParams.get('oto');
    const plan = searchParams.get('plan');

    if (oto === 'true') {
      setProduct({
        name: 'Premium Business Flyers',
        price: '$25',
        interval: 'One-time',
        desc: '5 high-end, custom-designed flyers for your trade.',
        link: LINKS.FLYERS_OTO
      });
    } else if (plan === 'seo') {
      setProduct({
        name: 'Pro Plus Plan',
        price: '$49',
        interval: 'Monthly',
        desc: 'Your own custom domain (.com) + 20 SEO optimized local pages.',
        link: LINKS.PRO_PLUS
      });
    } else {
      setProduct({
        name: 'Verified Pro Plan',
        price: '$15',
        interval: 'Monthly',
        desc: 'Professional verified page on our domain to build customer trust.',
        link: LINKS.VERIFIED_PRO
      });
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
          <h1 className="text-3xl font-black uppercase italic mb-2 tracking-tighter italic">Confirm Order</h1>
          <p className="text-slate-500 font-bold text-sm mb-8 uppercase tracking-wide">Secure Checkout via Stripe</p>

          <div className="border-t-4 border-black pt-6 mb-8">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-black uppercase leading-tight">{product.name}</h2>
              <span className="text-2xl font-black">{product.price}</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-4">{product.desc}</p>
            <div className="bg-slate-100 p-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
              {product.interval} Billing Cycle
            </div>
          </div>

          <Link 
            href={product.link}
            className="block w-full bg-blue-600 text-white text-center font-black py-5 uppercase text-xl italic tracking-tight border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all hover:bg-blue-700"
          >
            Go to Payment
          </Link>
          
          <p className="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase">
            100% Secure • SSL Encrypted • Powered by Stripe
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase italic text-slate-400">Loading Order...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
