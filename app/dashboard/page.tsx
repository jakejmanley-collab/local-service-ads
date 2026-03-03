'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [businessName, setBusinessName] = useState('Your Business');
  const [trade, setTrade] = useState('Service');
  const [savedAssets, setSavedAssets] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('flyer_form_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.businessName) setBusinessName(parsed.businessName);
      if (parsed.field) setTrade(parsed.field);
    }

    const assets = localStorage.getItem('aretifi_assets');
    if (assets) {
      setSavedAssets(JSON.parse(assets));
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900">ARETIFI</span>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
            <Link href="/preview" className="hover:text-blue-600 transition-colors">Create Ad</Link>
            <Link href="/dashboard" className="text-slate-900">My Gallery</Link>
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
        <div className="lg:col-span-8 space-y-10">
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">My Ad Materials</h2>
                <p className="text-slate-500 font-medium">Download your flyers and copy your ad text below.</p>
              </div>
              <Link href="/preview" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-sm">
                Create New Ad
              </Link>
            </div>

            {savedAssets ? (
              <div className="space-y-8">
                {/* Ad Script Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-bold text-xl">Your Ad Script</h3>
                    <button 
                      onClick={() => {
                        const text = `${savedAssets.copy?.professional?.headline || ''}\n\n${savedAssets.copy?.professional?.description || ''}`;
                        navigator.clipboard.writeText(text);
                        alert('Copied to clipboard!');
                      }}
                      className="bg-slate-100 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-slate-200 transition"
                    >
                      Copy Text
                    </button>
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-2">{savedAssets.copy?.professional?.headline || 'Your Headline'}</p>
                    <p className="text-slate-600 whitespace-pre-wrap font-medium">{savedAssets.copy?.professional?.description || 'Your ad description will appear here.'}</p>
                  </div>
                </div>

                {/* Ad Images Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-bold text-xl">Ad Backgrounds</h3>
                    <Link href="/preview" className="text-sm font-bold text-blue-600 hover:text-blue-700">Open Studio to add text →</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedAssets.photos?.map((photo: string, i: number) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                         <img src={photo} alt={`Generated Background ${i + 1}`} className="w-full h-48 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h-1m-4-4h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">No ads created yet</h3>
                <p className="text-slate-400 text-sm mt-1 mb-6">Start by making your first set of {trade} flyers.</p>
                <Link href="/preview" className="text-blue-600 font-bold text-sm hover:underline">Start Here →</Link>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          
          <div className="group relative overflow-hidden bg-slate-900 rounded-2xl text-white shadow-xl transition-all hover:scale-[1.02] border border-slate-800 flex flex-col">
            <div className="w-full h-64 bg-slate-800 relative overflow-hidden border-b border-slate-700">
              <img 
                src="/premium-flyer.jpg" 
                alt="Premium Business Flyer Example" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-md">
                Limited Time Offer
              </div>
            </div>

            <div className="p-6 relative z-10 flex-1 flex flex-col">
              <h3 className="text-xl font-bold leading-tight mb-2">Get Premium <br/>Business Flyers</h3>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                Unlock 5 custom, high-end business flyers for your {trade} business. Stop using standard templates and look like the top Pro in town.
              </p>
              <div className="flex items-end gap-2 mb-6 mt-auto">
                <span className="text-3xl font-black text-white">$25</span>
                <span className="text-slate-500 text-xs font-bold line-through mb-1">Was $99</span>
              </div>
              <Link href="/checkout?oto=true" className="block w-full text-center bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                Upgrade My Flyers
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-6">Growth Plans</h3>
            <div className="space-y-4">
              <Link href="/checkout?plan=network" className="block group">
                <div className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Verified Pro</span>
                    <span className="text-blue-600 font-black">$15/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium italic">A professional page on our domain</p>
                </div>
              </Link>
              
              <Link href="/checkout?plan=seo" className="block group">
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-yellow-400">Pro Plus</span>
                    <span className="text-white font-black">$49/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium italic">Your own domain + 20 pages built for Google</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
