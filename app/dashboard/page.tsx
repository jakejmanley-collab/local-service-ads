'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [businessName, setBusinessName] = useState('Your Business');
  const [trade, setTrade] = useState('Service');

  useEffect(() => {
    const savedData = localStorage.getItem('flyer_form_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.businessName) setBusinessName(parsed.businessName);
      if (parsed.field) setTrade(parsed.field);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Modern Slim Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900">ARETIFI</span>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
            <Link href="/preview" className="hover:text-blue-600 transition-colors">Generator</Link>
            <Link href="/dashboard" className="text-slate-900">My Assets</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-slate-400">{businessName}</span>
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
            {businessName[0]}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Your Assets</h2>
                <p className="text-slate-500 font-medium">Download your free flyers and ad copy below.</p>
              </div>
              <Link href="/preview" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-sm">
                New Generation
              </Link>
            </div>

            {/* Empty State / Asset Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg">No assets generated yet</h3>
              <p className="text-slate-400 text-sm mt-1 mb-6">Start by generating your first {trade} flyer batch.</p>
              <Link href="/preview" className="text-blue-600 font-bold text-sm hover:underline">Launch Studio →</Link>
            </div>
          </section>
        </div>

        {/* Sidebar Upgrades */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* THE NEW $25 UPGRADE CARD (Modern Style) */}
          <div className="group relative overflow-hidden bg-slate-900 rounded-2xl p-6 text-white shadow-xl transition-all hover:scale-[1.02]">
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="inline-block bg-blue-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-4">
                Limited Time Offer
              </div>
              <h3 className="text-xl font-bold leading-tight mb-2">Upgrade to <br/>Pro Designed Flyers</h3>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                Unlock 5 photorealistic, custom-generated flyers for your {trade} business. Stop using templates and look like a Top-Tier Pro.
              </p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-black">$25</span>
                <span className="text-slate-500 text-xs font-bold line-through mb-1">Was $49</span>
              </div>
              <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                Upgrade Now
              </button>
            </div>
          </div>

          {/* Website Tiers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-6">Growth Plans</h3>
            <div className="space-y-4">
              <Link href="/checkout?plan=network" className="block group">
                <div className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Verified Pro</span>
                    <span className="text-blue-600 font-black">$15/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium italic">Single page on Aretifi domain</p>
                </div>
              </Link>
              
              <Link href="/checkout?plan=seo" className="block group">
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-yellow-400">Pro Plus</span>
                    <span className="font-black">$49/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium italic">Unique domain + 20 local pages</p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
