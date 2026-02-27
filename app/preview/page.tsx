'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

const parseZone = (csvString: any) => {
  if (!csvString || typeof csvString !== 'string') return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length < 4) return null;
  let fontSize = parts[4] || '30px';
  if (!fontSize.includes('px')) fontSize += 'px';

  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: { 
      fontSize, 
      color: parts[5] || '#000000', 
      fontWeight: parts[6] || '400', 
      fontStyle: parts[7] || 'normal', 
      fontFamily: parts[8] || 'Anton',
      lineHeight: '1', 
      display: 'flex', 
      alignItems: 'center', 
      overflow: 'visible', 
      whiteSpace: 'nowrap'
    }
  };
};

const MasterTemplate = ({ id, data, configKey, rawDatabase }: any) => {
  const rowData = rawDatabase[configKey];
  if (!rowData) return null;

  // We are accessing by ARRAY INDEX to prevent Header Mismatch issues
  // Index 0: ID, 1: Canvas, 2: Photo 1, 3: Photo 2, 4: Header T, 5: Header B...
  const zones = {
    photo1: parseZone(rowData[2]),
    photo2: parseZone(rowData[3]),
    headerTop: parseZone(rowData[4]),
    headerBottom: parseZone(rowData[5]),
    service1: parseZone(rowData[6]),
    service2: parseZone(rowData[7]),
    service3: parseZone(rowData[8]),
    service4: parseZone(rowData[9]),
    phone: parseZone(rowData[10]),
  };

  const nameParts = (data.businessName || "").split(' ');
  const first = nameParts[0] || "PRO";
  const rest = nameParts.slice(1).join(' ') || "SERVICES";

  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  const clipStyle = isHex 
    ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } 
    : isCircle ? { borderRadius: '50%', overflow: 'hidden' } : {};

  return (
    <div id={id} className="relative w-full bg-white shadow-xl">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        
        {zones.photo1 && (
          <foreignObject x={zones.photo1.x} y={zones.photo1.y} width={zones.photo1.width} height={zones.photo1.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {zones.photo2 && (
          <foreignObject x={zones.photo2.x} y={zones.photo2.y} width={zones.photo2.width} height={zones.photo2.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src="https://images.unsplash.com/photo-1607472586893-edb57cbce4ea?q=80&w=800" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {[
          { conf: zones.headerTop, text: first },
          { conf: zones.headerBottom, text: rest },
          { conf: zones.phone, text: data.phone },
          { conf: zones.service1, text: data.service1 ? `✓ ${data.service1}` : '' },
          { conf: zones.service2, text: data.service2 ? `✓ ${data.service2}` : '' },
          { conf: zones.service3, text: data.service3 ? `✓ ${data.service3}` : '' },
          { conf: zones.service4, text: data.service4 ? `✓ ${data.service4}` : '' },
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
  const [formData, setFormData] = useState({ 
    businessName: '', field: '', phone: '', 
    service1: '', service2: '', service3: '', service4: '', 
    themeColor: 'red' 
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch(`/templates.csv?v=${Date.now()}`).then(res => res.text()).then(csvText => {
      // Changed to header: false so we can use Index Mapping
      Papa.parse(csvText, { header: false, skipEmptyLines: true, complete: (res) => {
          const db: Record<string, any> = {};
          res.data.forEach((row: any) => { 
            if (row[0] && row[0] !== 'Template ID') db[row[0]] = row; 
          });
          setRawDatabase(db);
      }});
    });
  }, []);

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white p-4 border-2 border-black">
            <button onClick={() => setShowPreview(false)} className="bg-slate-100 border-2 border-black px-6 py-2 font-black uppercase italic">← Edit Form</button>
            <select value={formData.themeColor} onChange={(e) => setFormData({...formData, themeColor: e.target.value})} className="bg-black text-white px-4 py-2 font-bold outline-none">
              {THEME_COLORS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {['circle', 'square', 'hex'].map(shape => (
              <div key={shape} className="space-y-4">
                <MasterTemplate id={`f-${shape}`} data={formData} configKey={`${shape}-${formData.themeColor}`} rawDatabase={rawDatabase} />
                <button onClick={async () => {
                  const el = document.getElementById(`f-${shape}`);
                  if (el) {
                    const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
                    const link = document.createElement('a');
                    link.download = `${shape}.png`;
                    link.href = url;
                    link.click();
                  }
                }} className="w-full bg-black text-white font-black py-4 uppercase tracking-tighter italic border-b-4 border-r-4 border-slate-700 active:border-0 transition-all">Download {shape}</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-900 font-sans">
      <div className="bg-white max-w-xl w-full p-10 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase text-center mb-8 italic tracking-tighter">Aretifi Studio</h1>
        <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-4">
          <input required placeholder="Business Name" className="w-full border-2 p-4 border-black font-bold uppercase" onChange={e => setFormData({...formData, businessName: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Trade" className="w-full border-2 p-4 border-black font-bold uppercase" onChange={e => setFormData({...formData, field: e.target.value})} />
            <input required placeholder="Phone" className="w-full border-2 p-4 border-black font-bold uppercase" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Service 1" className="w-full border-2 p-4 border-black font-bold uppercase text-xs" onChange={e => setFormData({...formData, service1: e.target.value})} />
            <input required placeholder="Service 2" className="w-full border-2 p-4 border-black font-bold uppercase text-xs" onChange={e => setFormData({...formData, service2: e.target.value})} />
            <input placeholder="Service 3" className="w-full border-2 p-4 border-black font-bold uppercase text-xs" onChange={e => setFormData({...formData, service3: e.target.value})} />
            <input placeholder="Service 4" className="w-full border-2 p-4 border-black font-bold uppercase text-xs" onChange={e => setFormData({...formData, service4: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-black text-white font-black py-5 uppercase tracking-widest text-xl italic border-b-8 border-slate-800 active:border-0">Preview Layouts</button>
        </form>
      </div>
    </main>
  );
}
