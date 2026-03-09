"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    industry: 'plumbing', // default value
    city: '',
    bullets: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In the next step, we will build this API route to trigger the AI and save to Supabase
      const response = await fetch('/api/setup/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sessionId // We pass this to verify they actually paid!
        }),
      });

      if (!response.ok) throw new Error('Failed to generate page');

      const data = await response.json();
      
      // Redirect them to their brand new live network page!
      router.push(`/pros/${data.slug}`);
      
    } catch (error) {
      console.error("Error building page:", error);
      alert("Something went wrong. Please try again or contact support.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Build Your Network Page</h2>
        <p className="text-slate-600">Tell us about your business, and our AI will instantly write and design your professional profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
            <input 
              type="text" 
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Bob's Plumbing"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Industry / Niche</label>
            <select 
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
            >
              <option value="plumbing">Plumbing</option>
              <option value="landscaping">Landscaping & Lawn Care</option>
              <option value="cleaning">Residential Cleaning</option>
              <option value="hvac">HVAC</option>
              <option value="roofing">Roofing</option>
              <option value="painting">Painting</option>
              <option value="other">Other Local Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Primary City</label>
            <input 
              type="text" 
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Austin, TX"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Why should people hire you?</label>
          <p className="text-xs text-slate-500 mb-2">List 2-3 quick bullet points (e.g., "10 years experience", "Family owned", "Free estimates"). Our AI will turn this into a professional bio.</p>
          <textarea 
            name="bullets"
            required
            rows={4}
            value={formData.bullets}
            onChange={handleChange}
            placeholder="- 15 years of experience&#10;- Fully licensed and insured&#10;- We clean up after every job"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-md flex justify-center items-center gap-2 ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating AI Page...
            </>
          ) : (
            'Publish My Page'
          )}
        </button>
      </form>
    </div>
  );
}

// We wrap the form in a Suspense boundary because useSearchParams can cause build issues in Next.js 14 if not suspended.
export default function SetupPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl">
        <Suspense fallback={<div className="text-center text-slate-500">Loading setup...</div>}>
          <SetupForm />
        </Suspense>
      </div>
    </main>
  );
}
