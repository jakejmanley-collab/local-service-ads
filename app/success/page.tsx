'use client';

import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">Upgrade Success!</h1>
          <p className="text-slate-500 font-bold text-sm mb-8 uppercase tracking-wide">Your account has been updated</p>

          <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 mb-8 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Order Status</p>
            <p className="text-sm font-black text-slate-900">Payment Confirmed & Processed</p>
          </div>

          <Link 
            href="/dashboard"
            className="block w-full bg-black text-white text-center font-black py-5 uppercase text-xl italic tracking-tight border-b-4 border-gray-700 active:translate-y-1 active:border-b-0 transition-all hover:bg-gray-900"
          >
            Back to Dashboard
          </Link>
          
          <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase leading-tight">
            A confirmation email and receipt have been <br/> sent to your inbox.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase italic text-slate-400">Updating Account...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
