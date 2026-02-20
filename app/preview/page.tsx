'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

// --- COLOR PSYCHOLOGY THEMES (Adobe Marketing Standards) ---
const colorThemes: Record<string, any> = {
  blue: { id: 'blue', label: 'Trust & Security (Blue)', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', hex: '#2563eb' },
  red: { id: 'red', label: 'Energy & Urgency (Red)', bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', hex: '#dc2626' },
  green: { id: 'green', label: 'Nature & Growth (Green)', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', hex: '#059669' },
  orange: { id: 'orange', label: 'Friendly & Action (Orange)', bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', hex: '#f97316' },
  purple: { id: 'purple', label: 'Luxury & Quality (Purple)', bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', hex: '#9333ea' },
  black: { id: 'black', label: 'Power & Elegance (Black)', bg: 'bg-slate-900', text: 'text-slate-900', border: 'border-slate-900', hex: '#0f172a' },
};

// --- CURATED IMAGE LIBRARY ---
const tradePhotos: Record<string, string[]> = {
  plumbing: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'],
  hvac: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'],
  landscaping: ['https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80'],
  cleaning: ['https://images.unsplash.com/photo-1581578731117-104f2a863a39?auto=format&fit=crop&w=800&q=80'],
  default: ['https://images.unsplash.com/photo-1521791136064-7985c2d18854?auto=format&fit=crop&w=800&q=80']
};

// --- GENERIC TEMPLATES (THE "FRAMES") ---

const HexFrame = ({ id, data, photoUrl, theme }: any) => (
  <div id={id} className="relative aspect-[4/5] bg-slate-900 flex flex-col items-center overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    <div className="pt-12 pb-6 text-center z-10 w-full px-6">
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">{data.businessName || 'YOUR BRAND'}</h2>
      <div className={`h-1 w-24 ${theme.bg} mx-auto`}></div>
    </div>
    <div className="relative w-64 h-64 z-10 drop-shadow-2xl filter">
      <div className="w-full h-full bg-slate-800" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
        <img src={photoUrl} alt="Trade Insert" className="w-full h-full object-cover grayscale opacity-90 mix-blend-screen" crossOrigin="anonymous" />
        <div className={`absolute inset-0 border-[6px] opacity-80 ${theme.border}`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
      </div>
    </div>
    <div className="mt-auto w-full bg-white p-6 z-10 pb-8 text-center" style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 100%, 0 100%)' }}>
      <p className={`${theme.text} font-bold text-xs uppercase tracking-widest mb-3`}>{data.field || 'PROFESSIONAL SERVICE'}</p>
      <ul className="flex flex-wrap justify-center gap-3 text-slate-800 font-bold text-xs mb-4">
        {data.services.slice(0, 3).map((s: string, i: number) => (
          <li key={i} className="bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wide border border-slate-200">{s}</li>
        ))}
      </ul>
      <div className="text-4xl font-black text-slate-900 tracking-tighter">{data.phone || '555-0123'}</div>
    </div>
  </div>
);

const SplitFrame = ({ id, data, photoUrl, theme }: any) => (
  <div id={id} className="relative aspect-[4/5] bg-white flex flex-col overflow-hidden">
    <div className="h-[55%] relative">
      <img src={photoUrl} alt="Trade Insert" className="w-full h-full object-cover" crossOrigin="anonymous" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90"></div>
      <div className="absolute bottom-6 left-6 text-white">
        <p className={`font-bold ${theme.text} text-sm uppercase tracking-widest mb-1 brightness-150`}>{data.field || 'EXPERT'}</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{data.businessName || 'YOUR BUSINESS'}</h2>
      </div>
    </div>
    <div className="h-[45%] bg-white p-8 flex flex-col justify-between">
      <div className="space-y-4">
        {data.services.slice(0, 3).map((s: string, i: number) => (
          <div key={i} className="flex items-center gap-3 border-b border-slate-100 pb-2">
            <div className={`w-2 h-2 ${theme.bg} rounded-full`}></div>
            <span className="font-bold text-slate-700 uppercase text-sm tracking-wide">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-end mt-4">
        <div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Serving</p>
          <p className="text-slate-900 font-bold text-sm uppercase">{data.serviceArea || 'LOCAL AREA'}</p>
        </div>
        <div className="text-right">
          <p className={`${theme.text} font-black text-2xl tracking-tighter`}>{data.phone || '555-0123'}</p>
        </div>
      </div>
    </div>
  </div>
);

const CircleFrame = ({ id, data, photoUrl, theme }: any) => (
  <div id={id} className="relative aspect-[4/5] bg-slate-100 flex flex-col p-6 items-center justify-center">
    <div className="absolute inset-4 border-2 border-slate-300 rounded-lg pointer-events-none"></div>
    <div className="z-10 text-center mb-6">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-1">{data.businessName || 'YOUR BRAND'}</h2>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{data.field || 'SERVICE'}</p>
    </div>
    <div className={`relative w-56 h-56 rounded-full border-[6px] ${theme.border} shadow-xl overflow-hidden mb-8 z-10`}>
      <img src={photoUrl} alt="Trade Insert" className="w-full h-full object-cover transform scale-110" crossOrigin="anonymous" />
    </div>
    <div className="bg-white p-6 w-full rounded-xl shadow-sm border border-slate-200 z-10 text-center">
      <div className={`${theme.text} font-black text-3xl tracking-tight mb-2`}>{data.phone || '555-0123'}</div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Call for a free quote</p>
    </div>
  </div>
);

const StripeFrame = ({ id, data, photoUrl, theme }: any) => (
  <div id={id} className={`relative aspect-[4/5] ${theme.bg} flex flex-col overflow-hidden`}>
    <div className="absolute top-0 right-0 w-2/3 h-full bg-slate-900 transform skew-x-12 translate-x-20 overflow-hidden border-l-4 border-white">
      <img src={photoUrl} alt="Trade Insert" className="absolute inset-0 w-full h-full object-cover opacity-60 transform -skew-x-12 scale-125 grayscale" crossOrigin="anonymous" />
    </div>
    <div className="relative z-10 h-full flex flex-col justify-center p-8 w-2/3">
      <div className="bg-white p-4 shadow-lg mb-6 -ml-8 pl-8 border-l-8 border-slate-900">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{data.businessName || 'YOUR BRAND'}</h2>
      </div>
      <div className="space-y-3 mb-8">
        {data.services.slice(0, 3).map((s: string, i: number) => (
          <div key={i} className="bg-slate-900 text-white px-3 py-2 font-bold uppercase text-sm tracking-wide self-start inline-block shadow-md">
            {s}
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">Available In {data.serviceArea}</p>
        <div className="text-white font-black text-4xl tracking-tighter">{data.phone || '555-0123'}</div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE LOGIC ---

export default function PreviewPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    field: '',
    services: '',
    serviceArea: '',
    phone: '',
    colorTheme: 'blue' // Default Theme
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

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
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    
    setSelectedPhoto(randomPhoto);

    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 600);
  };

  const downloadFlyer = useCallback(async (templateId: string) => {
    setIsDownloading(templateId);
    try {
      const element = document.getElementById(`flyer-${templateId}`);
      if (!element) return;
      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${formData.businessName || 'aretifi'}-${templateId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(null);
    }
  }, [formData.businessName]);

  const parsedData = {
    ...formData,
    services: formData.services.split(',').map(s => s.trim()).filter(Boolean).length > 0 
      ? formData.services.split(',').map(s => s.trim()).filter(Boolean) 
      : ['Service 1', 'Service 2', 'Service 3']
  };

  const activeTheme = colorThemes[formData.colorTheme];

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Choose Your Layout</h1>
            <Link href="/checkout" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
              Unlock High-Res
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <HexFrame id="flyer-hex" data={parsedData} photoUrl={selectedPhoto} theme={activeTheme} />
              <button onClick={() => downloadFlyer('hex')} disabled={isDownloading === 'hex'} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50">
                {isDownloading === 'hex' ? 'Rendering...' : 'Download Hex-Tech'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <SplitFrame id="flyer-split" data={parsedData} photoUrl={selectedPhoto} theme={activeTheme} />
              <button onClick={() => downloadFlyer('split')} disabled={isDownloading === 'split'} className={`w-full ${activeTheme.bg} text-white font-bold py-3 rounded-lg disabled:opacity-50`}>
                {isDownloading === 'split' ? 'Rendering...' : 'Download Modern'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <CircleFrame id="flyer-circle" data={parsedData} photoUrl={selectedPhoto} theme={activeTheme} />
              <button onClick={() => downloadFlyer('circle')} disabled={isDownloading === 'circle'} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50">
                {isDownloading === 'circle' ? 'Rendering...' : 'Download Badge'}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <StripeFrame id="flyer-stripe" data={parsedData} photoUrl={selectedPhoto} theme={activeTheme} />
              <button onClick={() => downloadFlyer('stripe')} disabled={isDownloading === 'stripe'} className={`w-full ${activeTheme.bg} text-white font-bold py-3 rounded-lg disabled:opacity-50`}>
                {isDownloading === 'stripe' ? 'Rendering...' : 'Download Bold'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
      <div className="bg-white max-w-xl w-full p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Aretifi Studio</h1>
        <p className="text-slate-600 mb-8 font-medium">Input your business data. We'll assemble the commercial assets.</p>
        
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
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Top 3 Services (Comma separated)</label>
            <input required type="text" name="services" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Repair, Maintenance, Install" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Service Area</label>
            <input required type="text" name="serviceArea" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Downtown Metro" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Brand Psychology (Color)</label>
            <select name="colorTheme" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors cursor-pointer bg-white">
              {Object.values(colorThemes).map(theme => (
                <option key={theme.id} value={theme.id}>{theme.label}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isGenerating}
            className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-4 rounded-lg mt-6 hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Assembling Assets...' : 'Generate Flyers'}
          </button>
        </form>
      </div>
    </main>
  );
}
