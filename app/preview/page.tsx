'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';
import Link from 'next/link';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];
const FALLBACK_1 = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800"; 
const FALLBACK_2 = "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800";

const parse = (val: string) => {
  if (!val || val.trim() === "") return null;
  const p = val.split(',').map(s => s.trim());
  if (p.length < 4) return null;
  return {
    x: p[0], y: p[1], w: p[2], h: p[3],
    s: { fontSize: p[4] || '30px', color: p[5] || '#000', fontWeight: p[6] || '400', fontFamily: p[8] || 'Anton', lineHeight: '1', display: 'flex', alignItems: 'center' }
  };
};

// RESTORED: MasterTemplate component required for rendering the flyers
const MasterTemplate = ({ id, data, configKey, rawDatabase, photo1, photo2 }: any) => {
  const row = rawDatabase[configKey];
  if (!row) return null;
  const p1 = parse(row['Photo Hole']); const p2 = parse(row['Photo Hole 2']); 
  const h1 = parse(row['Header Top']); const h2 = parse(row['Header Bottom']);
  const s1 = parse(row['Service 1']); const s2 = parse(row['Service 2']);
  const s3 = parse(row['Service 3']); const s4 = parse(row['Service 4']);
  const ph = parse(row['Phone']);
  const name = data.businessName || "";
  const first = name.split(' ')[0] || "PRO";
  const rest = name.split(' ').slice(1).join(' ') || "SERVICES";
  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  const clip = isHex ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } : isCircle ? { borderRadius: '50%', overflow: 'hidden' } : {};

  return (
    <div id={id} className="relative w-full bg-white text-balance">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        {p1 && <foreignObject x={p1.x} y={p1.y} width={p1.w} height={p1.h}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo1} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e: any) => { e.currentTarget.src = FALLBACK_1; }} /></div></foreignObject>}
        {p2 && <foreignObject x={p2.x} y={p2.y} width={p2.w} height={p2.h}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo2} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e: any) => { e.currentTarget.src = FALLBACK_2; }} /></div></foreignObject>}
        {[{ c: h1, t: first }, { c: h2, t: rest }, { c: ph, t: data.phone, isPhone: true }, { c: s1, t: data.service1 ? `✓ ${data.service1}` : '' }, { c: s2, t: data.service2 ? `✓ ${data.service2}` : '' }, { c: s3, t: data.service3 ? `✓ ${data.service3}` : '' }, { c: s4, t: data.service4 ? `✓ ${data.service4}` : '' }].map((item, i) => {
          if (!item.c || !item.t) return null;
          return <foreignObject key={i} x={item.c.x} y={item.c.y} width={item.c.w} height={item.c.h} style={{ overflow: 'visible' }}><div style={item.c.s} className="w-full h-full uppercase whitespace-nowrap">{item.t}</div></foreignObject>;
        })}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const router = useRouter();
  const [db, setDb] = useState<Record<string, any>>({});
  const [form, setForm] = useState({ businessName: '', field: '', phone: '', service1: '', service2: '', service3: '', service4: '', themeColor: 'red' });
  const [show, setShow] = useState(false);
  const [photos, setPhotos] = useState([FALLBACK_1, FALLBACK_2]);
  const [copy, setCopy] = useState<any>(null);
  const [activeTone, setActiveTone] = useState('professional');
  const [isFetching, setIsFetching] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

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
    setErrorStatus('');
    setCopy(null);
    localStorage.setItem('flyer_form_data', JSON.stringify(form));
    
    try {
      const imgRes = await fetch('/api/generate-trade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trade: form.field }) });
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setPhotos([imgData.photo1, imgData.photo2]);
      }
      const copyRes = await fetch('/api/generate-listing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessName: form.businessName, trade: form.field, services: [form.service1, form.service2, form.service3, form.service4].filter(Boolean) }) });
      if (copyRes.ok) {
        const copyData = await copyRes.json();
        setCopy(copyData);
        setShow(true);
      } else {
        const err = await copyRes.json();
        setErrorStatus(err.error || 'Server Error');
        setShow(true);
      }
    } catch (err: any) { 
      setErrorStatus('Connection Lost');
      setShow(true);
    }
    setIsFetching(false);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('aretifi_user_email', authEmail);
    localStorage.setItem('aretifi_assets', JSON.stringify({ photos, copy }));
    router.push('/dashboard');
  };

  if (show) {
    return (
      <main className="min-h-screen p-8 bg-slate-50 font-sans relative">
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">✕</button>
              <h2 className="text-2xl font-bold mb-2">Save Your Work</h2>
              <p className="text-slate-500 mb-8">Create your free account to download your flyers and save your ad text.</p>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input type="email" required placeholder="Email Address" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                <input type="password" required placeholder="Create Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">Create Free Account</button>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-6">
              <button onClick={() => setShow(false)} className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">
                ← Back to Edit
              </button>
              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
              <Link href="/upgrade-offer" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">
                ✨ Upgrade to Premium
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2">Flyer Theme</span>
              {THEME_COLORS.map(color => (
                <button 
                  key={color} 
                  onClick={() => setForm({...form, themeColor: color})} 
                  className={`w-6 h-6 rounded-full transition-all ${form.themeColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-60 hover:opacity-100'}`} 
                  style={{ backgroundColor: color === 'gold' ? '#D4AF37' : color }} 
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['circle', 'square', 'hex'].map(s => (
                  <div key={s} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                    {/* MasterTemplate is now defined above */}
                    <MasterTemplate id={`t-${s}`} data={form} configKey={`${s}-${form.themeColor}`} rawDatabase={db} photo1={photos[0]} photo2={photos[1]} />
                    <div className="p-4">
                      <button onClick={() => setShowAuthModal(true)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">Download {s}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
              <h2 className="text-lg font-bold mb-6">Ad Copy</h2>
              {copy ? (
                <div className="space-y-6">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['professional', 'friendly', 'aggressive'].map(t => (
                      <button key={t} onClick={() => setActiveTone(t)} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${activeTone === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs font-bold text-blue-600 uppercase mb-1">Headline</p>
                      <p className="font-bold text-slate-900">{copy[activeTone]?.headline}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Description</p>
                      <textarea readOnly className="w-full h-64 text-sm border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={copy[activeTone]?.description} />
                    </div>
                  </div>
                  <button onClick={() => setShowAuthModal(true)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">Copy Text</button>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-300 font-medium italic">Generating Ad Copy...</div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="bg-white max-w-xl w-full p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Aretifi Studio</h1>
          <p className="text-slate-500 font-medium">Create professional ads for your business in seconds.</p>
        </div>
        
        <form onSubmit={handlePreview} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Business Name</label>
            <input value={form.businessName} required placeholder="e.g. Acme Plumbing" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" onChange={e => setForm({...form, businessName: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Your Trade</label>
              <input value={form.field} required placeholder="Plumber" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" onChange={e => setForm({...form, field: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
              <input value={form.phone} required placeholder="(555) 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Top Services</label>
            <div className="grid grid-cols-2 gap-4">
              <input value={form.service1} required placeholder="Service 1" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" onChange={e => setForm({...form, service1: e.target.value})} />
              <input value={form.service2} required placeholder="Service 2" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" onChange={e => setForm({...form, service2: e.target.value})} />
              <input value={form.service3} placeholder="Service 3 (Optional)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" onChange={e => setForm({...form, service3: e.target.value})} />
              <input value={form.service4} placeholder="Service 4 (Optional)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" onChange={e => setForm({...form, service4: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={isFetching} className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all text-lg">
            {isFetching ? 'Generating Your Ads...' : 'Create My Ads'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <Link href="/upgrade-offer" className="text-sm font-bold text-blue-600 hover:underline">
            Want more custom styles? Explore Premium →
          </Link>
        </div>
      </div>
    </main>
  );
}
