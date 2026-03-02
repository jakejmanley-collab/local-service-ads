'use client';

import { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

export default function PreviewPage() {
  const [db, setDb] = useState<Record<string, any>>({});
  const [form, setForm] = useState({ businessName: '', field: '', phone: '', service1: '', service2: '', service3: '', service4: '', themeColor: 'red' });
  const [show, setShow] = useState(false);
  const [photos, setPhotos] = useState(["", ""]);
  const [copy, setCopy] = useState<any>(null);
  const [activeTone, setActiveTone] = useState('professional');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('flyer_form_data');
    if (saved) setForm(JSON.parse(saved));
    fetch(`/templates.csv?v=${Date.now()}`).then(r => r.text()).then(txt => {
      Papa.parse(txt, { header: true, skipEmptyLines: true, complete: (res) => {
          const map: Record<string, any> = {};
          res.data.forEach((r: any) => { if (r['Template ID']) map[r['Template ID']] = r; });
          setDb(map);
      }});
    });
  }, []);

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const [imgRes, copyRes] = await Promise.all([
        fetch('/api/generate-trade', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ trade: form.field }) 
        }),
        fetch('/api/generate-listing', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
            businessName: form.businessName, 
            trade: form.field, 
            services: [form.service1, form.service2, form.service3, form.service4].filter(Boolean) 
          }) 
        })
      ]);

      const imgData = await imgRes.json();
      const copyData = await copyRes.json();

      if (imgRes.ok) setPhotos([imgData.photo1, imgData.photo2]);
      if (copyRes.ok) setCopy(copyData);
      else console.error("Copy API Error:", copyData.error);

    } catch (err) {
      console.error("Fetch Error:", err);
    }
    setIsFetching(false);
    setShow(true);
  };

  if (show) {
    return (
      <main className="min-h-screen p-8 bg-slate-100">
        <button onClick={() => setShow(false)} className="mb-4 px-4 py-2 bg-black text-white uppercase font-bold">← Edit</button>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 italic font-bold text-center p-10 bg-white border-2 border-black border-dashed">
            Visuals Loaded (Flyers would render here)
          </div>

          <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase mb-4">Ad Copy</h2>
            
            {copy ? (
              <div className="space-y-4">
                <div className="flex border-2 border-black">
                  {['professional', 'friendly', 'aggressive'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setActiveTone(t)} 
                      className={`flex-1 py-1 text-[10px] font-bold uppercase ${activeTone === t ? 'bg-black text-white' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-2 border-black bg-gray-50 font-bold uppercase text-sm">
                  {copy[activeTone]?.headline}
                </div>
                <textarea 
                  readOnly 
                  className="w-full h-64 p-2 border-2 border-black text-xs font-sans" 
                  value={copy[activeTone]?.description} 
                />
              </div>
            ) : (
              <div className="text-center py-20 font-bold animate-pulse uppercase">Generating Text...</div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-200">
      <form onSubmit={handlePreview} className="bg-white p-10 border-4 border-black max-w-lg w-full space-y-4">
        <h1 className="text-3xl font-black uppercase italic text-center">Aretifi Studio</h1>
        <input placeholder="Business Name" className="w-full border-2 border-black p-3" onChange={e => setForm({...form, businessName: e.target.value})} />
        <input placeholder="Trade" className="w-full border-2 border-black p-3" onChange={e => setForm({...form, field: e.target.value})} />
        <input placeholder="Phone" className="w-full border-2 border-black p-3" onChange={e => setForm({...form, phone: e.target.value})} />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Service 1" className="border-2 border-black p-2 text-xs" onChange={e => setForm({...form, service1: e.target.value})} />
          <input placeholder="Service 2" className="border-2 border-black p-2 text-xs" onChange={e => setForm({...form, service2: e.target.value})} />
        </div>
        <button type="submit" disabled={isFetching} className="w-full bg-black text-white py-4 font-bold uppercase italic">
          {isFetching ? 'Processing...' : 'Generate Preview'}
        </button>
      </form>
    </main>
  );
}
