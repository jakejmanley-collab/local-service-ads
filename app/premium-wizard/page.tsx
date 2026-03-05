'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CONFIGURATION DATA ---
const FLYER_STYLES = [
  { id: 'style-1', name: 'Modern Slate & Crimson' },
  { id: 'style-2', name: 'Brushed Metal & Action' },
  { id: 'style-3', name: 'Magazine Editorial' },
  { id: 'style-4', name: 'The Diagonal Corporate' },
  { id: 'style-5', name: 'Circular Cutout' },
  { id: 'style-6', name: 'B2B Minimalist Grid' },
  { id: 'style-7', name: 'Three-Pillar Icon' },
  { id: 'style-8', name: 'Geometric High-Contrast' },
];

const COLOR_SCHEMES = [
  { id: 'color-1', name: 'Trust & Authority', hex1: '#0A2540', hex2: '#D4AF37', hex3: '#FFFFFF' },
  { id: 'color-2', name: 'Emergency Action', hex1: '#D90429', hex2: '#2B2D42', hex3: '#F8F9FA' },
  { id: 'color-3', name: 'Clean Flow', hex1: '#0F766E', hex2: '#38BDF8', hex3: '#E2E8F0' },
  { id: 'color-4', name: 'Eco Growth', hex1: '#166534', hex2: '#22C55E', hex3: '#111827' },
  { id: 'color-5', name: 'Industrial Strength', hex1: '#FACC15', hex2: '#0F172A', hex3: '#94A3B8' },
  { id: 'color-6', name: 'Smart Tech', hex1: '#4F46E5', hex2: '#06B6D4', hex3: '#1E293B' },
  { id: 'color-7', name: 'High-End Luxury', hex1: '#171717', hex2: '#F3E8D6', hex3: '#FDFAF5' },
  { id: 'color-8', name: 'Hot & Cold', hex1: '#FF5A5F', hex2: '#A8DADC', hex3: '#1D3557' },
  { id: 'color-9', name: 'Fresh & Spotless', hex1: '#34D399', hex2: '#FB7185', hex3: '#FAFAFA' },
  { id: 'color-10', name: 'Earth & Timber', hex1: '#C2410C', hex2: '#E5E5CB', hex3: '#3E2723' },
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
    phone: '',
    trade: '',
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

    const { error } = await supabase.from('flyer_orders').insert([{
      customer_email: `${formData.businessName.replace(/\s/g, '')}@customer.com`, 
      stripe_session_id: `wizard_upgrade_${Date.now()}`,
      status: 'needs_generation',
      trade: formData.trade || 'Service',
      details: formData // Saves all colors, styles, and text!
    }]);

    setLoading(false);
    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      router.push('/dashboard?upgrade=pending');
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
              <h2 className="text-3xl font-black mb-2">Step 1: Your Business Info</h2>
              <p className="text-slate-500 mb-8 font-medium">Let's get the exact details our AI should print on your premium flyers.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleTextChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-blue-600" />
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

              <button onClick={() => setStep(2)} className="w-full mt-10 bg-black text-white font-black text-lg py-4 rounded-xl hover:bg-slate-800 transition-all">Next: Visual Style →</button>
            </div>
          )}

          {/* STEP 2: STYLES & COLORS */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black mb-2">Step 2: Design Blueprint</h2>
              <p className="text-slate-500 mb-8 font-medium">Select exactly 2 styles and 2 color schemes for the AI to use.</p>

              {/* Styles Grid */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-lg">Flyer Styles</h3>
                  <span className="text-sm font-bold text-blue-600">{formData.selectedStyles.length} / 2 Selected</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {FLYER_STYLES.map(style => {
                    const isSelected = formData.selectedStyles.includes(style.id);
                    return (
                      <div key={style.id} onClick={() => toggleArrayItem('selectedStyles', style.id, 2)} className={`cursor-pointer rounded-xl border-4 transition-all overflow-hidden ${isSelected ? 'border-blue-600 scale-[0.98]' : 'border-transparent hover:border-slate-200'}`}>
                        {/* Placeholder for actual image thumbnails */}
                        <div className="bg-slate-100 aspect-[3/4] flex items-center justify-center p-4 text-center">
                          <span className="font-bold text-slate-400 text-sm">{style.name}</span>
                        </div>
                        {isSelected && <div className="bg-blue-600 text-white text-xs font-black py-1 text-center uppercase">Selected</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Colors Grid */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-lg">Color Palettes</h3>
                  <span className="text-sm font-bold text-blue-600">{formData.selectedColors.length} / 2 Selected</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {COLOR_SCHEMES.map(color => {
                    const isSelected = formData.selectedColors.includes(color.id);
                    return (
                      <div key={color.id} onClick={() => toggleArrayItem('selectedColors', color.id, 2)} className={`cursor-pointer border-2 rounded-xl p-3 flex items-center gap-3 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex-shrink-0 flex w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                          <div className="w-1/2 h-full" style={{ backgroundColor: color.hex1 }}></div>
                          <div className="w-1/2 h-full" style={{ backgroundColor: color.hex2 }}></div>
                        </div>
                        <span className="font-bold text-sm leading-tight">{color.name}</span>
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
                  Next: Premium Features →
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
                  {loading ? 'Submitting...' : 'Submit to Design Engine'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
