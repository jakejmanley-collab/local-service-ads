'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];
const tradePhotos: Record<string, string[]> = { plumbing: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=90'] };

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

  const photo = parseZone(rawConfig['Photo Hole']);
  const photo2 = parseZone(rawConfig['Photo Hole 2']);
  const zones = {
    headerTop: parseZone(rawConfig['Header Top']),
    headerBottom: parseZone(rawConfig['Header Bottom']),
    phone: parseZone(rawConfig['Phone']),
    services: [parseZone(rawConfig['Service 1']), parseZone(rawConfig['Service 2']), parseZone(rawConfig['Service 3']), parseZone(rawConfig['Service 4'])]
  };

  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  const clip = isHex ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : isCircle ? { borderRadius: '50%', overflow: 'hidden' } : {};

  return (
    <div id={id} className="relative w-full bg-white shadow-2xl overflow-hidden">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        {photo && (
          <foreignObject x={photo.x} y={photo.y} width={photo.width} height={photo.height}>
            <div style={{ width: '100%', height: '100%', ...clip }}>
              <img src={tradePhotos.plumbing[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}
        {[
          { conf: zones.headerTop, text: data.businessName.split(' ')[0] },
          { conf: zones.headerBottom, text: data.businessName.split(' ').slice(1).join(' ') },
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

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white p-6 border-2 border-slate-900 rounded-xl">
            <button onClick={() => setShowPreview(false)} className="font-bold px-4 py-2 bg-slate-100 rounded">← Back</button>
            <select value={formData.themeColor} onChange={(e) => setFormData({...formData, themeColor: e.target.value})} className="bg-slate-900 text-white font-bold px-6 py-2 rounded">
              {THEME_COLORS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {['circle', 'square', 'hex'].map(shape => (
              <div key={shape} className="flex flex-col gap-4">
                <MasterTemplate id={`f-${shape}`} data={{...formData, services: [formData.service1, formData.service2, formData.service3, formData.service4].filter(Boolean)}} configKey={`${shape}-${formData.themeColor}`} rawDatabase={rawDatabase} />
                <button onClick={async () => {
                  const el = document.getElementById(`f-${shape}`);
                  if (el) {
                    const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
                    const link = document.createElement('a');
                    link.download = `${shape}.png`;
                    link.href = url;
                    link.click();
                  }
                }} className="w-full bg-slate-900 text-white font-bold py-4 rounded uppercase">Download</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-xl w-full p-8 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-4">
          <h1 className="text-2xl font-black uppercase text-center mb-6">Flyer Generator</h1>
          <input required placeholder="Business Name" className="w-full border-2 p-3 rounded" onChange={e => setFormData({...formData, businessName: e.target.value})} />
          <input required placeholder="Phone" className="w-full border-2 p-3 rounded" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input required placeholder="Service 1" className="w-full border-2 p-3 rounded" onChange={e => setFormData({...formData, service1: e.target.value})} />
          <input required placeholder="Service 2" className="w-full border-2 p-3 rounded" onChange={e => setFormData({...formData, service2: e.target.value})} />
          <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded uppercase">Preview</button>
        </form>
      </div>
    </main>
  );
}
