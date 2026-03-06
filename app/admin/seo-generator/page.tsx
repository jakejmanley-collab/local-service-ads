'use client';

import { useState } from 'react';

export default function SeoGeneratorAdmin() {
  const [keywordsInput, setKeywordsInput] = useState('');
  const [status, setStatus] = useState<{ keyword: string; status: 'pending' | 'generating' | 'success' | 'failed' }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const startGeneration = async () => {
    // Split the text area by new lines and remove empty ones
    const keywords = keywordsInput.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) return;

    // Set initial status for the UI
    const initialStatus = keywords.map(k => ({ keyword: k, status: 'pending' as const }));
    setStatus(initialStatus);
    setIsProcessing(true);

    // Loop through one by one so Vercel doesn't timeout
    for (let i = 0; i < keywords.length; i++) {
      const currentKeyword = keywords[i];
      
      // Update UI to show 'generating'
      setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'generating' } : item));

      try {
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: currentKeyword }),
        });

        if (res.ok) {
          setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'success' } : item));
        } else {
          setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'failed' } : item));
        }
      } catch (err) {
        setStatus(prev => prev.map((item, index) => index === i ? { ...item, status: 'failed' } : item));
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase italic mb-2">SEO Machine</h1>
        <p className="text-slate-500 font-bold text-sm mb-6">Paste your keywords below (one per line). The AI will generate a 1000-word article for each and save it to your database.</p>

        <textarea 
          className="w-full h-64 border-2 border-black p-4 font-medium outline-none focus:bg-yellow-50 mb-4"
          placeholder="plumbing flyer ideas&#10;how to advertise landscaping&#10;facebook marketplace for cleaners"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          disabled={isProcessing}
        />

        <button 
          onClick={startGeneration}
          disabled={isProcessing || !keywordsInput}
          className="w-full bg-black text-white py-4 font-black uppercase text-xl italic hover:bg-slate-800 disabled:opacity-50 transition-all"
        >
          {isProcessing ? 'Generating Articles...' : 'Start Mass Generation'}
        </button>

        {/* Status Tracker */}
        {status.length > 0 && (
          <div className="mt-8 border-t-2 border-black pt-6">
            <h3 className="font-black uppercase mb-4">Progress Log</h3>
            <div className="space-y-2">
              {status.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-100 p-3 border border-slate-300">
                  <span className="font-bold">{item.keyword}</span>
                  <span className={`text-sm font-black uppercase px-2 py-1 ${
                    item.status === 'success' ? 'bg-green-200 text-green-800' : 
                    item.status === 'failed' ? 'bg-red-200 text-red-800' : 
                    item.status === 'generating' ? 'bg-yellow-200 text-yellow-800 animate-pulse' : 
                    'text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
