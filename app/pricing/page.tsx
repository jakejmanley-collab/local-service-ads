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
      name: 'Pro',
      price: '$19',
      description: 'Designed for local pros ready to dominate their service area.',
      features: [
        'Priority AI Writing', 
        'Custom Branding for Flyers', 
        'Competitor Ad Analysis', 
        'Priority Email Support'
      ],
      cta: 'Go Pro Now',
      href: '/upgrade-offer', 
      highlight: true
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">
          Start for free to test the waters, upgrade when your schedule gets packed. No hidden fees.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
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
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-full">
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
              <p className="text-slate-600 mb-8 h-12">
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
      </div>
    </main>
  );
}
