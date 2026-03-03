'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [businessName, setBusinessName] = useState('Your Business');
  const [trade, setTrade] = useState('Service');

  useEffect(() => {
    // Pull the user's data to personalize their dashboard
    const savedData = localStorage.getItem('flyer_form_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.businessName) setBusinessName(parsed.businessName);
      if (parsed.field) setTrade(parsed.field);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-black text-white p-6 flex justify-between items-center border-b-4 border-slate-800">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Aretifi Studio</h1>
        <div className="flex items-center gap-4">
          <div className="font-bold text-sm bg-slate-800 px-4 py-2 uppercase border border-slate-700">
            {businessName}
          </div>
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white uppercase transition-colors">
            Log Out
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: User Assets & Generation */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-black pb-4 mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase italic">Your Ad Assets</h2>
                <p className="text-sm font-bold text-slate-500">Manage your flyers and ad copy</p>
              </div>
              <Link href="/preview" className="bg-blue-600 text-white font-black px-6 py-3 uppercase italic hover:bg-blue-700 transition-colors border-b-4 border-blue-900 active:border-b-0 active:translate-y-1">
                + Generate New Ads
              </Link>
            </div>
            
            {/* Asset Display Area */}
            <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-300">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="font-bold text-slate-600 text-lg mb-2">No active assets loaded.</p>
              <p className="text-sm text-slate-500 font-bold max-w-sm mx-auto">
                Click the button above to launch the Studio and generate a new batch of commercial-grade flyers for your {trade} business.
              </p>
            </div>
          </section>

        </div>

        {/* Right Column: Website Upgrade Funnel */}
        <div className="space-y-8">
          
          <section className="bg-white border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase italic border-b-2 border-black pb-2 mb-4">Website Upgrades</h2>
            <p className="text-sm font-bold text-slate-600 mb-6">Stop sending Facebook leads to a blank profile. Upgrade to a professional web presence to increase your booking rate.</p>
            
            <div className="space-y-6">
              
              {/* Tier 2: Network Site */}
              <div className="border-4 border-black p-5 bg-slate-50 relative overflow-hidden">
                <h3 className="font-black uppercase text-xl mb-1">Network Site</h3>
                <div className="text-3xl font-black text-blue-600 mb-4">$15<span className="text-sm text-black uppercase tracking-widest">/mo</span></div>
                <ul className="text-sm font-bold space-y-2 mb-6 text-slate-700">
                  <li className="flex gap-2"><span className="text-blue-600">✓</span> Hosted single-page website</li>
                  <li className="flex gap-2"><span className="text-blue-600">✓</span> Lead capture contact form</li>
                  <li className="flex gap-2"><span className="text-blue-600">✓</span> Mobile optimized</li>
                </ul>
                <Link href="/checkout?plan=network" className="block w-full text-center bg-black text-white font-black uppercase py-3 hover:bg-slate-800 transition-colors">
                  Upgrade to Network
                </Link>
              </div>

              {/* Tier 3: SEO Dominator */}
              <div className="border-4 border-black p-5 bg-yellow-400 relative">
                <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-black uppercase px-2 py-1">Recommended</div>
                <h3 className="font-black uppercase text-xl mb-1">SEO Dominator</h3>
                <div className="text-3xl font-black text-black mb-4">$49<span className="text-sm uppercase tracking-widest">/mo</span></div>
                <ul className="text-sm font-bold space-y-2 mb-6 text-black">
                  <li className="flex gap-2"><span className="text-slate-800">✓</span> Unique standalone domain</li>
                  <li className="flex gap-2"><span className="text-slate-800">✓</span> 20 locally optimized pages</li>
                  <li className="flex gap-2"><span className="text-slate-800">✓</span> Designed to rank on Google</li>
                </ul>
                <Link href="/checkout?plan=seo" className="block w-full text-center bg-black text-white font-black uppercase py-3 hover:bg-slate-800 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  Upgrade to SEO
                </Link>
              </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
