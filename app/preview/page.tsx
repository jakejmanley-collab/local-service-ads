'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

// --- CURATED IMAGE LIBRARY ---
const tradePhotos: Record<string, string[]> = {
  plumbing: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'],
  hvac: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'],
  landscaping: ['https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80'],
  cleaning: ['https://images.unsplash.com/photo-1581578731117-104f2a863a39?auto=format&fit=crop&w=800&q=80'],
  default: ['https://images.unsplash.com/photo-1521791136064-7985c2d18854?auto=format&fit=crop&w=800&q=80']
};

// 1. THE SPREADSHEET PARSER
const parseZone = (csvString: string) => {
  if (!csvString) return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length < 4) return null;
  
  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: parts.length > 4 ? { 
      fontSize: parts[4], 
      color: parts[5], 
      fontWeight: parts[6], 
      fontStyle: parts[7], 
      fontFamily: parts[8] 
    } : {}
  };
};

// 2. THE MASTER TEMPLATE ENGINE (SVG)
const MasterTemplate = ({ id, data, photoUrl, configKey, rawDatabase }: any) => {
  const rawConfig = rawDatabase[configKey];
  if (!rawConfig) return null;

  const photoConfig = parseZone(rawConfig['Photo Hole (X, Y, W, H)']);
  const headerTopConfig = parseZone(rawConfig['Header Top (X, Y, W, H, Size, Hex, Weight, Style, Font)']);
  const headerBottomConfig = parseZone(rawConfig['Header Bottom (X, Y, W, H, Size, Hex, Weight, Style, Font)']);
  const phoneConfig = parseZone(rawConfig['Phone (X, Y, W, H, Size, Hex, Weight, Style, Font)']);
  const websiteConfig = parseZone(rawConfig['Website (X, Y, W, H, Size, Hex, Weight, Style, Font)']);
  const locationConfig = parseZone(rawConfig['Location (X, Y, W, H, Size, Hex, Weight, Style, Font)']);
  
  const serviceConfigs = [
    parseZone(rawConfig['Service 1 (X, Y, W, H, Size, Hex, Weight, Style, Font)']),
    parseZone(rawConfig['Service 2 (X, Y, W, H, Size, Hex, Weight, Style, Font)']),
    parseZone(rawConfig['Service 3 (X, Y, W, H, Size, Hex, Weight, Style, Font)']),
    parseZone(rawConfig['Service 4 (X, Y, W, H, Size, Hex, Weight, Style, Font)'])
  ];

  const mainTitle = data.businessName || data.field || 'PROFESSIONAL';
  const tradeWords = mainTitle.split(' ');
  const firstWord = tradeWords[0];
  const remainingWords = tradeWords.slice(1).join(' ');

  return (
    <div id={id} className="relative w-full shadow-2xl bg-white overflow-hidden">
      <svg viewBox={rawConfig['Canvas Dimensions'] ? `0 0 ${rawConfig['Canvas Dimensions'].replace('x', ' ')}` : "0 0 1080 1080"} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        
        {/* BOTTOM LAYER: Dynamic Trade Photo */}
        {photoConfig && (
          <image href={photoUrl} x={photoConfig.x} y={photoConfig.y} width={photoConfig.width} height={photoConfig.height} preserveAspectRatio="xMidYMid slice" crossOrigin="anonymous" />
        )}
        
        {/* MIDDLE LAYER: Your Template PNG (Uses the key to find filename) */}
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        
        {/* TOP LAYER: Headers */}
        {headerTopConfig && (
          <foreignObject x={headerTopConfig.x} y={headerTopConfig.y} width={headerTopConfig.width} height={headerTopConfig.height}>
            <div className="w-full h-full flex items-center">
              <h2 className="uppercase leading-none tracking-tighter w-full" style={headerTopConfig.style}>{firstWord}</h2>
            </div>
          </foreignObject>
        )}

        {headerBottomConfig && (
          <foreignObject x={headerBottomConfig.x} y={headerBottomConfig.y} width={headerBottomConfig.width} height={headerBottomConfig.height}>
            <div className="w-full h-full flex items-center">
              <h2 className="uppercase leading-none tracking-tighter w-full" style={headerBottomConfig.style}>{remainingWords}</h2>
            </div>
          </foreignObject>
        )}

        {/* Dynamic Services Population */}
        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = serviceConfigs[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height}>
              <div className="w-full h-full flex items-center uppercase" style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}

        {/* Contact Info */}
        {phoneConfig && (
          <foreignObject x={phoneConfig.x} y={phoneConfig.y} width={phoneConfig.width} height={phoneConfig.height}>
            <div className="w-full h-full flex items-center" style={phoneConfig.style}>{data.phone || '555-0123'}</div>
          </foreignObject>
        )}

        {data.website && websiteConfig && (
          <foreignObject x={websiteConfig.x} y={websiteConfig.y} width={websiteConfig.width} height={websiteConfig.height}>
            <div className="w-full h-full flex items-center" style={websiteConfig.style}>{data.website}</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

// 3. MAIN PAGE COMPONENT
export default function PreviewPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    businessName: '', field: '', services: '', phone: '', website: '', location: '', selectedTemplate: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  useEffect(() => {
    fetch('/templates.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const newDb: Record<string, any> = {};
            results.data.forEach((row: any) => {
              if (row['Template ID']) { newDb[row['Template ID']] = row; }
            });
            setRawDatabase(newDb);
            const keys = Object.keys(newDb);
            if (keys.length > 0) setFormData(p => ({ ...p, selectedTemplate: keys[0] }));
          }
        });
      });
  }, []);

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
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
      const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${formData.businessName || 'flyer'}.png`;
      link.href = url;
      link.click();
    }
    setIsDownloading(false);
  }, [formData]);

  const parsedData = {
    ...formData,
    services: formData.services.split(',').map(s => s.trim()).filter(Boolean)
  };

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-md mx-auto">
          <MasterTemplate id="flyer-master" data={parsedData} photoUrl={selectedPhoto} configKey={formData.selectedTemplate} rawDatabase={rawDatabase} />
          <div className="flex gap-4 mt-6">
            <button onClick={() => setShowPreview(false)} className="flex-1 bg-white border-2 border-slate-900 font-bold py-4 rounded-lg">Edit Data</button>
            <button onClick={downloadFlyer} disabled={isDownloading} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-lg">
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
        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter border-b pb-4">Aretifi Studio</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input required name="businessName" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Business Name" />
          <div className="grid grid-cols-2 gap-5">
            <input required name="field" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Trade (e.g. Plumbing)" />
            <input required name="phone" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Phone Number" />
          </div>
          <input required name="services" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Services (comma separated)" />
          <div className="grid grid-cols-2 gap-5">
            <input name="website" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Website (Optional)" />
            <input name="location" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Location/Area" />
          </div>
          <select name="selectedTemplate" onChange={handleInputChange} value={formData.selectedTemplate} className="w-full border-2 p-3 rounded-lg bg-white">
            {Object.keys(rawDatabase).map(id => <option key={id} value={id}>{id}</option>)}
          </select>
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-lg uppercase tracking-widest hover:bg-slate-700 transition-colors">
            Generate Flyer
          </button>
        </form>
      </div>
    </main>
  );
}
