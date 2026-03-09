import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 italic">Simple, Honest Pricing.</h1>
        <p className="text-lg text-slate-600 mb-16">Upgrade when just one extra job pays for your entire year.</p>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          {/* Verified Pro */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold mb-4 italic text-blue-600 underline underline-offset-8 decoration-2">Verified Pro</h2>
            <p className="text-slate-600 text-lg mb-6">"Your own professional webpage hosted on our trades network."</p>
            <ul className="space-y-4 mb-8 text-slate-700 font-medium">
              <li className="flex items-center gap-3">✓ Your own webpage</li>
              <li className="flex items-center gap-3">✓ We write your business bio</li>
              <li className="flex items-center gap-3">✓ Logo & colors for your flyers</li>
              <li className="flex items-center gap-3">✓ Standard email support</li>
            </ul>
            <Link href="/upgrade-offer" className="mt-auto block w-full bg-blue-600 text-white py-4 rounded-2xl text-center font-bold text-xl shadow-lg">Start for $9/mo</Link>
          </div>

          {/* Pro Plus */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold mb-4 italic text-slate-900 underline underline-offset-8 decoration-2">Pro Plus</h2>
            <p className="text-slate-600 text-lg mb-6">"Get seen by more customers in more cities."</p>
            <ul className="space-y-4 mb-8 text-slate-700 font-medium">
              <li className="flex items-center gap-3 font-bold text-blue-600 underline underline-offset-4">✓ Everything in Verified Pro</li>
              <li className="flex items-center gap-3">✓ Show up in 3 extra cities</li>
              <li className="flex items-center gap-3">✓ Rank higher on directory pages</li>
              <li className="flex items-center gap-3">✓ Priority customer support</li>
            </ul>
            <Link href="/upgrade-offer" className="mt-auto block w-full bg-slate-900 text-white py-4 rounded-2xl text-center font-bold text-xl shadow-lg">Start for $29/mo</Link>
          </div>
        </div>

        {/* Savings Notice */}
        <div className="mt-20 p-8 bg-blue-50 rounded-3xl border-2 border-blue-200 inline-block">
          <p className="text-blue-900 font-bold text-lg">
            🎁 Need to save more? <Link href="/upgrade-offer" className="underline decoration-blue-400 hover:text-blue-600">Switch to a yearly plan</Link> to save over 20% and get the Premium Flyer Tool for free.
          </p>
        </div>
      </div>
    </main>
  );
}
