'use client';

import { useState } from 'react';

export default function AiWriterPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setResult(`🔥 STOP SCROLLING - Need reliable property service in your area?\n\nAt [Your Business], we don't just promise great results, we guarantee them. We are fully licensed, insured, and ready to tackle your next project on time and on budget.\n\n✅ Our Top Services:\n- Service 1\n- Service 2\n- Service 3\n\nDon't settle for "some guy with a truck". Hire the professionals.\n\n📲 Send us a DM or call us directly at [Your Phone] to claim your free, no-obligation quote today!`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Input Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Marketplace Ad Writer</h1>
          <p className="text-slate-600 mb-6">Generate text proven to increase Kijiji and Facebook conversions.</p>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
              <input required type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Apex Plumbing" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Target Platform</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none">
                <option>Facebook Marketplace</option>
                <option>Kijiji</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Core Offer / Services</label>
              <textarea required rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Leak repair, fast response, 10% off first call"></textarea>
            </div>
            <button type="submit" disabled={isGenerating} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {isGenerating ? 'Writing Ad...' : 'Generate Ad Copy'}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-800 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Your Generated Ad</h2>
          {result ? (
            <div className="bg-slate-800 p-6 rounded-lg text-slate-200 whitespace-pre-wrap flex-1 border border-slate-700">
              {result}
            </div>
          ) : (
            <div className="bg-slate-800 p-6 rounded-lg flex-1 border border-slate-700 flex items-center justify-center text-slate-500 text-center">
              Fill out the form to the left and click generate to see your algorithm-friendly ad text.
            </div>
          )}
          <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg mt-4 hover:bg-slate-100 transition">
            Copy to Clipboard
          </button>
        </div>

      </div>
    </main>
  );
}
