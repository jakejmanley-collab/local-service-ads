'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [product, setProduct] = useState({ name: 'Loading...', price: '$0.00', interval: '', desc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const oto = searchParams.get('oto');
    const plan = searchParams.get('plan');

    if (oto === 'true') {
      setProduct({ 
        name: 'Premium Business Flyers', 
        price: '$25.00', 
        interval: 'One-time payment', 
        desc: 'Unlock 5 custom, high-end business flyers specifically designed for your trade. Stand out from the competition.' 
      });
    } else if (plan === 'network') {
      setProduct({ 
        name: 'Verified Pro Plan', 
        price: '$15.00', 
        interval: 'Billed monthly', 
        desc: 'A professional page on our domain. Build trust and let customers message you directly.' 
      });
    } else if (plan === 'seo') {
      setProduct({ 
        name: 'Pro Plus Plan', 
        price: '$49.00', 
        interval: 'Billed monthly', 
        desc: 'Your own custom domain (.com) + 20 pages built specifically to rank on Google in your local area.' 
      });
    } else {
      // Fallback if they land here without parameters
      setProduct({ 
        name: 'Account Upgrade', 
        price: '$25.00', 
        interval: 'One-time payment', 
        desc: 'Premium account features and access.' 
      });
    }
  }, [searchParams]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate a network request for the UI preview
    setTimeout(() => {
      setIsProcessing(false);
      alert('This is a UI placeholder. We will connect Stripe next.');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Payment Details Column */}
          <div className="p-8 md:p-12 md:w-3/5 bg-white">
            <h2 className="text-2xl font-black tracking-tight mb-8">Payment Details</h2>
            
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                  <input type="email" required placeholder="you@company.com" className="w-full border border-slate-300 rounded-lg p-3 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Card Information</label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
                    <input type="text" required placeholder="Card number" className="w-full p-3 font-medium outline-none border-b border-slate-200" />
                    <div className="flex">
                      <input type="text" required placeholder="MM / YY" className="w-1/2 p-3 font-medium outline-none border-r border-slate-200" />
                      <input type="text" required placeholder="CVC" className="w-1/2 p-3 font-medium outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Name on Card</label>
                  <input type="text" required placeholder="Full name" className="w-full border border-slate-300 rounded-lg p-3 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-6 hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay ${product.price}`
                )}
              </button>
              
              <p className="text-center text-xs font-medium text-slate-400 mt-4 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payments are secure and encrypted.
              </p>
            </form>
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
                <span>Calculated at next step</span>
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
