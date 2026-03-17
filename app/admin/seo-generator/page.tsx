'use client';

import { useState } from 'react';
import { LayoutGrid, Zap, Database, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SEOAdmin() {
  const [keywords, setKeywords] = useState('');
  const [passcode, setPasscode] = useState('');
  const [site, setSite] = useState<'aretifi' | 'discord'>('aretifi');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false); // Safety Lock

  const handleGenerate = async () => {
    if (!confirmed) return alert("Please check the 'Site Confirmation' box first!");
    
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
        
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ LIVE: ${keyword} blasted to ${site} DB.`]);
      } catch (err: any) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ ERROR: ${keyword} - ${err.message}`]);
      }
    }
    setStatus('success');
    setConfirmed(false); // Reset lock after completion
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* SAFETY WARNING BANNER */}
        <div className={`mb-8 p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
          site === 'aretifi' 
            ? 'bg-amber-50 border-amber-200 text-amber-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <AlertTriangle className={site === 'aretifi' ? 'text-amber-500' : 'text-blue-500'} />
          <div>
            <p className="text-xs font-black uppercase tracking-widest">Active Target Site</p>
            <p className="text-lg font-bold">
              Current Mode: <span className="underline decoration-2">{site === 'aretifi' ? 'ARETIFI (Flyers/Contractors)' : 'DISCORD (Video Compression)'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-3">
              <Zap className="fill-indigo-600 text-indigo-600 w-8 h-8" />
              SEO Traffic Weapon
            </h1>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <button 
              onClick={() => {setSite('aretifi'); setConfirmed(false);}}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${site === 'aretifi' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Aretifi
            </button>
            <button 
              onClick={() => {setSite('discord'); setConfirmed(false);}}
              className={`px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${site === 'discord' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              Discord
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <textarea 
                className="w-full border-2 border-slate-100 rounded-2xl p-6 h-64 focus:border-indigo-600 focus:ring-0 transition-all font-mono text-sm bg-slate-50/50 mb-6"
                placeholder="Enter keywords..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              
              {/* THE SAFETY LOCK */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <input 
                  type="checkbox" 
                  id="confirm" 
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="confirm" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                  Confirm: Blast these keywords to <span className="uppercase text-indigo-600">{site}</span>
                </label>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="password"
                  className="flex-1 border-2 border-slate-100 rounded-xl py-4 px-6 focus:border-indigo-600 transition-all"
                  placeholder="Security Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
                <button 
                  onClick={handleGenerate} 
                  disabled={status === 'loading' || !confirmed}
                  className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2 ${
                    !confirmed ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-black text-white hover:bg-indigo-700'
                  }`}
                >
                  {status === 'loading' ? 'Processing...' : 'Blast Live →'}
                </button>
              </div>
            </div>
          </div>

          {/* STATUS COLUMN */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl h-full flex flex-col min-h-[400px]">
               <div className="flex items-center gap-2 mb-6 text-indigo-400">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">System Logs</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] text-slate-400">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
