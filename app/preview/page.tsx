'use client';

import { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

const parse = (val: string) => {
  if (!val || val.trim() === "") return null;
  const p = val.split(',').map(s => s.trim());
  if (p.length < 4) return null;
  return {
    x: parseFloat(p[0]), y: parseFloat(p[1]), w: parseFloat(p[2]), h: parseFloat(p[3]),
    s: { 
      fontSize: p[4] || '30px', color: p[5] || '#000', fontWeight: p[6] || '400', 
      fontFamily: p[8] || 'Anton', lineHeight: '1', whiteSpace: 'nowrap'
    }
  };
};

const MasterTemplate = ({ id, data, configKey, rawDatabase }: any) => {
  const row = rawDatabase[configKey];
  if (!row) return null;

  const p1 = parse(row[2]);
  const p2 = parse(row[3]); 
  const h1 = parse(row[4]);
  const h2 = parse(row[5]);
  const s1 = parse(row[6]);
  const s2 = parse(row[7]);
  const s3 = parse(row[8]);
  const s4 = parse(row[9]);
  const ph = parse(row[10]);

  const words = (data.businessName || "").split(' ');
  const first = words[0] || "PRO";
  const rest = words.slice(1).join(' ') || "SERVICES";

  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');

  return (
    <div id={id} className="relative w-full bg-white shadow-xl">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Native SVG Clipping - NO CSS REQUIRED */}
          {isCircle && p1 && (
            <clipPath id="clip1"><circle cx={p1.x + p1.w/2} cy={p1.y + p1.h/2} r={p1.w/2} /></clipPath>
          )}
          {isCircle && p2 && (
            <clipPath id="clip2"><circle cx={p2.x + p2.w/2} cy={p2.y + p2.h/2} r={p2.w/2} /></clipPath>
          )}
          {isHex && (
            <clipPath id="clipHex"><polygon points="540,0 1080,270 1080,810 540,1080 0,810 0,270" /></clipPath>
          )}
        </defs>

        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        
        {/* IMAGE 1 */}
        {p1 && (
          <image 
            href="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"
            x={p1.x} y={p1.y} width={p1.w} height={p1.h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={isCircle ? "url(#clip1)" : ""}
            crossOrigin="anonymous"
          />
        )}

        {/* IMAGE 2 */}
        {p2 && (
          <image 
            href="https://images.unsplash.com/photo-1621905231727-07ea374aa53d?w=800"
            x={p2.x} y={p2.y} width={p2.w} height={p2.h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={isCircle ? "url(#clip2)" : ""}
            crossOrigin="anonymous"
          />
        )}

        {/* TEXT FIELDS - Fixed alignment via dominant-baseline */}
        {[
          { c: h1, t: first }, { c: h2, t: rest }, { c: ph, t: data.phone },
          { c: s1, t: data.service1 ? `✓ ${data.service1}` : '' },
          { c: s2, t: data.service2 ? `✓ ${data.service2}` : '' },
          { c: s3, t: data.service3 ? `✓ ${data.service3}` : '' },
          { c: s4, t: data.service4 ? `✓ ${data.service4}` : '' }
        ].map((item, i) => item.c && item.t && (
          <text 
            key={i} 
            x={item.c.x} 
            y={item.c.y + (item.c.h / 2)} 
            fill={item.c.s.color}
            style={{ 
              fontSize: item.c.s.fontSize, 
              fontFamily: item.c.s.fontFamily, 
              fontWeight: item.c.s.fontWeight,
              textTransform: 'uppercase'
            }}
            dominantBaseline="central"
          >
            {item.t}
          </text>
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
    if (saved) setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
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
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900 font-sans">
        <button onClick={() => setShow(false)} className="mb-8 bg-black text-white px-8 py-3 font-bold uppercase italic border-2 border-black">← Back</button>
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
              }} className="w-full bg-black text-white py-4 font-black uppercase">Download {s}</button>
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
          <button type="submit" className="w-full bg-black text-white font-black py-5 uppercase text-xl italic border-b-8 border-slate-800">Preview</button>
        </form>
      </div>
    </main>
  );
}
