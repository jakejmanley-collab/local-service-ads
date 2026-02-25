'use client';

import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';

// --- CURATED IMAGE LIBRARY ---
const tradePhotos: Record<string, string[]> = {
  plumbing: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'],
  hvac: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'],
  landscaping: ['https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80'],
  cleaning: ['https://images.unsplash.com/photo-1581578731117-104f2a863a39?auto=format&fit=crop&w=800&q=80'],
  default: ['https://images.unsplash.com/photo-1521791136064-7985c2d18854?auto=format&fit=crop&w=800&q=80']
};

// --- THE BETTER WAY: LOCAL TEMPLATE CONFIGURATION ---
// Adjust the coordinates and styling here directly. No CSV required.
const TEMPLATES: Record<string, any> = {
  'hex-blue-url': {
    id: 'hex-blue-url',
    bgImage: '/hex-blue-url.png', // Must match file in /public exactly
    viewBox: '0 0 1080 1080',
    photoHole: { x: 0, y: 0, width: 1080, height: 1080 },
    headerTop: { x: 50, y: 100, width: 900, height: 100, style: { fontSize: '80px', color: '#1e3a8a', fontFamily: 'Anton', fontWeight: 'normal' } },
    headerBottom: { x: 50, y: 200, width: 900, height: 100, style: { fontSize: '80px', color: '#0f172a', fontFamily: 'Anton', fontWeight: 'normal' } },
    services: [
      { x: 50, y: 350, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
      { x: 50, y: 420, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
      { x: 50, y: 490, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
      { x: 50, y: 560, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
    ],
    phone: { x: 50, y: 800, width: 900, height: 100, style: { fontSize: '90px', color: '#1e3a8a', fontFamily: 'Anton', fontWeight: 'normal' } },
    website: { x: 50, y: 920, width: 900, height: 40, style: { fontSize: '30px', color: '#64748b', fontFamily: 'Roboto', fontWeight: 'bold' } },
    location: { x: 50, y: 970, width: 900, height: 40, style: { fontSize: '30px', color: '#64748b', fontFamily: 'Roboto', fontWeight: 'bold' } },
  },
  'hex-red-url': {
    id: 'hex-red-url',
    bgImage: '/hex-red-url.png',
    viewBox: '0 0 1080 1080',
    photoHole: { x: 0, y: 0, width: 1080, height: 1080 },
    headerTop: { x: 50, y: 100, width: 900, height: 100, style: { fontSize: '80px', color: '#dc2626', fontFamily: 'Anton', fontWeight: 'normal' } },
    headerBottom: { x: 50, y: 200, width: 900, height: 100, style: { fontSize: '80px', color: '#0f172a', fontFamily: 'Anton', fontWeight: 'normal' } },
    services: [
      { x: 50, y: 350, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
      { x: 50, y: 420, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
      { x: 50, y: 490, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
      { x: 50, y: 560, width: 900, height: 50, style: { fontSize: '35px', color: '#334155', fontFamily: 'Roboto', fontWeight: 'bold' } },
    ],
    phone: { x: 50, y: 800, width: 900, height: 100, style: { fontSize: '90px', color: '#dc2626', fontFamily: 'Anton', fontWeight: 'normal' } },
    website: { x: 50, y: 920, width: 900, height: 40, style: { fontSize: '30px', color: '#64748b', fontFamily: 'Roboto', fontWeight: 'bold' } },
    location: { x: 50, y: 970, width: 900, height: 40, style: { fontSize: '30px', color: '#64748b', fontFamily: 'Roboto', fontWeight: 'bold' } },
  }
};

// 2. THE MASTER TEMPLATE ENGINE (SVG)
const MasterTemplate = ({ id, data, photoUrl, configKey }: any) => {
  const tConfig = TEMPLATES[configKey];
  if (!tConfig) return null;

  const mainTitle = data.businessName || data.field || 'PROFESSIONAL';
  const tradeWords = mainTitle.split(' ');
  const firstWord = tradeWords[0];
  const remainingWords = tradeWords.slice(1).join(' ');

  return (
    <div id={id} className="relative w-full shadow-2xl bg-white overflow-hidden">
      <svg viewBox={tConfig.viewBox} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        
        {/* BOTTOM LAYER: Dynamic Trade Photo */}
        {tConfig.photoHole && (
          <image href={photoUrl} x={tConfig.photoHole.x} y={tConfig.photoHole.y} width={tConfig.photoHole.width} height={tConfig.photoHole.height} preserveAspectRatio="xMidYMid slice" crossOrigin="anonymous" />
        )}
        
        {/* MIDDLE LAYER: Template PNG (Must be in /public) */}
        <image href={tConfig.bgImage} x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        
        {/* TOP LAYER: Text Content */}
        {tConfig.headerTop && (
          <foreignObject x={tConfig.headerTop.x} y={tConfig.headerTop.y} width={tConfig.headerTop.width} height={tConfig.headerTop.height}>
            <div className="w-full h-full flex items-center">
              <h2 className="uppercase leading-none tracking-tighter w-full text-left" style={tConfig.headerTop.style}>{firstWord}</h2>
            </div>
          </foreignObject>
        )}

        {tConfig.headerBottom && (
          <foreignObject x={tConfig.headerBottom.x} y={tConfig.headerBottom.y} width={tConfig.headerBottom.width} height={tConfig.headerBottom.height}>
            <div className="w-full h-full flex items-center">
              <h2 className="uppercase leading-none tracking-tighter w-full text-left" style={tConfig.headerBottom.style}>{remainingWords}</h2>
            </div>
          </foreignObject>
        )}

        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = tConfig.services[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height}>
              <div className="w-full h-full flex items-center uppercase text-left" style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}

        {tConfig.phone && (
          <foreignObject x={tConfig.phone.x} y={tConfig.phone.y} width={tConfig.phone.width} height={tConfig.phone.height}>
            <div className="w-full h-full flex items-center text-left" style={tConfig.phone.style}>{data.phone || '555-0123'}</div>
          </foreignObject>
        )}

        {data.website && tConfig.website && (
          <foreignObject x={tConfig.website.x} y={tConfig.website.y} width={tConfig.website.width} height={tConfig.website.height}>
            <div className="w-full h-full flex items-center text-left" style={tConfig.website.style}>{data.website}</div>
          </foreignObject>
        )}

        {(data.location || data.serviceArea) && tConfig.location && (
          <foreignObject x={tConfig.location.x} y={tConfig.location.y} width={tConfig.location.width} height={tConfig.location.height}>
            <div className="w-full h-full flex items-center text-left" style={tConfig.location.style}>{data.location || data.serviceArea}</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

// 3. MAIN COMPONENT
export default function PreviewPage() {
  const templateKeys = Object.keys(TEMPLATES);
  
  const [formData, setFormData] = useState({
    businessName: '', field: '', services: '', phone: '', website: '', location: '', serviceArea: '', 
    selectedTemplate: templateKeys.length > 0 ? templateKeys[0] : ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeKey = Object.keys(tradePhotos).find(k => formData.field.toLowerCase().includes(k)) || 'default';
    const photos = tradePhotos[tradeKey];
    setSelectedPhoto(photos[Math.floor(Math.random() * photos.length)]);
    setShowPreview(true);
  };

  const downloadFlyer = useCallback(async () => {
    setIsDownloading(true);
    const el = document.getElementById('flyer-master');
    if (el) {
      try {
        const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `${formData.businessName || 'aretifi-flyer'}.png`;
        link.href = url;
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
      }
    }
    setIsDownloading(false);
  }, [formData]);

  const parsedData = { ...formData, services: formData.services.split(',').map(s => s.trim()).filter(Boolean) };

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-md mx-auto">
          <MasterTemplate id="flyer-master" data={parsedData} photoUrl={selectedPhoto} configKey={formData.selectedTemplate} />
          <div className="flex gap-4 mt-6">
            <button onClick={() => setShowPreview(false)} className="flex-1 bg-white border-2 border-slate-900 font-bold py-4 rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
            <button onClick={downloadFlyer} disabled={isDownloading} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
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
          <input required name="businessName" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-slate-900" placeholder="Business Name" />
          <div className="grid grid-cols-2 gap-5">
            <input required name="field" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-slate-900" placeholder="Trade (e.g. Plumbing)" />
            <input required name="phone" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-slate-900" placeholder="Phone Number" />
          </div>
          <input required name="services" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-slate-900" placeholder="Services (comma separated)" />
          <div className="grid grid-cols-2 gap-5">
            <input name="website" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-slate-900" placeholder="Website" />
            <input name="location" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-slate-900" placeholder="Address/Location" />
          </div>
          <select name="selectedTemplate" onChange={handleInputChange} value={formData.selectedTemplate} className="w-full border-2 p-3 rounded-lg bg-white focus:outline-none focus:border-slate-900 cursor-pointer">
            {templateKeys.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-lg uppercase tracking-widest hover:bg-slate-800 transition-colors">Generate</button>
        </form>
      </div>
    </main>
  );
}
