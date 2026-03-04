'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PremiumIntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    field: '',
    phone: '',
    service1: '',
    service2: '',
    service3: '',
    service4: '',
    service5: '', 
    service6: '', 
    websiteUrl: '', 
    themeColor: 'blue'
  });

  useEffect(() => {
    const saved = localStorage.getItem('flyer_form_data');
    if (saved) {
      setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem('flyer_form_data', JSON.stringify(formData));
    localStorage.setItem('aretifi_flyers', 'pending_review'); 

    // Save everything into the new 'details' column
    const { error } = await supabase.from('flyer_orders').insert([{
      customer_email: `${formData.businessName.replace(/\s/g, '')}@customer.com`, 
      stripe_session_id: `manual_upgrade_${Date.now()}`,
      status: 'needs_generation',
      trade: formData.field,
      details: formData 
    }]);

    setLoading(false);
    
    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      router.push('/dashboard?upgrade=pending');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-6 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 inline-block">
          ← Back to Dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          
          <div className="mb-8">
            <span className="bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md mb-4 inline-block">
              Premium Unlocked
            </span>
            <h1 className="text-3xl font-black tracking-tight mb-2">Customize Your Premium Flyers</h1>
            <p className="text-slate-500 font-medium">
              We've pre-loaded your details. Add your website and extra services below. Our AI will seamlessly blend these directly into your high-end flyer artwork.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Name</label>
                <input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Trade / Niche</label>
                <input required type="text" name="field" value={formData.field} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:border-blue-600 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Website URL (Premium)</label>
                <input type="text" name="websiteUrl" placeholder="www.yourdomain.com" value={formData.websiteUrl} onChange={handleChange} className="w-full border-2 border-blue-200 bg-blue-50 rounded-xl px-4 py-3 font-bold text-blue-900 focus:border-blue-600 outline-none transition-colors" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Core Services</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="service1" value={formData.service1} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 font-medium text-slate-900" />
                <input type="text" name="service2" value={formData.service2} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 font-medium text-slate-900" />
                <input type="text" name="service3" value={formData.service3} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 font-medium text-slate-900" />
                <input type="text" name="service4" value={formData.service4} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 font-medium text-slate-900" />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">Bonus Services (Premium)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="service5" placeholder="Bonus Service 1" value={formData.service5} onChange={handleChange} className="w-full border-2 border-blue-200 bg-blue-50 rounded-xl px-4 py-2 font-medium text-blue-900" />
                <input type="text" name="service6" placeholder="Bonus Service 2" value={formData.service6} onChange={handleChange} className="w-full border-2 border-blue-200 bg-blue-50 rounded-xl px-4 py-2 font-medium text-blue-900" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-blue-600 text-white font-black text-lg py-5 rounded-xl shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Submitting to Generation Engine...' : 'Generate Premium Flyers'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
