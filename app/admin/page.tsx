'use client';
import { useState } from 'react';

export default function SEOAdmin() {
  const [keywords, setKeywords] = useState('');
  const [passcode, setPasscode] = useState('');
  const [site, setSite] = useState<'aretifi' | 'discord'>('aretifi'); // New Site Selector
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handleGenerate = async () => {
    const keywordList = keywords.split('\n').filter(k => k.trim() !== '');
    if (keywordList.length === 0 || !passcode) return alert("Missing keywords or passcode!");

    setStatus('loading');
    setLogs([]);

    for (const keyword of keywordList) {
      try {
        setLogs(prev => [...prev, `🚀 Blasting: ${keyword} for ${site}...`]);
        
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, passcode, site }), // Sending site choice to API
        });

        if (!res.ok) throw new Error('Failed to generate');
        
        setLogs(prev => [...prev, `✅ SUCCESS: ${keyword} is now live on ${site}!`]);
      } catch (err: any) {
        setLogs(prev => [...prev, `❌ FAILED: ${keyword} - ${err.message}`]);
      }
    }
    setStatus('success');
  };

  return (
    <div className="max-w-3xl mx-auto p-12 font-sans bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8 text-slate-900">
        SEO Traffic Engine
      </h1>

      <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
        {/* Site Selector */}
        <div className="flex gap-4 p-2 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setSite('aretifi')}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs transition-all ${site === 'aretifi' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Aretifi (Flyers)
          </button>
          <button 
            onClick={() => setSite('discord')}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs transition-all ${site === 'discord' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Discord (Video)
          </button>
        </div>

        <textarea 
          className="w-full border-2 border-slate-200 rounded-2xl p-6 h-48 focus:border-indigo-600 focus:ring-0 transition-all font-medium"
          placeholder="Paste keywords (one per line)..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <input 
          type="password"
          className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-indigo-600 transition-all"
          placeholder="Admin Security Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />

        <button 
          onClick={handleGenerate} 
          disabled={status === 'loading'}
          className="w-full py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 disabled:bg-slate-300 transition-all shadow-xl"
        >
          {status === 'loading' ? 'Engine Running...' : `Blast Content to ${site} →`}
        </button>
      </div>

      {/* Terminal Logs */}
      {logs.length > 0 && (
        <div className="mt-8 bg-slate-900 text-green-400 p-6 rounded-3xl font-mono text-xs shadow-inner max-h-64 overflow-y-auto border-4 border-slate-800">
          {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
        </div>
      )}
    </div>
  );
}
