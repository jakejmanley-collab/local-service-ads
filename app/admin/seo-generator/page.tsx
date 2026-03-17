'use client';

import { useState } from 'react';
import { LayoutGrid, Zap, Database, Terminal } from 'lucide-react';

export default function SEOAdmin() {
  const [keywords, setKeywords] = useState('');
  const [passcode, setPasscode] = useState('');
  const [site, setSite] = useState<'aretifi' | 'discord'>('aretifi');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handleGenerate = async () => {
    const keywordList = keywords.split('\n').filter(k => k.trim() !== '');
    if (keywordList.length === 0 || !passcode) return alert("Missing keywords or passcode!");

    setStatus('loading');
    setLogs([]);

    for (const keyword of keywordList) {
      try {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🚀 INITIALIZING: ${keyword} for ${site.toUpperCase()}...`]);
        
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, passcode, site }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Generation failed');
        }
        
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ LIVE: ${keyword} successfully blasted to ${site} database.`]);
      } catch (err: any) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ ERROR: ${keyword} - ${err.message}`]);
      }
    }
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-3">
              <Zap className="fill-indigo-600 text-indigo-600 w-8 h-8" />
              SEO Traffic Weapon
            </h1>
            <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
              Multi-Site Content Engine • Powered by Gemini 3.1
            </p>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <button 
              onClick={() => setSite('aretifi')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${site === 'aretifi' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Aretifi.com
            </button>
            <button 
              onClick={() => setSite('discord')}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${site === 'discord' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              DiscordCompression.com
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* INPUT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <LayoutGrid className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Input Keywords</span>
              </div>
              <textarea 
                className="w-full border-2 border-slate-100 rounded-2xl p-6 h-64 focus:border-indigo-600 focus:ring-0 transition-all font-mono text-sm bg-slate-50/50"
                placeholder="compress-mov-for-discord&#10;fix-discord-file-too-powerful&#10;bulk-video-compressor-online"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="password"
                    className="w-full border-2 border-slate-100 rounded-xl py-4 px-6 focus:border-indigo-600 transition-all font-bold placeholder:font-normal"
                    placeholder="Security Passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleGenerate} 
                  disabled={status === 'loading'}
                  className="bg-black text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-200 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                  {status === 'loading' ? 'Processing...' : 'Blast Live →'}
                </button>
              </div>
            </div>
          </div>

          {/* STATUS COLUMN */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-indigo-400">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">System Logs</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {logs.length === 0 && (
                  <p className="text-slate-600 font-mono text-[10px]">Waiting for input...</p>
                )}
                {logs.map((log, i) => (
                  <div key={i} className={`font-mono text-[10px] leading-relaxed ${log.includes('✅') ? 'text-green-400' : log.includes('❌') ? 'text-red-400' : 'text-slate-400'}`}>
                    {log}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DB Status: Connected</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${status === 'loading' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
