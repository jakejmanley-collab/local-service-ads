'use client';

import { useState } from 'react';
import { Zap, Terminal, AlertTriangle } from 'lucide-react';

export default function SEOAdmin() {
  const [keywords, setKeywords] = useState('');
  const [passcode, setPasscode] = useState('');
  const [site, setSite] = useState<'aretifi' | 'discord'>('aretifi');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const handleGenerate = async () => {
    if (!confirmed) return alert("Please confirm the target site.");
    const keywordList = keywords.split('\n').filter(k => k.trim() !== '');
    
    setStatus('loading');
    for (const keyword of keywordList) {
      try {
        setLogs(prev => [...prev, `🚀 Blasting: ${keyword}...`]);
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, passcode, site }),
        });
        
        if (!res.ok) {
          let errorMessage = "Check Passcode or Vercel Env Vars";
          try {
            const errData = await res.json();
            if (errData.error) errorMessage = errData.error;
          } catch (e) {
            errorMessage = `Server Error: ${res.status} (Check Middleware)`;
          }
          throw new Error(errorMessage);
        }
        
        setLogs(prev => [...prev, `✅ Success: ${keyword} is now LIVE on ${site}`]);
      } catch (err: any) {
        setLogs(prev => [...prev, `❌ Error: ${err.message}`]);
      }
    }
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-12 font-sans">
       <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">SEO Traffic Weapon</h1>

       {/* Site Warning Banner */}
       <div className={`mb-8 p-6 rounded-2xl border-2 flex items-center gap-4 ${site === 'aretifi' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
          <AlertTriangle className={site === 'aretifi' ? 'text-amber-500' : 'text-blue-500'} />
          <p className="font-bold">TARGET: <span className="underline">{site.toUpperCase()}</span></p>
       </div>

       {/* Site Selector */}
       <div className="flex gap-4 mb-8">
          <button onClick={() => {setSite('aretifi'); setConfirmed(false);}} className={`px-8 py-3 rounded-xl font-bold uppercase text-xs ${site === 'aretifi' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Aretifi (Flyers)</button>
          <button onClick={() => {setSite('discord'); setConfirmed(false);}} className={`px-8 py-3 rounded-xl font-bold uppercase text-xs ${site === 'discord' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Discord (Video)</button>
       </div>

       <textarea 
         className="w-full h-64 p-6 rounded-3xl border-2 border-slate-200 mb-6 font-mono text-sm focus:border-indigo-600 outline-none"
         placeholder="Enter keywords (one per line)..."
         value={keywords}
         onChange={(e) => setKeywords(e.target.value)}
       />

       <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <input 
           type="password" 
           placeholder="Admin Passcode" 
           className="p-4 rounded-xl border-2 border-slate-100 flex-1"
           value={passcode}
           onChange={(e) => setPasscode(e.target.value)}
         />
         <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
           <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-5 h-5 rounded" />
           Confirm Blast to {site}
         </label>
         <button 
           onClick={handleGenerate} 
           disabled={status === 'loading' || !confirmed}
           className="bg-black text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 transition-all"
         >
           {status === 'loading' ? 'Processing...' : 'Blast Live →'}
         </button>
       </div>

       {/* Terminal Logs */}
       <div className="mt-8 bg-slate-900 text-green-400 p-8 rounded-[2rem] font-mono text-xs h-64 overflow-y-auto shadow-2xl">
         <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4" /> SYSTEM_LOGS
         </div>
         {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
       </div>
    </div>
  );
}
