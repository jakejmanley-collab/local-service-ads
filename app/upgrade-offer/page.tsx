"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function UpgradeOfferPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: 'Verified Pro',
      monthlyPrice: '$9',
      annualPrice: '$86', 
      discountText: 'Regularly $108/yr. You save 20%.',
      description: 'Your own professional webpage hosted on our trades network.',
      features: [
        'Your own webpage on our network',
        'We write your business description for you', 
        'Add your logo and colors to your flyers', 
        'Standard email support',
        isAnnual ? '🎁 FREE Premium Flyer Tool' : 'Basic Flyer Tool'
      ],
      cta: 'Get Listed Now',
      monthlyLink: 'https://buy.stripe.com/4gM4gt5qH9lmh0Eey73gk04',
      annualLink: 'https://buy.stripe.com/fZuaERaL169afWAahR3gk05',
      highlight: true
    },
    {
      name: 'Pro Plus',
      monthlyPrice: '$29',
      annualPrice: '$261', 
      discountText: 'Regularly $348/yr. You save 25%.',
      description: 'Designed for local pros ready to dominate their service area.',
      features: [
        'Dedicated website on unique URL',
        '20 optimized pages to rank on Google', 
        'Show up in Google search results!',
        'Priority customer support',
        isAnnual ? '🎁 FREE Premium Flyer Tool' : 'Premium Flyer Tool ($99/yr value)' 
      ],
      cta: 'Get Pro Plus',
      monthlyLink: 'https://buy.stripe.com/28E3cp2ev41239O9dN3gk06',
      annualLink: 'https://buy.stripe.com/3cI9AN9GXcxybGk75F3gk07',
      highlight: false
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto text-center">
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
          Ready to look like a premium business?
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          Secure your spot on the network. Setup takes less than 5 minutes.
        </p>

        {/* The Monthly / Yearly Toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Monthly
          </span>
          
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-8 bg-blue-600 rounded-full p-1 flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Toggle annual billing"
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? 'translate-x-8' : ''}`} />
          </button>
          
          <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Yearly
            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
              Save over 20% + Bonus
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`bg-white rounded-3xl p-8 flex flex-col transition-all ${
                tier.highlight 
                  ? 'ring-2 ring-blue-600 shadow-xl relative md:-translate-y-2' 
                  : 'border border-slate-200 shadow-sm'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full w-max">
                  Most Popular
                </span>
              )}
              
              <h2 className="text-2xl font-semibold mb-2 text-slate-900">
                {tier.name}
              </h2>
              
              {/* Price Container */}
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-5xl font-bold text-slate-900">
                  {isAnnual ? tier.annualPrice : tier.monthlyPrice}
                </span>
                <span className="text-slate-500 font-medium">
                  {isAnnual ? '/yr' : '/mo'}
                </span>
              </div>

              {/* Explicit Discount Math */}
              <div className="min-h-[1.5rem] mt-1 mb-4">
                {isAnnual && (
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {tier.discountText}
                  </span>
                )}
              </div>
              
              <p className="text-slate-600 mb-8 min-h-[3rem]">
                {tier.description}
              </p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start text-slate-700">
                    <span className="mr-3 text-blue-500 font-bold">✓</span> 
                    <span className={f.includes('FREE') ? 'font-bold text-slate-900' : ''}>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={isAnnual ? tier.annualLink : tier.monthlyLink} 
                className={`block w-full py-4 rounded-xl font-bold text-lg text-center transition-colors ${
                  tier.highlight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
