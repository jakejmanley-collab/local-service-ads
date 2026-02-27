'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

// Expanded asset library to ensure we always have images
const tradePhotos: Record<string, string[]> = { 
  plumbing: [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1607472586893-edb57cbce4ea?auto=format&fit=crop&w=1200&q=90'
  ],
  default: [
    'https://images.unsplash.com/photo-1581578731117-104f2a863a39?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=90'
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

  const firstWord = (data.businessName || "").split(' ')[0] || "PROFESSIONAL";
  const remainingWords = (data.businessName || "").split(' ').slice(1).join(' ') || "SERVICES";

  // Robust Image Selection
  const tradeKey = Object.keys(tradePhotos).find(k => data.field?.toLowerCase().includes(k)) || 'default';
  const photos = tradePhotos[tradeKey];
  const img1 = photos[0];
  const img2 = photos[1] || photos[0];

  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  
  // Stronger clipping for the circles
  const clipStyle: any = isHex 
    ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } 
    : isCircle ? { borderRadius: '1000px', overflow: 'hidden', WebkitMaskImage: '-webkit-radial-gradient(white, black)' } : {};

  return (
    <div id={id} className="relative w-full bg-white shadow-2xl overflow-hidden rounded-sm">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        
        {/* PHOTO 1 */}
        {zones.photo && (
          <foreignObject x={zones.photo.x} y={zones.photo.y} width={zones.photo.width} height={zones.photo.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src={img1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {/* PHOTO 2 */}
        {zones.photo2 && (
          <foreignObject x={zones.photo2.x} y={zones.photo2.y} width={zones.photo2.width} height={zones.photo2.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
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
            <button onClick={() => setShowPreview(false)} className="bg-slate-100 font-bold py-2 px-6 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">← Edit</button>
            <select value={formData.themeColor} onChange={(e) => setFormData({...formData, themeColor: e.target.value})} className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg outline-none">
              {THEME_COLORS.map(c => <option key={c} value={c}>{c.toUpperCase()} THEME</option>)}
            </select>
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
                }} className="w-full bg-slate-900 text-white font-black py-5 rounded-xl uppercase tracking-widest hover:bg-blue-600 transition-all text-center">
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
        <h1 className="text-4xl font-black uppercase text-center mb-10 tracking-tighter italic">Aretifi Studio</h1>
        <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-6">
          <input required placeholder="Business Name" className="w-full border-2 p-4 rounded-xl font-bold focus:border-slate-900 outline-none" onChange={e => setFormData({...formData, businessName: e.target.value})} />
          <div className="grid grid-cols-2 gap-6">
            <input required placeholder="Trade (Plumbing)" className="w-full border-2 p-4 rounded-xl font-bold focus:border-slate-900 outline-none" onChange={e => setFormData({...formData, field: e.target.value})} />
            <input required placeholder="Phone Number" className="w-full border-2 p-4 rounded-xl font-bold focus:border-slate-900 outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Service 1" className="w-full border-2 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service1: e.target.value})} />
            <input required placeholder="Service 2" className="w-full border-2 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service2: e.target.value})} />
            <input placeholder="Service 3" className="w-full border-2 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service3: e.target.value})} />
            <input placeholder="Service 4" className="w-full border-2 p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, service4: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all mt-4">
            Generate Layouts
          </button>
        </form>
      </div>
    </main>
  );
}
