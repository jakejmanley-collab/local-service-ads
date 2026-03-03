'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

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
    <div id={id} className="relative w-full bg-white">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" />
        {p1 && <foreignObject x={p1.x} y={p1.y} width={p1.w} height={p1.h}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo1} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { e.currentTarget.src = FALLBACK_1; }} /></div></foreignObject>}
        {p2 && <foreignObject x={p2.y} width={p2.w} height={p2.h} y={p2.y}><div style={{ width: '100%', height: '100%', ...clip }}><img src={photo2} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { e.currentTarget.src = FALLBACK_2; }} /></div></foreignObject>}
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
  
  // Auth Gate State
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
    
    // Save their form data locally so it persists to their dashboard later
    localStorage.setItem('flyer_form_data', JSON.stringify(form));
    
    try {
      // 1. Fetch Images
      const imgRes = await fetch('/api/generate-trade', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ trade: form.field }) 
      });
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setPhotos([imgData.photo1, imgData.photo2]);
      }

      // 2. Fetch Ad Copy
      const copyRes = await fetch('/api/generate-listing', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          businessName: form.businessName, 
          trade: form.field, 
          services: [form.service1, form.service2, form.service3, form.service4].filter(Boolean) 
        }) 
      });

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
    // Simulate user creation and push directly to dashboard
    localStorage.setItem('aretifi_user_email', authEmail);
    router.push('/dashboard');
  };

  if (show) {
    return (
      <main className="min-h-screen p-8 bg-slate-50 font-sans relative">
        
        {/* Auth Modal Gate */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-8 relative">
              <button 
                onClick={() => setShowAuthModal(false)} 
                className="absolute top-4 right-4 font-black text-2xl hover:text-red-600 transition-colors"
              >
                ✕
              </button>
              <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight">Save Your Assets</h2>
              <p className="text-sm font-bold text-slate-600 mb-6">Create your free account to unlock high-res downloads and save your professional ad copy.</p>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <input 
                  type="email" 
                  required 
                  placeholder="Email Address" 
                  className="w-full border-4 p-4 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" 
                  value={authEmail} 
                  onChange={e => setAuthEmail(e.target.value)} 
                />
                <input 
                  type="password" 
                  required 
                  placeholder="Create Password" 
                  className="w-full border-4 p-4 border-black font-bold outline-none focus:bg-yellow-50 transition-colors" 
                  value={authPassword} 
                  onChange={e => setAuthPassword(e.target.value)} 
                />
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-black py-4 uppercase text-xl italic tracking-tight border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all hover:bg-blue-700"
                >
                  Create Free Account
                </button>
              </form>
              <p className="text-center text-xs font-bold text-slate-400 mt-4 uppercase">100% Free • No Credit Card Required</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mb-8">
          <button onClick={() => setShow(false)} className="px-6 py-2 bg-black text-white font-bold uppercase italic border-b-4 border-gray-700 active:translate-y-1 active:border-b-0 transition-all">← Edit Info</button>
          <div className="flex gap-2">
            {THEME_COLORS.map(color => (
              <button key={color} onClick={() => setForm({...form, themeColor: color})} className={`w-8 h-8 border-2 border-black transition-transform ${form.themeColor === color ? 'scale-110 ring-2 ring-black' : ''}`} style={{ backgroundColor: color === 'gold' ? '#D4AF37' : color }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {['circle', 'square', 'hex'].map(s => (
              <div key={s} id={`f-${s}`} className="border-4 border-black bg-white shadow-lg overflow-hidden flex flex-col">
                <MasterTemplate id={`t-${s}`} data={form} configKey={`${s}-${form.themeColor}`} rawDatabase={db} photo1={photos[0]} photo2={photos[1]} />
                <button 
                  onClick={() => setShowAuthModal(true)} 
                  className="w-full mt-auto bg-black text-white py-4 font-black uppercase text-sm hover:bg-gray-900 transition-colors"
                >
                  Download {s}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 border-4 border-black h-fit shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic mb-4 border-b-2 border-black pb-2">Listing Copy</h2>
            {copy ? (
              <div className
