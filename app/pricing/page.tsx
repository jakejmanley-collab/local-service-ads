import Link from 'next/link';

export const metadata = {
  title: 'Pricing | Aretifi Studio',
  description: 'Simple, transparent pricing for local service business growth tools.',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting your first few Marketplace customers.',
      features: [
        'Unlimited Flyer Generations', 
        'Basic Ad Text Templates', 
        'Community Support'
      ],
      cta: 'Start for Free',
      href: '/preview',
      highlight: false
    },
    {
      name: 'Verified Pro',
      price: '$15',
      description: 'Your own professional webpage on the Aretifi network.',
      features: [
        'Verified Pro Webpage',
        'Priority AI Writing', 
        'Custom Branding for Flyers', 
        'Standard Email Support'
      ],
      cta: 'Go Verified',
      href: '/upgrade-offer', 
      highlight: true
    },
    {
      name: 'Pro Plus',
      price: '$49',
      description: 'Designed for local pros ready to dominate their service area.',
      features: [
        'Everything in Verified Pro',
        'Competitor Ad Analysis', 
        'Premium SEO Guides Access',
        '1-on-1 Priority Support'
      ],
      cta: 'Get Pro Plus',
      href: '/upgrade-offer', 
      highlight: false
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Header Section */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">
          Start for free to test the waters, upgrade when your schedule gets packed. No hidden fees.
        </p>

        {/* Pricing Cards Grid (Updated to 3 columns) */}
        <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
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
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              
              {/* Added min-height to keep all cards aligned perfectly */}
              <p className="text-slate-600 mb-8 min-h-[3rem]">
                {tier.description}
              </p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start text-slate-700">
                    <span className="mr-3 text-blue-500 font-bold">✓</span> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={tier.href} 
                className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-colors ${
                  tier.highlight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Annual Bonus Offer Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="text-left flex-1 relative z-10">
            <div className="inline-block bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm mb-4 shadow-sm">
              Annual Bonus Offer
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Unlock the Premium Flyer Tool
            </h3>
            <p className="text-slate-600 text-lg">
              Commit to a full year of <span className="font-semibold text-slate-900">Verified Pro</span> or <span className="font-semibold text-slate-900">Pro Plus</span> and get completely free, unlimited access to our Premium Flyer Generator (normally sold separately).
            </p>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto relative z-10">
            <Link 
              href="/upgrade-offer" 
              className="bg-slate-900 text-white font-semibold py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors shadow-md block text-center text-lg w-full md:w-auto"
            >
              View Annual Plans
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
