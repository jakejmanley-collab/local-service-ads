'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import { toPng } from 'html-to-image';

const FALLBACK_1 = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800"; 
const FALLBACK_2 = "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800";

const parse = (val: string) => {
  if (!val || val.trim() === "") return null;
  const p = val.split(',').map(s => s.trim());
  if (p.length < 4) return null;
  return {
    x: p[0], y: p[1], w: p[2], h: p[3],
    s: { fontSize: p[4] || '30px', color: p[5] || '#000', fontWeight: p[6] || '400', fontFamily: p[8] || 'Anton', lineHeight: '1', display: 'flex', alignItems: 'center' }
  };
};

const MasterTemplate = ({ id, data, configKey, rawDatabase, photo1, photo2 }: any) => {
  const row = rawDatabase[configKey];
  if (!row) return null;
  const p1 = parse(row['Photo Hole']); const p2 = parse(row['Photo Hole 2']); 
  const h1 = parse(row['Header Top']); const h2 = parse(row['Header Bottom']);
  const s1 = parse(row['Service 1']); const s2 = parse(row['Service 2']);
  const s3 = parse(row['Service 3']); const s4 = parse(row['Service 4']);
  const ph = parse(row['Phone']);
  const name = data.businessName || "";
  const first = name.split(' ')[0] || "PRO";
  const rest = name.split(' ').slice(1).join(' ') || "SERVICES";
  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  const clip = isHex ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : isCircle ? { borderRadius: '50%', overflow: 'hidden' } : {};

  return (
    <div id={id} className="relative w-full bg-white">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        {p1 && <foreignObject x={p1.x} y={p1.y} width={p1.w} height={p1.h}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo1} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e: any) => { e.currentTarget.src = FALLBACK_1; }} /></div></foreignObject>}
        {p2 && <foreignObject x={p2.y} width={p2.w} height={p2.h} y={p2.y}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo2} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e: any) => { e.currentTarget.src = FALLBACK_2; }} /></div></foreignObject>}
        {[{ c: h1, t: first }, { c: h2, t: rest }, { c: ph, t: data.phone, isPhone: true }, { c: s1, t: data.service1 ? `✓ ${data.service1}` : '' }, { c: s2, t: data.service2 ? `✓ ${data.service2}` : '' }, { c: s3, t: data.service3 ? `✓ ${data.service3}` : '' }, { c: s4, t: data.service4 ? `✓ ${data.service4}` : '' }].map((item, i) => {
          if (!item.c || !item.t) return null;
          return <foreignObject key={i} x={item.c.x} y={item.c.y} width={item.c.w} height={item.c.h} style={{ overflow: 'visible' }}><div style={item.c.s} className="w-full h-full uppercase whitespace-nowrap">{item.t}</div></foreignObject>;
        })}
      </svg>
    </div>
  );
};

export default function DashboardPage() {
  const [businessName, setBusinessName] = useState('Your Business');
  const [trade, setTrade] = useState('Service');
  const [savedAssets, setSavedAssets] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [db, setDb] = useState<Record<string, any>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('flyer_form_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed);
      if (parsed.businessName) setBusinessName(parsed.businessName);
      if (parsed.field) setTrade(parsed.field);
    }

    const assets = localStorage.getItem('aretifi_assets');
    if (assets) {
      setSavedAssets(JSON.parse(assets));
    }

    fetch(`/templates.csv?v=${Date.now()}`).then(r => r.text()).then(txt => {
      Papa.parse(txt, { header: true, skipEmptyLines: true, complete: (res) => {
          const map: Record<string, any> = {};
          res.data.forEach((r: any) => { if (r['Template ID']) map[r['Template ID']] = r; });
          setDb(map);
      }});
    });
  }, []);

  const handleDownload = async (elementId: string, shape: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    setDownloadingId(elementId);
    
    try {
      const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const fileName = `${businessName.replace(/\s+/g, '-')}-${shape}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Trigger Mobile Share Sheet (Allows "Save to Photos")
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${businessName} Flyer`,
          });
          setDownloadingId(null);
          return;
        } catch (e) {
          // User canceled share sheet, continue to fallback download
        }
      }

      // Fallback for Desktop (Standard Download)
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert('There was an error saving your flyer. Please try again.');
    }
    
    setDownloadingId(null);
  };

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

            {savedAssets && formData && Object.keys(db).length > 0 ? (
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

                {/* Completed Flyers Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-bold text-xl">Your Business Flyers</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['circle', 'square', 'hex'].map(s => (
                      <div key={s} className="border border-slate-200 bg-slate-50 shadow-sm overflow-hidden flex flex-col rounded-xl relative">
                        {downloadingId === `t-${s}` && (
                          <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                            <span className="font-bold text-sm animate-pulse">Processing...</span>
                          </div>
                        )}
                        <MasterTemplate 
                          id={`t-${s}`} 
                          data={formData} 
                          configKey={`${s}-${formData.themeColor || 'red'}`} 
                          rawDatabase={db} 
                          photo1={savedAssets.photos?.[0] || FALLBACK_1} 
                          photo2={savedAssets.photos?.[1] || FALLBACK_2} 
                        />
                        <button 
                          onClick={() => handleDownload(`t-${s}`, s)} 
                          disabled={downloadingId !== null}
                          className="w-full mt-auto bg-slate-100 text-slate-900 py-3 font-bold text-sm hover:bg-slate-200 transition-colors border-t border-slate-200 disabled:opacity-50"
                        >
                          Save to Device
                        </button>
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
          
          <div className="group relative overflow-hidden bg-slate-900 rounded-2xl p-6 text-white shadow-xl transition-all hover:scale-[1.02] border border-slate-800">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="inline-block bg-blue-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-4 shadow-md">
                Limited Time Offer
              </div>
              <h3 className="text-xl font-bold leading-tight mb-2">Get Premium <br/>Business Flyers</h3>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                Unlock 5 custom, high-end business flyers specifically designed for your {trade} business. Stand out from the competition.
              </p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-black text-white">$25</span>
                <span className="text-slate-500 text-xs font-bold line-through mb-1">Was $59</span>
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
                <div className="p-4 rounded-xl border border-blue-700 bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Verified Pro</span>
                    <span className="font-black text-blue-100">$15/mo</span>
                  </div>
                  <p className="text-[11px] text-blue-200 font-medium italic">A professional page on our domain</p>
                </div>
              </Link>
              
              <Link href="/checkout?plan=seo" className="block group">
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">Pro Plus</span>
                    <span className="font-black text-slate-900">$49/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium italic">Your own domain + 20 pages built for Google</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
