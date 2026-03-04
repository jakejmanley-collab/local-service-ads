'use client';

import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-10 text-center">
          
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900">Upgrade Success!</h1>
          <p className="text-slate-500 font-medium mb-8">Your account has been successfully updated.</p>

          <div className="bg-slate-50 rounded-xl p-5 mb-8 text-left border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Status</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <p className="text-sm font-bold text-slate-900">Payment Confirmed & Processed</p>
            </div>
          </div>

          <Link 
            href="/dashboard"
            className="block w-full bg-blue-600 text-white text-center font-bold py-4 rounded-xl shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            Go to My Dashboard
          </Link>
          
          <p className="text-xs font-medium text-slate-400 mt-6 leading-relaxed">
            A confirmation email and receipt have been <br className="hidden sm:block" /> sent to your inbox.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-400 bg-[#f8fafc]">Updating Account...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
