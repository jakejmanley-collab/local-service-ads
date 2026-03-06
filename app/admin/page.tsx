'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SeoGeneratorAdmin() {
  const [keywordsInput, setKeywordsInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState<{ keyword: string; status: 'pending' | 'generating' | 'success' | 'failed' }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const startGeneration = async () => {
    // 1. Split the text area by new lines and remove any empty lines
    const keywords = keywordsInput.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) return;

    // 2. Set the initial status for the UI Tracker
    const initialStatus = keywords.map(k => ({ keyword: k, status: 'pending' as const }));
    setStatus(initialStatus);
    setIsProcessing(true);

    // 3. Loop through the keywords ONE BY ONE (to prevent Vercel/AI timeouts)
    for (let i = 0; i < keywords.length; i++) {
      const currentKeyword = keywords[i];
      
      // Update UI to show 'generating' for the current keyword
      setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'generating' } : item));

      try {
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            keyword: currentKeyword,
            passcode: passcode 
          }),
        });

        if (res.ok) {
          // Success!
          setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'success' } : item));
        } else {
          // The API threw an error
          setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'failed' } : item));
        }
      } catch (err) {
        // Network error
        setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'failed' } : item));
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      
      {/* Top Navigation */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
        <Link href="/admin" className="font-bold text-slate-500 hover:text-black transition-colors">
          ← Back to Admin
        </Link>
        <span className="font-black uppercase tracking-widest text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
          Super Admin
        </span>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase italic mb-2 text-slate-900">SEO Machine</h1>
        <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
          Paste your target keywords below (one per line). The AI will generate a highly-optimized, 1000-word article for each keyword and save it directly to your Supabase database.
        </p>

        {/* Keyword Input Area */}
        <div className="mb-6 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-yellow-100 transform translate-x-2 translate-y-2 border-2 border-black -z-10"></div>
          <textarea 
            className="w-full h-64 border-4 border-black p-4 font-medium text-slate-800 outline-none focus:bg-yellow-50 transition-colors resize-y bg-white"
            placeholder="plumbing flyer ideas&#10;how to advertise landscaping&#10;facebook marketplace for cleaners"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Passcode Input */}
        <input 
          type="password"
          placeholder="Enter Admin Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full border-4 border-black p-4 mb-6 font-bold text-slate-900 outline-none focus:bg-yellow-50 transition-colors"
          disabled={isProcessing}
        />

        {/* Generate Button */}
        <button 
          onClick={startGeneration}
          disabled={isProcessing || !keywordsInput || !passcode}
          className="w-full bg-blue-600 text-white py-5 font-black uppercase text-xl italic hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
        >
          {isProcessing ? 'Generating Articles...' : 'Start Mass Generation'}
        </button>

        {/* Status Tracker (Only shows after you click the button) */}
        {status.length > 0 && (
          <div className="mt-12 border-t-4 border-black pt-8">
            <h3 className="font-black uppercase mb-4 text-lg text-slate-900">Progress Log</h3>
            <div className="space-y-3">
              {status.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 p-4 border-2 border-slate-200">
                  <span className="font-bold text-slate-700 mb-2 sm:mb-0 truncate pr-4" title={item.keyword}>
                    {item.keyword}
                  </span>
                  <span className={`text-xs font-black uppercase px-3 py-1.5 shrink-0 text-center ${
                    item.status === 'success' ? 'bg-green-200 text-green-900 border-2 border-green-900' : 
                    item.status === 'failed' ? 'bg-red-200 text-red-900 border-2 border-red-900' : 
                    item.status === 'generating' ? 'bg-yellow-300 text-yellow-900 border-2 border-yellow-900 animate-pulse' : 
                    'bg-slate-200 text-slate-500 border-2 border-slate-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Completion Message */}
            {!isProcessing && status.some(s => s.status === 'success') && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-600 text-green-800 font-bold text-sm text-center">
                Generation complete! Remember to trigger a new Vercel deployment so the static pages build and go live.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
