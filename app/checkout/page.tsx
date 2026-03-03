'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function CheckoutForm() {
  const searchParams = useSearchParams();
  
  const [product, setProduct] = useState({ name: 'Loading...', price: '$0.00', interval: '', desc: '', stripeLink: '#' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const oto = searchParams.get('oto');
    const plan = searchParams.get('plan');

    // REPLACE THESE URLS WITH YOUR ACTUAL STRIPE PAYMENT LINKS
    if (oto === 'true') {
      setProduct({ 
        name: 'Premium Business Flyers', 
        price: '$25.00', 
        interval: 'One-time payment', 
        desc: 'Unlock 5 custom, high-end business flyers specifically designed for your trade. Stand out from the competition.',
        stripeLink: 'https://buy.stripe.com/test_dummy_link_flyers' 
      });
    } else if (plan === 'network') {
      setProduct({ 
        name: 'Verified Pro Plan', 
        price: '$15.00', 
        interval: 'Billed monthly', 
        desc: 'A professional page on our domain. Build trust and let customers message you directly.',
        stripeLink: 'https://buy.stripe.com/test_dummy_link_network' 
      });
    } else if (plan === 'seo') {
      setProduct({ 
        name: 'Pro Plus Plan', 
        price: '$49.00', 
        interval: 'Billed monthly', 
        desc: 'Your own custom domain (.com) + 20 pages built specifically to rank on Google in your local area.',
        stripeLink: 'https://buy.stripe.com/test_dummy_link_seo' 
      });
    } else {
      setProduct({ 
        name: 'Account Upgrade', 
        price: '$25.00', 
        interval: 'One-time payment', 
        desc: 'Premium account features and access.',
        stripeLink: '#' 
      });
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Action Column */}
          <div className="p-8 md:p-12 md:w-3/5 bg-white flex flex-col justify-center">
            <h2 className="text-2xl font-black tracking-tight mb-4">Complete Your Upgrade</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              You will be redirected to our secure payment partner, Stripe, to complete your transaction.
            </p>
            
            <Link 
              href={product.stripeLink}
              onClick={() => setIsProcessing(true)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex justify-center items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting to Stripe...
                </>
              ) : (
                `Proceed to Secure Checkout`
              )}
            </Link>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
              <svg className="h-6 opacity-50" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.8 11.2V9.3C24.8 7.9 23.7 6.8 22.3 6.8H18.7C17.3 6.8 16.2 7.9 16.2 9.3V11.2C15.5 11.2 15 11.7 15 12.4V19.8C15 20.5 15.5 21 16.2 21H24.8C25.5 21 26 20.5 26 19.8V12.4C26 11.7 25.5 11.2 24.8 11.2ZM22.8 11.2H18.2V9.3C18.2 8.7 18.7 8.2 19.3 8.2H21.7C22.3 8.2 22.8 8.7 22.8 9.3V11.2Z" fill="currentColor"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider">Powered by Stripe</span>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="p-8 md:p-12 md:w-2/5 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Order Summary</h3>
            
            <div className="mb-6">
              <h4 className="text-xl font-bold mb-2">{product.name}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{product.desc}</p>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-6 space-y-3">
              <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span>{product.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-end pt-3 border-t border-slate-200 mt-3">
                <span className="font-bold">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black block">{product.price}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">{product.interval}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-bold text-slate-400">Loading Checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
