'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [isYearly, setIsYearly] = useState(false);
  const [product, setProduct] = useState({ 
    name: '', 
    price: '', 
    interval: '', 
    desc: '', 
    link: '',
    features: [] as string[]
  });

  // 1. PASTE YOUR UNIQUE STRIPE LINKS HERE
  const LINKS = {
    FLYERS_OTO: "https://buy.stripe.com/aFa28l6uL2WY11G3Tt3gk01",
    VERIFIED_PRO_MONTHLY: "https://buy.stripe.com/4gM4gt5qH9lmh0Eey73gk04",
    VERIFIED_PRO_YEARLY: "https://buy.stripe.com/fZuaERaL169afWAahR3gk05", // <-- ADD YEARLY LINK
    PRO_PLUS_MONTHLY: "https://buy.stripe.com/28E3cp2ev41239O9dN3gk06",
    PRO_PLUS_YEARLY: "https://buy.stripe.com/3cI9AN9GXcxybGk75F3gk07" // <-- ADD YEARLY LINK
  };

  useEffect(() => {
    const oto = searchParams.get('oto');
    const plan = searchParams.get('plan');

    if (oto === 'true') {
      setProduct({
        name: 'Premium Business Flyers',
        price: '$25',
        interval: 'One-time',
        desc: 'Upgrade your marketing with professional, high-converting assets.',
        link: LINKS.FLYERS_OTO,
        features: [
          '5 high-end, custom-designed flyers',
          'Completely watermark-free downloads',
          'Print-ready PDF & high-res PNG formats',
          'Instant lifetime access in your dashboard'
        ]
      });
    } else if (plan === 'seo') {
      setProduct({
        name: 'Pro Plus Plan',
        price: isYearly ? '$261' : '$29',
        interval: isYearly ? 'Yearly' : 'Monthly',
        desc: 'The ultimate growth engine. Dominate your local service area on Google.',
        link: isYearly ? LINKS.PRO_PLUS_YEARLY : LINKS.PRO_PLUS_MONTHLY,
        features: [
          'Your own custom website (.com)',
          '20 Google-optimized local service pages',
          'Contact form directly to your email',
          'Premium high-res flyer downloads included with yearly plan'
        ]
      });
    } else {
      setProduct({
        name: 'Verified Pro Plan',
        price: isYearly ? '$86' : '$9',
        interval: isYearly ? 'Yearly' : 'Monthly',
        desc: 'Establish trust and capture more leads with a verified digital presence.',
        link: isYearly ? LINKS.VERIFIED_PRO_YEARLY : LINKS.VERIFIED_PRO_MONTHLY,
        features: [
          'Professional verified page on the Aretifi domain network',
          'Great for those starting out with a limited budget',
          'Optimzed site to get noticed on Google',
          'Direct contact form for customers',
          'Premium high-res flyer downloads included with yearly plan'
        ]
      });
    }
  }, [searchParams, isYearly]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-lg w-full">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-8 w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs mb-4 tracking-wide uppercase">
              Secure Checkout
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">{product.name}</h1>
            <p className="text-slate-500 font-medium text-sm text-balance max-w-sm mx-auto mb-6">{product.desc}</p>

            {/* Billing Toggle (Hidden for one-time flyer purchases) */}
            {product.interval !== 'One-time' && (
              <div className="flex items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-xl w-fit mx-auto border border-slate-200">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${!isYearly ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Yearly <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider font-black">Save 15%</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Due Today</span>
              <div className="text-right">
                <span className="text-4xl font-black text-slate-900">{product.price}</span>
                <span className="text-slate-500 font-medium text-sm ml-1">/ {product.interval === 'Monthly' ? 'mo' : product.interval === 'Yearly' ? 'yr' : 'one-time'}</span>
              </div>
            </div>

            <ul className="space-y-4">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link 
            href={product.link}
            className="flex items-center justify-center w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Continue to Payment
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          
          <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            <p className="text-xs font-semibold uppercase tracking-wider">
              100% Secure • Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-400 bg-slate-50">Loading Secure Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
