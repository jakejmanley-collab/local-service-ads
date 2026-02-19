'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PreviewPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    field: '',
    services: '',
    serviceArea: '',
    phone: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Your Watermarked Previews</h1>
            <Link href="/#pricing" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
              Unlock High-Res Downloads
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Template 1 Simulation: Asset-Based Workflow */}
            {[1, 2, 3, 4].map((template) => (
              <div key={template} className="relative aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Simulated Background Asset */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-50"></div>
                
                {/* Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none transform -rotate-45">
                  <span className="text-6xl font-black text-white tracking-widest uppercase">Watermark</span>
                </div>

                {/* Dynamic Code Layer (Foreground) */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <h2 className="text-4xl font-extrabold text-white mb-2 uppercase">{formData.businessName || 'Your Business'}</h2>
                  <p className="text-blue-400 font-bold text-xl mb-auto uppercase tracking-wide">{formData.field || 'Service Field'}</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-6 border border-white/20">
                    <h3 className="text-white font-bold mb-3 uppercase text-sm tracking-wider">Our Services</h3>
                    <ul className="text-slate-100 space-y-2">
                      {formData.services.split(',').map((service, i) => (
                        <li key={i} className="flex gap-2">✓ {service.trim() || 'Service Example'}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-lg">
                      {formData.phone || '(555) 123-4567'}
                    </div>
                    <div className="text-slate-300 font-medium text-sm text-right">
                      Serving:<br/>{formData.serviceArea || 'Your City'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
      <div className="bg-white max-w-xl w-full p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Build Your Free Flyer</h1>
        <p className="text-slate-600 mb-8">Enter your details below to generate 4 custom, high-converting templates instantly.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
            <input required type="text" name="businessName" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Apex Plumbing" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Business Field</label>
              <input required type="text" name="field" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Plumbing, Cleaning" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
              <input required type="text" name="phone" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. 555-0198" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Top 3 Services (Comma separated)</label>
            <input required type="text" name="services" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Leak Detection, Toilet Repair, 24/7 Emergency" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Service Area</label>
            <input required type="text" name="serviceArea" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Greater Toronto Area" />
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg mt-4 hover:bg-slate-800 transition">
            Generate My Flyers
          </button>
        </form>
      </div>
    </main>
  );
}
