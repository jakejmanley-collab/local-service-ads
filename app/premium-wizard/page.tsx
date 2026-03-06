'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- CONFIGURATION DATA ---
const SHAPE_PREFERENCES = [
  { id: 'style-1', name: 'Perfect Square', render: (active: boolean) => <div className={`w-14 h-14 ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div> },
  { id: 'style-2', name: 'Diagonal Cut', render: (active: boolean) => <div className={`w-14 h-14 ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)' }}></div> },
  { id: 'style-3', name: 'Tall Portrait', render: (active: boolean) => <div className={`w-10 h-16 ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div> },
  { id: 'style-4', name: 'Sharp Hexagon', render: (active: boolean) => <div className={`w-14 h-14 ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div> },
  { id: 'style-5', name: 'Perfect Circle', render: (active: boolean) => <div className={`w-14 h-14 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div> },
  { id: 'style-6', name: 'Soft Squircle', render: (active: boolean) => <div className={`w-14 h-14 rounded-2xl ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div> },
  { id: 'style-7', name: 'Three Pillars', render: (active: boolean) => <div className="flex gap-1.5">{[1,2,3].map(i => <div key={i} className={`w-4 h-12 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div>)}</div> },
  { id: 'style-8', name: 'Sharp Diamond', render: (active: boolean) => <div className={`w-10 h-10 rotate-45 ${active ? 'bg-blue-600' : 'bg-slate-200'} transition-colors duration-300`}></div> },
];

const BASE_COLORS = [
  { id: 'blue', name: 'Professional Blue', hex: '#2563eb' },
  { id: 'red', name: 'Action Red', hex: '#dc2626' },
  { id: 'green', name: 'Growth Green', hex: '#16a34a' },
  { id: 'gold', name: 'Premium Gold', hex: '#eab308' },
  { id: 'orange', name: 'Energetic Orange', hex: '#ea580c' },
  { id: 'purple', name: 'Creative Purple', hex: '#9333ea' },
  { id: 'teal', name: 'Modern Teal', hex: '#0d9488' },
  { id: 'black', name: 'Black & Silver', hex: '#171717' },
];

const BADGE_FEATURES = [
  { id: 'satisfaction', label: '100% Satisfaction Guaranteed' },
  { id: 'licensed', label: 'Licensed & Insured' },
  { id: 'reliable', label: 'Fast & Reliable Service' },
  { id: 'affordable', label: 'Affordable Upfront Pricing' },
  { id: 'veteran', label: 'Veteran Owned & Operated' },
  { id: 'emergency', label: '24/7 Emergency Service' }
];

export default function PremiumWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Master State Object
  const [formData, setFormData] = useState({
    businessName: '',
    trade: '',
    phone: '',
    email: '',
    websiteUrl: '',
    service1: '', service2: '', service3: '', 
    service4: '', service5: '', service6: '',
    selectedStyles: [] as string[],
    selectedColors: [] as string[],
    features: [] as string[]
  });

  // Load old free-flyer data if it exists
  useEffect(() => {
    const saved = localStorage.getItem('flyer_form_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({
        ...prev,
        businessName: parsed.businessName || '',
        phone: parsed.phone || '',
        trade: parsed.field || '',
        service1: parsed.service1 || '',
        service2: parsed.service2 || '',
        service3: parsed.service3 || '',
        service4: parsed.service4 || ''
      }));
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleArrayItem = (field: 'selectedStyles' | 'selectedColors' | 'features', id: string, max?: number) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(id)) {
        return { ...prev, [field]: current.filter(item => item !== id) };
      }
      if (max && current.length >= max) {
        alert(`You can only select up to ${max}.`);
        return prev;
      }
      return { ...prev, [field]: [...current, id] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Send the data to our secure API route
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          email: formData.email,
          formData: formData 
        }),
      });

      if (response.ok) {
        router.push('/premium-success');
      } else {
        alert("Something went wrong saving your order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map(num => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-4 ${step >= num ? 'bg-blue-600 border-blue-200 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
              {num}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl">
          
          {/* STEP 1: CORE DETAILS */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black mb-2">Step 1: Core Information</h2>
              <p className="text-slate-500 mb-8 font-medium">Tell us about your business so our design team can build your custom assets.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Business Name</label>
                  <input type="text" name="businessName" placeholder="e.g. Apex Plumbing" value={formData.businessName} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Business Type / Trade</label>
                  <input type="text" name="trade" placeholder="e.g. Plumbing, HVAC, Roofing" value={formData.trade} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-600" />
                </div>
              </div>

              {/* PHONE, EMAIL, AND URL BLOCK */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone</label>
                  <input type="text" name="phone" placeholder="555-555-5555" value={formData.phone} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Email <span className="text-slate-300 font-medium normal-case ml-1">(Optional)</span>
                  </label>
                  <input type="email" name="email" placeholder="hello@company.com" value={formData.email} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Website URL <span className="text-slate-300 font-medium normal-case ml-1">(Optional)</span>
                  </label>
                  <input type="text" name="websiteUrl" placeholder="www.company.com" value={formData.websiteUrl} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-blue-600" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-4">Core Services (Up to 6)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <input key={num} type="text" name={`service${num}`} placeholder={`Service ${num}`} value={(formData as any)[`service${num}`]} onChange={handleTextChange} className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-2 font-medium outline-none focus:border-blue-400 focus:bg-white" />
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setStep(2)} 
                disabled={!formData.businessName || !formData.trade}
                className="w-full mt-10 bg-black text-white font-black text-lg py-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                Next: Visual Preferences →
              </button>
            </div>
          )}

          {/* STEP 2: SHAPES & COLORS */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black mb-2">Step 2: Visual Blueprint</h2>
              <p className="text-slate-500 mb-8 font-medium">Select 2 core layout shapes and 2 brand colors to guide the design.</p>

              {/* Shapes Grid */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-lg">Layout Structure Focus</h3>
                  <span className="text-sm font-bold text-blue-600">{formData.selectedStyles.length} / 2 Selected</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SHAPE_PREFERENCES.map(shape => {
                    const isSelected = formData.selectedStyles.includes(shape.id);
                    return (
                      <div key={shape.id} onClick={() => toggleArrayItem('selectedStyles', shape.id, 2)} className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-4 transition-all h-36 ${isSelected ? 'border-blue-600 bg-blue-50/50 scale-[0.98]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center justify-center h-16 w-16">
                          {shape.render(isSelected)}
                        </div>
                        <span className={`font-bold text-xs text-center uppercase tracking-wide ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>{shape.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Colors Grid */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-lg">Core Brand Colors</h3>
                  <span className="text-sm font-bold text-blue-600">{formData.selectedColors.length} / 2 Selected</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {BASE_COLORS.map(color => {
                    const isSelected = formData.selectedColors.includes(color.id);
                    return (
                      <div key={color.id} onClick={() => toggleArrayItem('selectedColors', color.id, 2)} className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-3 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm scale-[0.98]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="w-12 h-12 rounded-full shadow-inner border-2 border-slate-100" style={{ backgroundColor: color.hex }}></div>
                        <span className="font-bold text-sm text-center leading-tight">{color.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(1)} className="w-1/3 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200">← Back</button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={formData.selectedStyles.length !== 2 || formData.selectedColors.length !== 2}
                  className="w-2/3 bg-black text-white font-black text-lg py-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                  Next: Premium Badges →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BADGES & FEATURES */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black mb-2">Step 3: Trust Badges</h2>
              <p className="text-slate-500 mb-8 font-medium">Select any premium icons or badges you want printed on your flyers to boost trust.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BADGE_FEATURES.map(feature => {
                  const isSelected = formData.features.includes(feature.id);
                  return (
                    <div key={feature.id} onClick={() => toggleArrayItem('features', feature.id)} className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                        {isSelected && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="font-bold">{feature.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(2)} className="w-1/3 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200">← Back</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-2/3 bg-blue-600 text-white font-black text-lg py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-[0_8px_30px_rgb(37,99,235,0.3)]"
                >
                  {loading ? 'Submitting...' : 'Submit to Design Team'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
