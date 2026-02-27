'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

// FIXED: Added a second high-res photo for plumbing
const tradePhotos: Record<string, string[]> = { 
  plumbing: [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=90'
  ] 
};

const parseZone = (csvString: any) => {
  if (!csvString || typeof csvString !== 'string') return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length < 4) return null;
  let fontSize = parts[4] || '30px';
  if (!fontSize.includes('px')) fontSize += 'px';

  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: { 
      fontSize, color: parts[5] || '#000000', fontWeight: parts[6] || '400', fontStyle: parts[7] || 'normal', fontFamily: parts[8] || 'Anton',
      lineHeight: '1', display: 'flex', alignItems: 'center', overflow: 'visible', whiteSpace: 'nowrap'
    }
  };
};

const MasterTemplate = ({ id, data, configKey, rawDatabase }: any) => {
  const rawConfig = rawDatabase[configKey];
  if (!rawConfig) return null;

  const zones = {
    photo: parseZone(rawConfig['Photo Hole']),
    photo2: parseZone(rawConfig['Photo Hole 2']),
    headerTop: parseZone(rawConfig['Header Top']),
    headerBottom: parseZone(rawConfig['Header Bottom']),
    phone: parseZone(rawConfig['Phone']),
    services: [parseZone(rawConfig['Service 1']), parseZone(rawConfig['Service 2']), parseZone(rawConfig['Service 3']), parseZone(rawConfig['Service 4'])]
  };

  const tradeWords = (data.businessName || "").split(' ');
  const firstWord = tradeWords[0] || "PROFESSIONAL";
  const remainingWords = tradeWords.slice(1).join(' ') || "SERVICES";

  // CLIPPING LOGIC
  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  const clip = isHex ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : isCircle ? { borderRadius: '50%', overflow: 'hidden' } : {};

  // PHOTO SELECTION LOGIC
  const photos = tradePhotos.plumbing; 
  const img1 = photos[0];
  const img2 = photos[1] || photos[0]; // Fallback to first photo if second doesn't exist

  return (
    <div id={id} className="relative w-full bg-white shadow-2xl overflow-hidden rounded-sm">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        
        {/* MAIN PHOTO */}
        {zones.photo && (
          <foreignObject x={zones.photo.x} y={zones.photo.y} width={zones.photo.width} height={zones.photo.height}>
            <div style={{ width: '100%', height: '100%', ...clip }}>
              <img src={img1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {/* FIXED: SECOND PHOTO HOLE RENDERING */}
        {zones.photo2 && (
          <foreignObject x={zones.photo2.x} y={zones.photo2.y} width={zones.photo2.width} height={zones.photo2.height}>
            <div style={{ width: '100%', height: '100%', ...clip }}>
              <img src={img2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {[
          { conf: zones.headerTop, text: firstWord },
          { conf: zones.headerBottom, text: remainingWords },
          { conf: zones.phone, text: data.phone },
          ...zones.services.map((s, i) => ({ conf: s, text: data.services[i] ? `✓ ${data.services[i]}` : '' }))
        ].map((item, i) => item.conf && item.text && (
          <foreignObject key={i} x={item.conf.x} y={item.conf.y} width={item.conf.width} height={item.conf.height} style={{ overflow: 'visible' }}>
            <div className="w-full h-full flex items-center uppercase" style={item.conf.style}>{item.text}</div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({ businessName: '', field: '', service1: '', service2: '', service3: '', service4: '', phone: '', themeColor: 'red' });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch(`/templates.csv?v=${new Date().getTime()}`).then(res => res.text()).then(csvText => {
      Papa.parse(csvText, { header: true, skipEmptyLines: true, transformHeader: h => h.trim(), complete: (res) => {
          const db: Record<string, any> = {};
          res.data.forEach((row: any) => { if (row['Template ID']) db[row['Template ID']] = row; });
          setRawDatabase(db);
      }});
    });
  }, []);

  const parsedData = { ...formData, services: [formData.service1, formData.service2, formData.service3, formData.service4].filter(Boolean) };

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setShowPreview(false)} className="bg-slate-100 font-bold py-2 px-6 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">← Back to Form</button>
            <div className="flex items-center gap-4">
               <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Theme:</span>
               <select value={formData.themeColor} onChange={(e) => setFormData({...formData, themeColor: e.target.value})} className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg outline-none cursor-pointer">
                {THEME_COLORS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {['circle', 'square', 'hex'].map(shape => {
              const key = `${shape}-${formData.themeColor}`;
              return rawDatabase[key] && <div key={shape} className="flex flex-col gap-6">
                <MasterTemplate id={`f-${shape}`} data={parsedData} configKey={key} rawDatabase={rawDatabase} />
                <button onClick={async () => {
                  const el = document.getElementById(`f-${shape}`);
                  if (el) {
                    const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
                    const link = document.createElement('a');
                    link.download = `${shape}.png`;
                    link.href = url;
                    link.click();
                  }
                }} className="w-full bg-slate-900 text-white font-black py-5 rounded-xl uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:translate-y-1 text-center">
                  Download {shape}
                </button>
              </div>
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full p-10 rounded-3xl border-2 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Aretifi Studio</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">Commercial Flyer Engine</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Business Name</label>
            <input required placeholder="Apex Plumbing" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold focus:border-slate-900 outline-none" onChange={e => setFormData({...formData, businessName: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Trade</label>
              <input required placeholder="Plumbing" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold focus:border-slate-900 outline-none" onChange={e => setFormData({...formData, field: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone</label>
              <input required placeholder="555-0123" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold focus:border-slate-900 outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Services</label>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Service 1" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service1: e.target.value})} />
              <input required placeholder="Service 2" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service2: e.target.value})} />
              <input placeholder="Service 3" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service3: e.target.value})} />
              <input placeholder="Service 4" className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service4: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Color Theme</label>
            <select value={formData.themeColor} onChange={(e) => setFormData({...formData, themeColor: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl font-bold bg-white focus:border-slate-900 outline-none">
              {THEME_COLORS.map(c => <option key={c} value={c}>{c.toUpperCase()} EDITION</option>)}
            </select>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all active:translate-y-1 mt-4">
            Generate Layouts
          </button>
        </form>
      </div>
    </main>
  );
}
