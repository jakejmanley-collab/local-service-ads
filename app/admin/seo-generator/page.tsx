'use client';

import { useState } from 'react';

export default function SEOGenerator() {
  const [keywords, setKeywords] = useState('');
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handleGenerate = async () => {
    const keywordList = keywords.split('\n').filter(k => k.trim() !== '');
    if (keywordList.length === 0 || !passcode) return alert("Enter keywords and passcode!");

    setStatus('loading');
    setLogs([]);

    for (const keyword of keywordList) {
      try {
        setLogs(prev => [...prev, `Generating: ${keyword}...`]);
        
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, passcode }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Unknown error');
        
        setLogs(prev => [...prev, `✅ SUCCESS: ${keyword}`]);
      } catch (err: any) {
        setLogs(prev => [...prev, `❌ FAILED: ${keyword} - ${err.message}`]);
      }
    }

    setStatus('success');
  };

  return (
    <div className="max-w-2xl mx-auto p-10 font-sans">
      <h1 className="text-3xl font-black italic uppercase mb-6">SEO Machine 3.1</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase mb-1">Keywords (One per line)</label>
          <textarea 
            className="w-full border-4 border-black p-4 h-48 focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            placeholder="How to get customers..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-1">Admin Passcode</label>
          <input 
            type="password"
            className="w-full border-4 border-black p-4 focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={status === 'loading'}
          className={`w-full py-4 font-black uppercase italic text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
            status === 'loading' ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'loading' ? 'Processing...' : 'Blast Content Live →'}
        </button>

        {logs.length > 0 && (
          <div className="mt-8 bg-black text-green-400 p-6 font-mono text-sm rounded-lg overflow-y-auto max-h-60 border-4 border-slate-700">
            <p className="text-white font-bold mb-2">SYSTEM LOGS:</p>
            {logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
