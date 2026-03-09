import Link from 'next/link';

export const metadata = {
  title: 'Pricing | Aretifi',
  description: 'Fair, honest pricing for local tradespeople looking to grow their business.',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for making your first few ad flyers.',
      features: [
        'Make unlimited flyers',
        'Basic ad text templates'
      ],
      cta: 'Start for Free',
      href: '/preview',
      highlight: false
    },
    {
      name: 'Verified Pro',
      price: '$9',
      description: 'Your own professional webpage hosted on our trades network.',
      features: [
        'Your own webpage on the Aretifi network',
        'We write your business bio',
        'Logo & colors for flyers',
        'Standard email support'
      ],
      cta: 'Get Listed Now',
      href: '/upgrade-offer', 
      highlight: true
    },
    {
      name: 'Pro Plus',
      price: '$29',
      description: 'Get more jobs with priority access and support.',
      features: [
        'Webpage hosted on unique URL',
        '20 page website',
        'Get found on Google!',
        'Priority customer support'
      ],
      cta: 'Get Pro Plus',
      href: '/upgrade-offer', 
      highlight: false
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 italic underline decoration-blue-500 underline-offset-8">
          Fair pricing for the working pro.
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
          Upgrade when just one extra job pays for your entire year. No hidden fees, no long-term contracts.
        </p>

        {/* STATS ROW - Synced with Homepage Icons */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-700 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Business flyers increase conversions by 34%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700 shadow-sm">
              {/* Sparkles/AI Icon for Optimized Text */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"></path></svg>
            </div>
            <span className="font-bold text-slate-700 text-sm">Optimized text increases sales by 30%</span>
          </div>
        </div>

        {/* Pricing Cards */}
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
              
              <h2 className="text-2xl font-semibold mb-2 italic">{tier.name}</h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              
              <p className="text-slate-600 mb-8 min-h-[3rem]">
                {tier.description}
              </p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start text-slate-700 font-medium">
                    <span className="mr-3 text-blue-500 font-bold">✓</span> 
                    <span className={f.includes('Google') || f.includes('unique URL') ? 'font-bold text-blue-600' : ''}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={tier.href} 
                className={`block w-full py-4 rounded-xl font-bold text-center transition-colors ${
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
