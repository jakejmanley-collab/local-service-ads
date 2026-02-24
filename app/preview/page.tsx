'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
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

// 1. THE SPREADSHEET PARSER FUNCTION
const parseZone = (csvString: string) => {
  if (!csvString) return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length === 4) {
    return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
  }
  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: { fontSize: parts[4], color: parts[5], fontWeight: parts[6], fontStyle: parts[7], fontFamily: parts[8] }
  };
};

// 2. THE MASTER TEMPLATE ENGINE (SVG)
const MasterTemplate = ({ id, data, photoUrl, configKey, rawDatabase }: any) => {
  const rawConfig = rawDatabase[configKey];
  if (!rawConfig) return null;

  const photoConfig = parseZone(rawConfig.photoHole);
  const headerTopConfig = parseZone(rawConfig.headerTop);
  const headerBottomConfig = parseZone(rawConfig.headerBottom);
  const phoneConfig = parseZone(rawConfig.phone);
  const websiteConfig = parseZone(rawConfig.website);
  const locationConfig = parseZone(rawConfig.location);
  const serviceConfigs = [
    parseZone(rawConfig.service1),
    parseZone(rawConfig.service2),
    parseZone(rawConfig.service3),
    parseZone(rawConfig.service4)
  ];

  const tradeWords = data.field ? data.field.split(' ') : ['PROFESSIONAL', 'SERVICE'];
  const firstWord = tradeWords[0];
  const remainingWords = tradeWords.slice(1).join(' ');

  return (
    <div id={id} className="relative w-full shadow-2xl bg-white overflow-hidden">
      <svg viewBox={rawConfig.viewBox} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        
        {/* BOTTOM LAYER: Dynamic Trade Photo */}
        {photoConfig && (
          <image 
            href={photoUrl} 
            x={photoConfig.x} y={photoConfig.y} 
            width={photoConfig.width} height={photoConfig.height} 
            preserveAspectRatio="xMidYMid slice" crossOrigin="anonymous" 
          />
        )}
        
        {/* MIDDLE LAYER: Your Custom PNG Template */}
        <image href={rawConfig.bgImage} x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        
        {/* TOP LAYER: Text mapped to your database coordinates */}
        {headerTopConfig && (
          <foreignObject x={headerTopConfig.x} y={headerTopConfig.y} width={headerTopConfig.width} height={headerTopConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="w-full text-left">
              <h2 className="uppercase leading-none tracking-tighter drop-shadow-md" style={headerTopConfig.style}>
                {firstWord}
              </h2>
            </div>
          </foreignObject>
        )}

        {headerBottomConfig && (
          <foreignObject x={headerBottomConfig.x} y={headerBottomConfig.y} width={headerBottomConfig.width} height={headerBottomConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="w-full text-left">
              <h2 className="uppercase leading-none tracking-tighter drop-shadow-md" style={headerBottomConfig.style}>
                {remainingWords}
              </h2>
            </div>
          </foreignObject>
        )}

        {/* INDIVIDUAL SERVICES */}
        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = serviceConfigs[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height}>
              <div xmlns="http://www.w3.org/1999/xhtml" className="w-full text-left uppercase" style={sConf.style}>
                ✓ {service}
              </div>
            </foreignObject>
          );
        })}

        {/* PHONE NUMBER */}
        {phoneConfig && (
          <foreignObject x={phoneConfig.x} y={phoneConfig.y} width={phoneConfig.width} height={phoneConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="w-full text-left tracking-tighter drop-shadow-lg" style={phoneConfig.style}>
              📞 {data.phone || '555-0123'}
            </div>
          </foreignObject>
        )}

        {/* WEBSITE */}
        {data.website && websiteConfig && (
          <foreignObject x={websiteConfig.x} y={websiteConfig.y} width={websiteConfig.width} height={websiteConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="w-full text-left" style={websiteConfig.style}>
              🌐 {data.website}
            </div>
          </foreignObject>
        )}

        {/* LOCATION */}
        {data.location && locationConfig && (
          <foreignObject x={locationConfig.x} y={locationConfig.y} width={locationConfig.width} height={locationConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="w-full text-left" style={locationConfig.style}>
              📍 {data.location}
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

// 3. MAIN PAGE LOGIC
export default function PreviewPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  
  const [formData, setFormData] = useState({
    businessName: '',
    field: '',
    services: '',
    phone: '',
    website: '',
    location: '',
    selectedTemplate: ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  // DYNAMIC SPREADSHEET LOADER
  useEffect(() => {
    fetch('/templates.csv')
      .then(response => {
         if(!response.ok) throw new Error("CSV not found");
         return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const newDb: Record<string, any> = {};
            results.data.forEach((row: any) => {
              if (row['Template ID']) {
                newDb[row['Template ID']] = {
                  id: row['Template ID'],
                  bgImage: `/${row['Template ID']}.png`,
                  viewBox: row['Canvas Dimensions'] ? `0 0 ${row['Canvas Dimensions'].replace('x', ' ')}` : "0 0 1080 1080",
                  photoHole: row['Photo Hole'],
                  headerTop: row['Header Top'],
                  headerBottom: row['Header Bottom'],
                  service1: row['Service 1'],
                  service2: row['Service 2'],
                  service3: row['Service 3'],
                  service4: row['Service 4'],
                  phone: row['Phone'],
                  website: row['Website'],
                  location: row['Location']
                };
              }
            });
            setRawDatabase(newDb);
            
            // Auto-select the first template from your CSV
            const templateKeys = Object.keys(newDb);
            if (templateKeys.length > 0) {
              setFormData(prev => ({ ...prev, selectedTemplate: templateKeys[0] }));
            }
          }
        });
      })
      .catch(err => console.error("Error loading templates.csv. Make sure it is in the /public folder.", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const tradeKey = Object.keys(tradePhotos).find(key => 
      formData.field.toLowerCase().includes(key)
    ) || 'default';
    
    const photos = tradePhotos[tradeKey];
    setSelectedPhoto(photos[Math.floor(Math.random() * photos.length)]);

    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 600);
  };

  const downloadFlyer = useCallback(async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('flyer-master');
      if (!element) return;
      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${formData.businessName || 'aretifi'}-${formData.selectedTemplate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(false);
    }
  }, [formData.businessName, formData.selectedTemplate]);

  const parsedData = {
    ...formData,
    services: formData.services.split(',').map(s => s.trim()).filter(Boolean).length > 0 
      ? formData.services.split(',').map(s => s.trim()).filter(Boolean) 
      : ['Service 1', 'Service 2', 'Service 3']
  };

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Your Custom Asset</h1>
            <button onClick={() => setShowPreview(false)} className="text-slate-500 font-bold hover:text-slate-900">
              ← Edit Data
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Renders the Exact Template Picked from the Dropdown */}
            <MasterTemplate 
              id="flyer-master" 
              data={parsedData} 
              photoUrl={selectedPhoto} 
              configKey={formData.selectedTemplate} 
              rawDatabase={rawDatabase}
            />
            
            <button 
              onClick={downloadFlyer} 
              disabled={isDownloading} 
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isDownloading ? 'Rendering High-Res...' : 'Download Flyer'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const availableTemplates = Object.keys(rawDatabase);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
      <div className="bg-white max-w-xl w-full p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Aretifi Studio</h1>
        <p className="text-slate-600 mb-8 font-medium">Input your business data. We will assemble the commercial assets.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Business Name</label>
            <input required type="text" name="businessName" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Apex Repairs" />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Trade</label>
              <input required type="text" name="field" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Plumbing" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Phone Number</label>
              <input required type="text" name="phone" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. 555-0198" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Top 3-4 Services (Comma separated)</label>
            <input required type="text" name="services" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Repair, Maintenance, Install" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Website (Optional)</label>
              <input type="text" name="website" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. www.apex.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Location (Optional)</label>
              <input type="text" name="location" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Toronto, ON" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Select Template</label>
            <select 
              name="selectedTemplate" 
              onChange={handleInputChange} 
              value={formData.selectedTemplate}
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors cursor-pointer bg-white"
            >
              {availableTemplates.length === 0 ? (
                <option>Loading templates from CSV...</option>
              ) : (
                availableTemplates.map(templateId => (
                  <option key={templateId} value={templateId}>{templateId}</option>
                ))
              )}
            </select>
            {availableTemplates.length === 0 && (
              <p className="text-red-500 text-xs mt-2 font-bold">Ensure templates.csv is in your /public folder.</p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isGenerating || availableTemplates.length === 0}
            className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-4 rounded-lg mt-6 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Assembling Assets...' : 'Generate Flyer'}
          </button>
        </form>
      </div>
    </main>
  );
}
