'use client';

import { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

// RESTORED: Your actual plumbing theme assets
const tradePhotos: Record<string, string[]> = { 
  plumbing: [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=90'
  ] 
};

const parse = (val: string) => {
  if (!val || val.trim() === "") return null;
  const p = val.split(',').map(s => s.trim());
  if (p.length < 4) return null;
  return {
    x: p[0], y: p[1], w: p[2], h: p[3],
    s: { 
      fontSize: p[4] || '30px', 
      color: p[5] || '#000', 
      fontWeight: p[6] || '400', 
      fontFamily: p[8] || 'Anton',
      lineHeight: '1',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center', // VERTICAL CENTERING RESTORED
      width: '100%',
      height: '100%'
    }
  };
};

const MasterTemplate = ({ id, data, configKey, rawDatabase }: any) => {
  const row = rawDatabase[configKey];
  if (!row) return null;

  // STRICT INDEXING: 2 is Hole 1, 3 is Hole 2
  const p1 = parse(row[2]);
  const p2 = parse(row[3]); 
  const h1 = parse(row[4]);
  const h2 = parse(row[5]);
  const s1 = parse(row[6]);
  const s2 = parse(row[7]);
  const s3 = parse(row[8]);
  const s4 = parse(row[9]);
  const ph = parse(row[10]);

  const nameParts = (data.businessName || "").split(' ');
  const first = nameParts[0] || "PRO";
  const rest = nameParts.slice(1).join(' ') || "SERVICES";

  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  const clip = isHex ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : isCircle ? { borderRadius: '50%', overflow: 'hidden' } : {};

  // IMAGE FALLBACK LOGIC
  const photos = tradePhotos.plumbing;
  const img1 = photos[0];
  const img2 = photos[1] || photos[0];

  return (
    <div id={id} className="relative w-full bg-white shadow-xl">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        
        {p1 && (
          <foreignObject x={p1.x} y={p1.y} width={p1.w} height={p1.h}>
            <div style={{ width: '100%', height: '100%', ...clip }}>
              <img src={img1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {p2 && (
          <foreignObject x={p2.x} y={p2.y} width={p2.w} height={p2.h}>
            <div style={{ width: '100%', height: '100%', ...clip }}>
              <img src={img2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {[
          { c: h1, t: first }, { c: h2, t: rest }, { c: ph, t: data.phone },
          { c: s1, t: data.service1 ? `✓ ${data.service1}` : '' },
          { c: s2, t: data.service2 ? `✓ ${data.service2}` : '' },
          { c: s3, t: data.service3 ? `✓ ${data.service3}` : '' },
          { c: s4, t: data.service4 ? `✓ ${data.service4}` : '' }
        ].map((item, i) => item.c && item.t && (
          <foreignObject key={i} x={item.c.x} y={item.c.y} width={item.c.w} height={item.c.h} style={{ overflow: 'visible' }}>
            <div style={item.c.s} className="uppercase">{item.t}</div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const [db, setDb] = useState<Record<string, any>>({});
  const [form, setForm] = useState({ businessName: '', field: '', phone: '', service1: '', service2: '', service3: '', service4: '', themeColor: 'red' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('flyer_form_data');
    if (saved) setForm(JSON.parse(saved));
    fetch(`/templates.csv?v=${Date.now()}`).then(r => r.text()).then(txt => {
      Papa.parse(txt, { header: false, skipEmptyLines: true, complete: (res) => {
          const map: Record<string, any> = {};
          res.data.forEach((r: any) => { if (r[0] && r[0] !== 'Template ID') map[r[0]] = r; });
          setDb(map);
      }});
    });
  }, []);

  useEffect(() => { localStorage.setItem('flyer_form_data', JSON.stringify(form)); }, [form]);

  if (show) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <button onClick={() => setShow(false)} className="mb-8 bg-black text-white px-8 py-3 font-bold uppercase italic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">← Back to Form</button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {['circle', 'square', 'hex'].map(s => (
            <div key={s} className="space-y-4">
              <MasterTemplate id={`f-${s}`} data={form} configKey={`${s}-${form.themeColor}`} rawDatabase={db} />
              <button onClick={async () => {
                const el = document.getElementById(`f-${s}`);
                if (el) {
                  const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
                  const link = document.createElement('a');
                  link.download = `${s}.png`; link.href = url; link.click();
                }
              }} className="w-full bg-black text-white py-4 font-black uppercase tracking-widest border-b-4 border-black">Download {s}</button>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-900 font-sans">
      <div className="bg-white max-w-xl w-full p-10 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase text-center mb-8 italic tracking-tighter">Aretifi Studio</h1>
        <form onSubmit={(e) => { e.preventDefault(); setShow(true); }} className="space-y-4">
          <input value={form.businessName} required placeholder="Business Name" className="w-full border-2 p-4 border-black font-bold uppercase" onChange={e => setForm({...form, businessName: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input value={form.field} required placeholder="Trade" className="w-full border-2 p-4 border-black font-bold uppercase" onChange={e => setForm({...form, field: e.target.value})} />
            <input value={form.phone} required placeholder="Phone" className="w-full border-2 p-4 border-black font-bold uppercase" onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input value={form.service1} required placeholder="Service 1" className="w-full border-2 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service1: e.target.value})} />
            <input value={form.service2} required placeholder="Service 2" className="w-full border-2 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service2: e.target.value})} />
            <input value={form.service3} placeholder="Service 3" className="w-full border-2 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service3: e.target.value})} />
            <input value={form.service4} placeholder="Service 4" className="w-full border-2 p-4 border-black font-bold text-xs" onChange={e => setForm({...form, service4: e.target.value})} />
          </div>
          <select value={form.themeColor} onChange={(e) => setForm({...form, themeColor: e.target.value})} className="w-full border-2 p-4 border-black font-bold uppercase bg-white">
            {THEME_COLORS.map(c => <option key={c} value={c}>{c} edition</option>)}
          </select>
          <button type="submit" className="w-full bg-black text-white font-black py-5 uppercase text-xl italic border-b-8 border-slate-800">Preview Layouts</button>
        </form>
      </div>
    </main>
  );
}
