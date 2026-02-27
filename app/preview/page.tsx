'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

const tradePhotos: Record<string, string[]> = {
  plumbing: [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1607472586893-edb57cbce4ea?auto=format&fit=crop&w=1200&q=90'
  ],
  hvac: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=90'
  ],
  landscaping: [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1592424001807-6c2e361239c4?auto=format&fit=crop&w=1200&q=90'
  ],
  cleaning: [
    'https://images.unsplash.com/photo-1581578731117-104f2a863a39?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=90'
  ],
  drywall: [
    'https://images.unsplash.com/photo-1505082823024-00d346e9dd98?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=90'
  ],
  electrical: [
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=90'
  ],
  roofing: [
    'https://images.unsplash.com/photo-1632758999321-df621a50a1eb?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=90'
  ],
  painting: [
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=90'
  ],
  default: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1541888087519-9ee146f8fb01?auto=format&fit=crop&w=1200&q=90'
  ]
};

const parseZone = (csvString: any) => {
  if (!csvString || typeof csvString !== 'string') return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length < 4) return null;
  
  let fontSize = parts[4] || '30px';
  if (!fontSize.includes('px') && !fontSize.includes('rem') && !fontSize.includes('em')) {
    fontSize += 'px';
  }

  let color = parts[5] || '#000000';
  if (color && !color.startsWith('#') && (color.length === 6 || color.length === 3)) {
    color = `#${color}`;
  }

  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: { 
      fontSize: fontSize, 
      color: color, 
      fontWeight: parts[6] || '400', 
      fontStyle: parts[7] || 'normal', 
      fontFamily: parts[8] || 'Anton',
      lineHeight: '1.1',
      display: 'flex',
      alignItems: 'center',
      overflow: 'visible', // Ensure large fonts don't disappear
      whiteSpace: 'nowrap'
    }
  };
};

const MasterTemplate = ({ id, data, photoUrl, photoUrl2, configKey, rawDatabase }: any) => {
  const rawConfig = rawDatabase[configKey];
  if (!rawConfig) return null;

  const zones = {
    photo: parseZone(rawConfig['Photo Hole']),
    photo2: parseZone(rawConfig['Photo Hole 2']),
    headerTop: parseZone(rawConfig['Header Top']),
    headerBottom: parseZone(rawConfig['Header Bottom']),
    phone: parseZone(rawConfig['Phone']),
    website: parseZone(rawConfig['Website']),
    location: parseZone(rawConfig['Location']),
    services: [
      parseZone(rawConfig['Service 1']), 
      parseZone(rawConfig['Service 2']),
      parseZone(rawConfig['Service 3']), 
      parseZone(rawConfig['Service 4'])
    ]
  };

  const mainTitle = data.businessName || data.field || 'PROFESSIONAL';
  const tradeWords = mainTitle.split(' ');
  const firstWord = tradeWords[0];
  const remainingWords = tradeWords.slice(1).join(' ');

  const viewBoxStr = rawConfig['Canvas Dimensions'] ? `0 0 ${rawConfig['Canvas Dimensions'].replace('x', ' ')}` : "0 0 1080 1080";
  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  
  const clipStyle = isHex 
    ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } 
    : isCircle 
      ? { borderRadius: '50%', overflow: 'hidden' } 
      : {};

  return (
    <div id={id} className="relative w-full bg-white overflow-hidden shadow-2xl">
      <svg viewBox={viewBoxStr} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        
        {zones.photo && (
          <foreignObject x={zones.photo.x} y={zones.photo.y} width={zones.photo.width} height={zones.photo.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src={photoUrl} alt="Trade 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}

        {zones.photo2 && (
          <foreignObject x={zones.photo2.x} y={zones.photo2.y} width={zones.photo2.width} height={zones.photo2.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src={photoUrl2} alt="Trade 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}
        
        {zones.headerTop && (
          <foreignObject x={zones.headerTop.x} y={zones.headerTop.y} width={zones.headerTop.width} height={zones.headerTop.height} style={{ overflow: 'visible' }}>
            <div className="w-full h-full flex items-center uppercase leading-none tracking-tighter" style={zones.headerTop.style}>{firstWord}</div>
          </foreignObject>
        )}
        
        {zones.headerBottom && (
          <foreignObject x={zones.headerBottom.x} y={zones.headerBottom.y} width={zones.headerBottom.width} height={zones.headerBottom.height} style={{ overflow: 'visible' }}>
            <div className="w-full h-full flex items-center uppercase leading-none tracking-tighter" style={zones.headerBottom.style}>{remainingWords}</div>
          </foreignObject>
        )}
        
        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = zones.services[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height} style={{ overflow: 'visible' }}>
              <div className="w-full h-full flex items-center uppercase" style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}
        
        {zones.phone && (
          <foreignObject x={zones.phone.x} y={zones.phone.y} width={zones.phone.width} height={zones.phone.height} style={{ overflow: 'visible' }}>
            <div className="w-full h-full flex items-center" style={zones.phone.style}>{data.phone || '555-0123'}</div>
          </foreignObject>
        )}

        {zones.website && (
          <foreignObject x={zones.website.x} y={zones.website.y} width={zones.website.width} height={zones.website.height} style={{ overflow: 'visible' }}>
            <div className="w-full h-full flex items-center" style={zones.website.style}>WWW.ARETIFI.COM</div>
          </foreignObject>
        )}

        {zones.location && (
          <foreignObject x={zones.location.x} y={zones.location.y} width={zones.location.width} height={zones.location.height} style={{ overflow: 'visible' }}>
            <div className="w-full h-full flex items-center font-bold" style={zones.location.style}>LOCAL SERVICE AREA</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    businessName: '', field: '', service1: '', service2: '', service3: '', service4: '', phone: '', themeColor: 'red'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedPhoto2, setSelectedPhoto2] = useState<string>('');

  useEffect(() => {
    fetch(`/templates.csv?v=${new Date().getTime()}`)
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true, 
          skipEmptyLines: true, 
          transformHeader: (h) => h.trim(),
          complete: (results) => {
            const newDb: Record<string, any> = {};
            results.data.forEach((row: any) => {
              if (row['Template ID']) newDb[row['Template ID']] = row;
            });
            setRawDatabase(newDb);
          }
        });
      });
  }, []);

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const tradeKey = Object.keys(tradePhotos).find(k => formData.field.toLowerCase().includes(k)) || 'default';
    const photos = tradePhotos[tradeKey];
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    setSelectedPhoto(shuffled[0]);
    setSelectedPhoto2(shuffled[1] || shuffled[0]); 
    setShowPreview(true);
  };

  const downloadFlyer = useCallback(async (elementId: string, shapeName: string) => {
    setDownloadingId(elementId);
    const el = document.getElementById(elementId);
    if (el) {
      const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${formData.businessName || 'flyer'}-${shapeName}.png`;
      link.href = url;
      link.click();
    }
    setDownloadingId(null);
  }, [formData]);

  const parsedData = { 
    ...formData, 
    services: [formData.service1, formData.service2, formData.service3, formData.service4].filter(Boolean) 
  };

  if (showPreview) {
    const shapes = ['circle', 'square', 'hex'];
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowPreview(false)} className="bg-slate-100 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors border border-slate-200">← Back</button>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Custom Designs</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-black uppercase text-slate-500">Theme:</label>
              <select name="themeColor" onChange={handleInputChange} value={formData.themeColor} className="bg-slate-900 text-white font-bold py-2 px-6 rounded-lg cursor-pointer outline-none">
                {THEME_COLORS.map(color => <option key={color} value={color}>{color.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {shapes.map((shape) => {
              const configKey = `${shape}-${formData.themeColor}`;
              const elementId = `flyer-${shape}`;
              if (!rawDatabase[configKey]) return null;
              return (
                <div key={shape} className="flex flex-col gap-6">
                  <MasterTemplate id={elementId} data={parsedData} photoUrl={selectedPhoto} photoUrl2={selectedPhoto2} configKey={configKey} rawDatabase={rawDatabase} />
                  <button onClick={() => downloadFlyer(elementId, shape)} disabled={downloadingId !== null} className="w-full bg-slate-900 text-white font-black py-4 rounded-lg uppercase tracking-widest disabled:opacity-50 hover:bg-blue-600 transition-all shadow-lg active:translate-y-1">
                    {downloadingId === elementId ? 'Generating...' : `Download ${shape.toUpperCase()}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
      <div className="bg-white max-w-xl w-full p-8 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        <h1 className="text-3xl font-black mb-8 uppercase italic tracking-tighter border-b pb-4">Aretifi Studio</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input required name="businessName" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg font-medium" placeholder="Business Name" value={formData.businessName} />
          <div className="grid grid-cols-2 gap-5">
            <input required name="field" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg font-medium" placeholder="Trade (e.g. Plumbing)" value={formData.field} />
            <input required name="phone" minLength={9} onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg font-medium" placeholder="Phone Number" value={formData.phone} />
          </div>
          <div className="pt-2 pb-2">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Services Offered</label>
            <div className="grid grid-cols-2 gap-3">
              <input required name="service1" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm font-medium" placeholder="Service 1" value={formData.service1} />
              <input required name="service2" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm font-medium" placeholder="Service 2" value={formData.service2} />
              <input name="service3" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm font-medium" placeholder="Service 3" value={formData.service3} />
              <input name="service4" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm font-medium" placeholder="Service 4" value={formData.service4} />
            </div>
          </div>
          <select name="themeColor" onChange={handleInputChange} value={formData.themeColor} className="w-full border-2 p-3 rounded-lg bg-white font-bold cursor-pointer">
            {THEME_COLORS.map(color => <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)} Theme</option>)}
          </select>
          <button type="submit" disabled={Object.keys(rawDatabase).length === 0} className="w-full bg-slate-900 text-white font-black py-4 rounded-lg uppercase tracking-widest disabled:opacity-50 mt-4 hover:bg-slate-800 transition-colors">Start Design</button>
        </form>
      </div>
    </main>
  );
}
