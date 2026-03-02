'use client';

import { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];
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
        {p1 && <foreignObject x={p1.x} y={p1.y} width={p1.w} height={p1.h}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo1} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { e.currentTarget.src = FALLBACK_1; }} /></div></foreignObject>}
        {p2 && <foreignObject x={p2.x} y={p2.y} width={p2.w} height={p2.h}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo2} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { e.currentTarget.src = FALLBACK_2; }} /></div></foreignObject>}
        {[{ c: h1, t: first }, { c: h2, t: rest }, { c: ph, t: data.phone, isPhone: true }, { c: s1, t: data.service1 ? `✓ ${data.service1}` : '' }, { c: s2, t: data.service2 ? `✓ ${data.service2}` : '' }, { c: s3, t: data.service3 ? `✓ ${data.service3}` : '' }, { c: s4, t: data.service4 ? `✓ ${data.service4}` : '' }].map((item, i) => {
          if (!item.c || !item.t) return null;
          const widthBuffer = (item.isPhone && isHex) ? 100 : 0;
          const xOffset = (item.isPhone && isCircle) ? -40 : 0;
          return <foreignObject key={i} x={parseFloat(item.c.x) + xOffset} y={item.c.y} width={parseFloat(item.c.w) + widthBuffer} height={item.c.h} style={{ overflow: 'visible' }}><div style={item.c.s} className="w-full h-full uppercase whitespace-nowrap">{item.t}</div></foreignObject>;
        })}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const [db, setDb] = useState<Record<string, any>>({});
  const [form, setForm] = useState({ businessName: '', field: '', phone: '', service1: '', service2: '', service3: '', service4: '', themeColor: 'red' });
  const [show, setShow] = useState(false);
  const [photos, setPhotos] = useState([FALLBACK_1, FALLBACK_2]);
  const [copy, setCopy] = useState<any>(null);
  const [activeTone, setActiveTone] = useState('professional');
  const [credits, setCredits] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('flyer_form_data');
    if (saved) setForm(JSON.parse(saved));
    fetch(`/templates.csv?v=${Date.now()}`).then(r => r.text()).then(txt => {
      Papa.parse(txt, { header: true, skipEmptyLines: true, complete: (res) => {
          const map: Record<string, any> = {};
          res.data.forEach((r: any) => { if (r['Template ID']) map[r['Template ID']] = r; });
          setDb(map);
      }});
    });
  }, []);

  // NEW: MOBILE SHARE FUNCTION
  const shareKit = async () => {
    try {
      const files: File[] = [];
      const shapes = ['circle', 'square', 'hex'];
      
      for (const s of shapes) {
        const el = document.getElementById(`f-${s}`);
        if (el) {
          const dataUrl = await toPng(el, { pixelRatio: 2 });
          const blob = await (await fetch(dataUrl)).blob();
          files.push(new File([blob], `${s}-flyer.png`, { type: 'image/png' }));
        }
      }

      const shareData: ShareData = {
        title: `${form.businessName} Ads`,
        text: copy ? `Headline: ${copy[activeTone].headline}\n\n${copy[activeTone].description}` : '',
        files: files
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Your browser doesn't support sharing. Please download images individually.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setErrorMsg('');
    try {
      const [imgRes, copyRes] = await Promise.all([
        fetch('/api/generate-trade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trade: form.field }) }),
        fetch('/api/generate-listing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessName: form.businessName, trade: form.field, services: [form.service1, form.service2, form.service3, form.service4].filter(Boolean) }) })
      ]);
      const imgData = await imgRes.json();
      const copyData = await copyRes.json();
      if (copyRes.status === 429) { setErrorMsg(copyData.error); setIsFetching(false); return; }
      if (imgRes.ok) setPhotos([imgData.photo1, imgData.photo2]);
      if (copyRes.ok) { setCopy(copyData); setCredits(copyData.remainingCredits); }
    } catch (err) { console.error(err); }
    setIsFetching(false);
    setShow(true);
  };

  if (show) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-slate-50 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setShow(false)} className="px-4 py-2 bg-black text-white font-bold uppercase italic border-b-4 border-gray-700 text-sm">← Back</button>
            <button onClick={shareKit} className="px-4 py-2 bg-blue-600 text-white font-bold uppercase italic border-b-4 border-blue-800 text-sm animate-pulse">Share Full Kit</button>
            {credits !== null && <span className="bg-yellow-400 border-2 border-black px-3 py-1 text-[10px] font-black uppercase italic">{credits} Left</span>}
          </div>
          <div className="flex gap-2 bg-white p-2 border-2 border-black">
            {THEME_COLORS.map(color => (
              <button key={color} onClick={() => setForm({...form, themeColor: color})} className={`w-7 h-7 border-2 border-black ${form.themeColor === color ? 'scale-110 ring-2 ring-black' : ''}`} style={{ backgroundColor: color === 'gold' ? '#D4AF37' : color }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {['circle', 'square', 'hex'].map(s => (
              <div key={s} id={`f-${s}`} className="border-4 border-black bg-white">
                <MasterTemplate id={`t-${s}`} data={form} configKey={`${s}-${form.themeColor}`} rawDatabase={db} photo1={photos[0]} photo2={photos[1]} />
                <button onClick={async () => {
                  const el = document.getElementById(`f-${s}`);
                  if (el) {
                    const url = await toPng(el, { pixelRatio: 2 });
                    const link = document.createElement('a');
                    link.download = `${s}.png`; link.href = url; link.click();
                  }
                }} className="w-full bg-slate-100 text-black py-2 font-black uppercase text-[10px] border-t-2 border-black">Download Image Only</button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 border-4 border-black h-fit shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic mb-4 border-b-2 border-black pb-2">Listing Copy</h2>
            <div className="flex mb-4 border-2 border-black overflow-hidden">
              {['professional', 'friendly', 'aggressive'].map(t => (
                <button key={t} onClick={() => setActiveTone(t)} className={`flex-1 py-1 text-[8px] font-black uppercase border-r last:border-0 ${activeTone === t ? 'bg-black text-white' : 'bg-white text-black'}`}>{t}</button>
              ))}
            </div>
            {copy && (
              <div className="space-y-4">
                <p className="font-bold border-2 border-black border-dashed p-2 text-sm bg-slate-50">{copy[activeTone]?.headline}</p>
                <textarea readOnly className="w-full h-64 text-xs border-2 border-black p-2 font-sans bg-slate-50" value={copy[activeTone]?.description} />
                <button onClick={() => { navigator.clipboard.writeText(copy[activeTone]?.description); alert('Copied!'); }} className="w-full bg-black text-white py-3 font-black uppercase italic text-sm">Copy Description</button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white max-w-xl w-full p-6 md:p-10 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase text-center mb-6 italic tracking-tighter">Aretifi Studio</h1>
        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 border-2 border-red-600 font-bold uppercase text-[10px] text-center">{errorMsg}</div>}
        <form onSubmit={handlePreview} className="space-y-3">
          <input value={form.businessName} required placeholder="Business Name" className="w-full border-4 p-3 border-black font-bold uppercase outline-none focus:bg-yellow-50" onChange={e => setForm({...form, businessName: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.field} required placeholder="Trade" className="w-full border-4 p-3 border-black font-bold uppercase" onChange={e => setForm({...form, field: e.target.value})} />
            <input value={form.phone} required placeholder="Phone" className="w-full border-4 p-3 border-black font-bold uppercase" onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['service1', 'service2', 'service3', 'service4'].map((s, i) => (
              <input key={s} value={(form as any)[s]} required={i < 2} placeholder={`Service ${i+1}`} className="w-full border-4 p-3 border-black font-bold text-xs" onChange={e => setForm({...form, [s]: e.target.value})} />
            ))}
          </div>
          <button type="submit" disabled={isFetching} className="w-full bg-black text-white font-black py-5 uppercase text-xl italic border-b-8 border-gray-800 active:translate-y-2 active:border-b-0 transition-all">
            {isFetching ? 'Working...' : 'Generate Assets'}
          </button>
        </form>
      </div>
    </main>
  );
}
