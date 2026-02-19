'use client';

import { useState } from 'react';

export default function AiWriterPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  
  // Add state for form inputs
  const [formData, setFormData] = useState({
    businessName: '',
    platform: 'Facebook Marketplace',
    services: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResult(''); // Clear old result
    
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.adText);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult('Failed to reach the generation server.');
    } finally {
      setIsGenerating(false);
    }
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
              <input required type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Apex Plumbing" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Target Platform</label>
              <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none">
                <option value="Facebook Marketplace">Facebook Marketplace</option>
                <option value="Kijiji">Kijiji</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Core Offer / Services</label>
              <textarea required rows={3} name="services" value={formData.services} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Leak repair, fast response, 10% off first call"></textarea>
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
            <div className="bg-slate-800 p-6 rounded-lg text-slate-200 whitespace-pre-wrap flex-1 border border-slate-700 overflow-y-auto max-h-[400px]">
              {result}
            </div>
          ) : (
            <div className="bg-slate-800 p-6 rounded-lg flex-1 border border-slate-700 flex items-center justify-center text-slate-500 text-center">
              Fill out the form to the left and click generate to see your algorithm-friendly ad text.
            </div>
          )}
          <button 
            onClick={() => navigator.clipboard.writeText(result)}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg mt-4 hover:bg-slate-100 transition disabled:opacity-50"
            disabled={!result}
          >
            Copy to Clipboard
          </button>
        </div>

      </div>
    </main>
  );
}
