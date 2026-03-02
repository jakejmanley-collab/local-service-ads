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
  const [isFetching, setIsFetching] = useState(false);

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

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setCopy(null); // Clear previous copy
    try {
      const [imgRes, copyRes] = await Promise.all([
        fetch('/api/generate-trade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trade: form.field }) }),
        fetch('/api/generate-listing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessName: form.businessName, trade: form.field, services: [form.service1, form.service2, form.service3, form.service4].filter(Boolean) }) })
      ]);

      const imgData = await imgRes.json();
      const copyData = await copyRes.json();

      if (imgRes.ok) setPhotos([imgData.photo1, imgData.photo2]);
      
      if (copyRes.ok) {
        console.log("SUCCESS: Copy received", copyData);
        setCopy(copyData);
      } else {
        console.error("API ERROR: Copy failed", copyData);
      }
    } catch (err) { 
      console.error("NETWORK ERROR:", err); 
    }
    setIsFetching(false);
    setShow(true);
  };

  if (show) {
    return (
      <main className="min-h-screen p-8 bg-slate-50 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button onClick={() => setShow(false)} className="px-6 py-2 bg-black text-white font-bold uppercase italic self-start border-b-4 border-gray-700">← Back</button>
          <div className="bg-white p-4 border-2 border-black flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black uppercase text-xs italic">Flyer Edition:</span>
            <div className="flex gap-2">
              {THEME_COLORS.map(color => (
                <button key={color} onClick={() => setForm({...form, themeColor: color})} className={`w-8 h-8 border-2 border-black ${form.themeColor === color ? 'ring-2 ring-black ring-offset-2 scale-110' : ''}`} style={{ backgroundColor: color === 'gold' ? '#D4AF37' : color }} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {['circle', 'square', 'hex'].map(s => (
              <div key={s} id={`f-${s}`} className="border-4 border-black bg-white shadow-lg">
                <MasterTemplate id={`t-${s}`} data={form} configKey={`${s}-${form.themeColor}`} rawDatabase={db} photo1={photos[0]} photo2={photos[1]} />
                <button onClick={async () => {
                  const el = document.getElementById(`f-${s}`);
                  if (el) {
                    const url = await toPng(el, { pixelRatio: 2 });
                    const link = document.createElement('a');
                    link.download = `${s}.png`; link.href = url; link.click();
                  }
                }} className="w-full bg-black text-white py-3 font-black uppercase text-xs">Download {s}</button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 border-4 border-black h-fit shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic mb-4 border-b-2 border-black pb-2">Marketplace Copy</h2>
            
            <div className="flex mb-4 border-2 border-black overflow-hidden">
              {['professional', 'friendly', 'aggressive'].map(t => (
                <button key={t} onClick={() => setActiveTone(t)} className={`flex-1 py-1 text-[8px] font-black uppercase border-r last:border-0 ${activeTone === t ? 'bg-black text-white' : 'bg-white text-black'}`}>{t}</button>
              ))}
            </div>

            {copy ? (
              <div className="space-y-4">
                <p className="font-bold border-2 border-black border-dashed p-2 text-sm bg-slate-50">{copy[activeTone]?.headline}</p>
                <textarea readOnly className="w-full h-80 text-xs border-2 border-black p-2 font-sans bg-slate-50" value={copy[activeTone]?.description} />
                <button onClick={() => { navigator.clipboard.writeText(copy[activeTone]?.description); alert('Copied!'); }} className="w-full bg-black text-white py-3 font-black uppercase italic text-sm">Copy Text</button>
              </div>
            ) : (
              <div className="py-20 text-center animate-pulse font-black uppercase text-xs italic bg-gray-50 border-2 border-black border-dashed">
                Writing sales copy...
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white max-w-xl w-full p-10 border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase text-center mb-8 italic tracking-tighter">Aretifi Studio</h1>
        <form onSubmit={handlePreview} className="space-y-4">
          <input value={form.businessName} required placeholder="Business Name" className="w-full border-4 p-4 border-black font-bold uppercase outline-none focus:bg-yellow-50" onChange={e => setForm({...form, businessName: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input value={form.field} required placeholder="Trade" className="w-full border-4 p-4 border-black font-bold uppercase placeholder:text-gray-400" onChange={e => setForm({...form, field: e.target.value})} />
            <input value={form.phone} required placeholder="Phone" className="w-full border-4 p-4 border-black font-bold uppercase placeholder:text-gray-400" onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input value={form.service1} required placeholder="Service 1" className="w-full border-4 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service1: e.target.value})} />
            <input value={form.service2} required placeholder="Service 2" className="w-full border-4 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service2: e.target.value})} />
            <input value={form.service3} placeholder="Service 3" className="w-full border-4 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service3: e.target.value})} />
            <input value={form.service4} placeholder="Service 4" className="w-full border-4 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service4: e.target.value})} />
          </div>
          <button type="submit" disabled={isFetching} className="w-full bg-black text-white font-black py-6 uppercase text-2xl italic border-b-8 border-gray-800 active:translate-y-2 active:border-b-0 transition-all">
            {isFetching ? 'Processing AI Magic...' : 'Generate Assets'}
          </button>
        </form>
      </div>
    </main>
  );
}
