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
      link.download = `${formData.businessName || 'aretifi'}-flyer.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(null);
    }
  }, [formData.businessName]);

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Your Generated Assets</h1>
            <Link href="/checkout" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
              Upgrade to Remove Watermarks
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((template) => (
              <div key={template} className="flex flex-col gap-4">
                <div 
                  id={`flyer-${template}`}
                  className="relative aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transform -rotate-45 z-20">
                    <span className="text-6xl font-black text-white tracking-widest uppercase italic">ARETIFI</span>
                  </div>

                  <div className="relative z-10 p-10 h-full flex flex-col">
                    <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter italic">
                      {formData.businessName || 'Your Business'}
                    </h2>
                    <p className="text-blue-500 font-bold text-2xl mb-auto uppercase tracking-widest">
                      {formData.field || 'Service Field'}
                    </p>
                    
                    <div className="bg-black/40 backdrop-blur-md p-6 border-l-4 border-blue-500 mb-8">
                      <h3 className="text-white font-black mb-4 uppercase text-sm tracking-widest text-slate-400">Services</h3>
                      <ul className="text-white space-y-3 font-medium text-lg">
                        {formData.services.split(',').map((service, i) => (
                          <li key={i} className="flex gap-3 items-center">
                            <span className="text-blue-500">■</span> {service.trim() || 'Service Example'}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-6">
                      <div className="text-white font-black text-3xl tracking-tight">
                        {formData.phone || '(555) 123-4567'}
                      </div>
                      <div className="text-slate-400 font-bold uppercase tracking-widest text-xs text-right">
                        Serving<br/>
                        <span className="text-white text-base">{formData.serviceArea || 'Your Area'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => downloadFlyer(template.toString())}
                  disabled={isDownloading === template.toString()}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isDownloading === template.toString() ? 'Generating Image...' : 'Download This Design'}
                </button>
              </div>
            ))}
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
