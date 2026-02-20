'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

export default function PreviewPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    field: '',
    services: '',
    serviceArea: '',
    phone: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
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

  const servicesList = formData.services.split(',').map(s => s.trim()).filter(Boolean);
  const defaultServices = ['Service One', 'Service Two', 'Service Three'];
  const displayServices = servicesList.length > 0 ? servicesList : defaultServices;

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Your Generated Assets</h1>
            <Link href="/checkout" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
              Upgrade to Remove Watermarks
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* TEMPLATE 1: THE INDUSTRIAL (Bottom-Heavy, High Impact) */}
            <div className="flex flex-col gap-4">
              <div id="flyer-industrial" className="relative aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Background Asset Layer */}
                <img src="https://placehold.co/800x1000/1e293b/1e293b" alt="bg" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transform -rotate-45 z-20">
                  <span className="text-4xl font-black text-white tracking-widest uppercase italic">ARETIFI</span>
                </div>

                {/* Text Layer */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="border-l-4 border-blue-600 pl-4 mb-4">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
                      {formData.businessName || 'YOUR BUSINESS'}
                    </h2>
                    <p className="text-blue-500 font-bold text-lg uppercase tracking-widest mt-1">
                      {formData.field || 'TRADE SPECIALIST'}
                    </p>
                  </div>
                  <ul className="text-white space-y-1 font-medium mb-6">
                    {displayServices.map((service, i) => (
                      <li key={i} className="uppercase tracking-wider text-sm">/ {service}</li>
                    ))}
                  </ul>
                  <div className="bg-blue-600 p-4 text-center">
                    <div className="text-white font-black text-3xl tracking-tight">{formData.phone || '(555) 123-4567'}</div>
                    <div className="text-blue-200 font-bold uppercase tracking-widest text-xs mt-1">SERVING {formData.serviceArea || 'YOUR AREA'}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => downloadFlyer('industrial')} disabled={isDownloading === 'industrial'} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isDownloading === 'industrial' ? 'Rendering...' : 'Download Industrial'}
              </button>
            </div>

            {/* TEMPLATE 2: THE MINIMALIST (Clean, Top-Heavy, Centered) */}
            <div className="flex flex-col gap-4">
              <div id="flyer-minimalist" className="relative aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Background Asset Layer */}
                <img src="https://placehold.co/800x1000/ffffff/ffffff" alt="bg" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none transform -rotate-45 z-20">
                  <span className="text-4xl font-black text-slate-900 tracking-widest uppercase italic">ARETIFI</span>
                </div>

                {/* Text Layer */}
                <div className="relative z-10 p-8 h-full flex flex-col text-center">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-widest mb-2 mt-4">
                    {formData.businessName || 'YOUR BUSINESS'}
                  </h2>
                  <div className="h-px w-16 bg-slate-900 mx-auto mb-2"></div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-widest mb-auto">
                    {formData.field || 'SERVICE PROFESSIONAL'}
                  </p>
                  
                  <div className="mb-8">
                    <ul className="text-slate-800 space-y-3 font-bold">
                      {displayServices.map((service, i) => (
                        <li key={i} className="uppercase tracking-wider text-sm">{service}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-slate-900 p-4">
                    <div className="text-slate-900 font-black text-2xl tracking-tight">{formData.phone || '(555) 123-4567'}</div>
                    <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">AVAILABLE IN {formData.serviceArea || 'YOUR AREA'}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => downloadFlyer('minimalist')} disabled={isDownloading === 'minimalist'} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
                {isDownloading === 'minimalist' ? 'Rendering...' : 'Download Minimalist'}
              </button>
            </div>

            {/* TEMPLATE 3: THE MIDNIGHT (High Contrast, Left-Aligned) */}
            <div className="flex flex-col gap-4">
              <div id="flyer-midnight" className="relative aspect-[4/5] bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Background Asset Layer */}
                <img src="https://placehold.co/800x1000/000000/000000" alt="bg" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transform -rotate-45 z-20">
                  <span className="text-4xl font-black text-white tracking-widest uppercase italic">ARETIFI</span>
                </div>

                {/* Text Layer */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-1">
                    {formData.field || 'EXPERT SERVICES'}
                  </p>
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                    {formData.businessName || 'BUSINESS'}
                  </h2>
                  
                  <div className="space-y-4 mb-auto">
                    {displayServices.map((service, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm px-4 py-2 border-l-2 border-blue-500 text-white text-sm font-bold uppercase tracking-wider">
                        {service}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">CALL NOW FOR {formData.serviceArea || 'LOCAL'} SERVICE</div>
                    <div className="text-white font-black text-3xl tracking-tight">{formData.phone || '(555) 123-4567'}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => downloadFlyer('midnight')} disabled={isDownloading === 'midnight'} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isDownloading === 'midnight' ? 'Rendering...' : 'Download Midnight'}
              </button>
            </div>

            {/* TEMPLATE 4: THE BADGE (Boxed, Utility-Focused) */}
            <div className="flex flex-col gap-4">
              <div id="flyer-badge" className="relative aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Background Asset Layer */}
                <img src="https://placehold.co/800x1000/334155/334155" alt="bg" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transform -rotate-45 z-20">
                  <span className="text-4xl font-black text-white tracking-widest uppercase italic">ARETIFI</span>
                </div>

                {/* Text Layer */}
                <div className="relative z-10 p-6 h-full flex flex-col items-center justify-between">
                  <div className="bg-white text-center p-6 w-full shadow-2xl">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                      {formData.businessName || 'YOUR BUSINESS'}
                    </h2>
                    <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-1">
                      {formData.field || 'PROFESSIONAL'}
                    </p>
                  </div>
                  
                  <div className="w-full">
                    <div className="bg-slate-900/90 backdrop-blur-md p-6 w-full text-center">
                      <div className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">OUR SERVICES</div>
                      <ul className="text-white space-y-2 font-bold">
                        {displayServices.map((service, i) => (
                          <li key={i} className="uppercase tracking-wider text-sm">{service}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-600 text-center p-4 w-full text-white">
                    <div className="font-bold uppercase tracking-widest text-[10px] mb-1">SERVING {formData.serviceArea || 'YOUR AREA'}</div>
                    <div className="font-black text-2xl tracking-tight">{formData.phone || '(555) 123-4567'}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => downloadFlyer('badge')} disabled={isDownloading === 'badge'} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
                {isDownloading === 'badge' ? 'Rendering...' : 'Download Badge'}
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
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Aretifi Engine</h1>
        <p className="text-slate-600 mb-8 font-medium">Input your business data to render high-end commercial assets instantly.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Business Name</label>
            <input required type="text" name="businessName" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Apex Plumbing" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Trade</label>
              <input required type="text" name="field" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. HVAC" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Phone Number</label>
              <input required type="text" name="phone" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. 555-0198" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Top 3 Services (Comma separated)</label>
            <input required type="text" name="services" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Leak Detection, Toilet Repair, 24/7 Emergency" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Service Area</label>
            <input required type="text" name="serviceArea" onChange={handleInputChange} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-900 focus:ring-0 outline-none transition-colors" placeholder="e.g. Greater Toronto Area" />
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-4 rounded-lg mt-6 hover:bg-blue-600 transition-colors">
            Render Designs
          </button>
        </form>
      </div>
    </main>
  );
}
