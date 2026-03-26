import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'See What You Get | Aretifi',
  description:
    'Real examples of what your business gets with Aretifi — professional websites and print-ready flyers for tradespeople. See the Clearwater Plumbing demo.',
};

// ─── Browser Frame Wrapper ───────────────────────────────────────────────────
function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
      {/* Chrome bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-slate-500 font-mono border border-slate-200 flex items-center gap-2">
          <svg className="w-3 h-3 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          {url}
        </div>
      </div>
      {/* Page content */}
      <div className="overflow-hidden max-h-[520px] overflow-y-auto">{children}</div>
    </div>
  );
}

// ─── Site Mockup (shared by Starter + Pro) ───────────────────────────────────
function SiteMockup({ domain }: { domain: string }) {
  return (
    <div className="font-sans text-sm bg-white min-h-[500px]">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-blue-700 text-xs font-black">CP</span>
          </div>
          <span className="font-bold text-base tracking-wide">Clearwater Plumbing</span>
        </div>
        <nav className="hidden md:flex gap-5 text-sm font-medium">
          <a className="hover:underline">Home</a>
          <a className="hover:underline">Services</a>
          <a className="hover:underline">About</a>
          <a className="hover:underline">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <div
        className="relative text-white text-center py-12 px-6"
        style={{ backgroundImage: 'url(/showcase/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-blue-900/80" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-2">
            Serving Nashville &amp; Surrounding Areas
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
            Nashville&apos;s Trusted Plumber<br />— Available 24/7
          </h1>
          <p className="text-blue-100 text-sm mb-6 max-w-sm mx-auto">
            Fast, reliable plumbing repairs and installations. Licensed, insured, and
            ready when you need us most.
          </p>
          <button className="bg-yellow-400 text-blue-900 font-bold px-6 py-2.5 rounded-lg text-sm shadow hover:bg-yellow-300 transition-colors">
            Get a Free Quote
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="py-8 px-6 bg-slate-50">
        <h2 className="text-center text-base font-bold text-slate-800 mb-6 uppercase tracking-wide">
          Our Services
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { img: '/showcase/drain-cleaning.jpg', icon: '🚿', title: 'Drain Cleaning', desc: 'Fast, mess-free drain clearing for any clog.' },
            { img: '/showcase/water-heater.jpg', icon: '🔥', title: 'Water Heater Install', desc: 'Tank and tankless installations in one day.' },
            { img: '/showcase/emergency-repair.jpg', icon: '🚨', title: 'Emergency Repairs', desc: '24/7 response — we answer every call.' },
          ].map((s) => (
            <div key={s.title} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 text-center">
              <img src={s.img} alt={s.title} className="w-full h-20 object-cover" />
              <div className="p-3">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-semibold text-slate-800 text-xs mb-1">{s.title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-blue-600 text-white py-4 px-6 flex justify-around text-center text-xs">
        <div>
          <div className="font-extrabold text-lg">12+</div>
          <div className="text-blue-200">Years in Business</div>
        </div>
        <div>
          <div className="font-extrabold text-lg">2,400+</div>
          <div className="text-blue-200">Jobs Completed</div>
        </div>
        <div>
          <div className="font-extrabold text-lg">4.9 ★</div>
          <div className="text-blue-200">Google Rating</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 px-6 py-6 text-xs">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <div className="text-white font-bold mb-1">Clearwater Plumbing</div>
            <div>📞 (615) 555-0142</div>
            <div>📍 123 Maple Ave, Nashville, TN 37201</div>
          </div>
          <div>
            <div className="text-white font-bold mb-1">Hours</div>
            <div>Mon–Fri: 7am – 7pm</div>
            <div>Sat–Sun: 8am – 5pm</div>
            <div className="text-yellow-400 font-semibold mt-1">24/7 Emergency Service</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 text-slate-500 text-center">
          © 2025 Clearwater Plumbing · {domain}
        </div>
      </footer>
    </div>
  );
}

// ─── Pro Site Mockup ─────────────────────────────────────────────────────────
function ProSiteMockup() {
  return <SiteMockup domain="clearwaterplumbing.com" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShowcasePage() {
  const proPages = [
    'Home', 'About Us', 'Contact', 'Emergency Plumbing', 'Drain Cleaning',
    'Water Heater Installation', 'Pipe Repair', 'Bathroom Plumbing',
    'Kitchen Plumbing', 'Sewer Line Services', 'Leak Detection', 'Garbage Disposal',
    'Sump Pump', 'Repiping Services', 'Tankless Water Heaters', 'Commercial Plumbing',
    'Service Areas', 'Reviews', 'Free Quote', 'Blog',
  ];

  return (
    <div className="bg-white text-slate-900 font-sans">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-900 to-blue-950 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Live Demo
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
            See Exactly What You Get
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real examples from our demo business —{' '}
            <span className="text-white font-semibold">Clearwater Plumbing</span>. This is
            what your business could look like by next week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upgrade-offer"
              className="bg-yellow-400 text-blue-900 font-extrabold px-8 py-4 rounded-xl text-base shadow-xl hover:bg-yellow-300 transition-colors"
            >
              Get Started — $9/mo
            </Link>
            <Link
              href="/upgrade-offer"
              className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors"
            >
              See All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. STARTER ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          {/* Label */}
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Starter — $9/month
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
            A professional website on a domain<br className="hidden md:block" /> built for tradespeople
          </h2>
          <p className="text-slate-500 mb-5 text-base">
            Your business gets a page on our established contractor network. Live in 48 hours.
          </p>

          {/* URL pill */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-mono text-slate-600">plumbersworld.com/clearwaterplumbing</span>
          </div>

          {/* Browser mockup */}
          <div className="mb-10">
            <BrowserFrame url="plumbersworld.com/clearwaterplumbing">
              <SiteMockup domain="plumbersworld.com/clearwaterplumbing" />
            </BrowserFrame>
          </div>

          {/* Included */}
          <ul className="space-y-3 mb-8 max-w-md">
            {[
              'Professional design tailored to your trade',
              'Mobile-friendly — looks great on every screen',
              'Contact form included — customers reach you directly',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700 font-medium">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/upgrade-offer"
            className="inline-block bg-blue-600 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors text-base"
          >
            Get This for $9/mo →
          </Link>
        </div>
      </section>

      {/* ── 3. PRO ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Label */}
          <div className="mb-4">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Pro — $29/month
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
            Your own domain. 20 pages built<br className="hidden md:block" /> to rank on Google.
          </h2>
          <p className="text-slate-500 mb-5 text-base">
            Own your corner of the internet. Every service you offer gets its own
            SEO-optimized page.
          </p>

          {/* URL pill */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-mono text-slate-600">clearwaterplumbing.com</span>
          </div>

          {/* Browser mockup */}
          <div className="mb-10">
            <BrowserFrame url="clearwaterplumbing.com">
              <ProSiteMockup />
            </BrowserFrame>
          </div>

          {/* 20-page sitemap */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-600 text-white font-extrabold text-sm px-3 py-1 rounded-full">
                20 Pages Included
              </span>
              <span className="text-slate-500 text-sm">— every page is SEO-optimized</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {proPages.map((page, i) => (
                <div
                  key={page}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium text-center ${
                    i === 0
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {page}
                </div>
              ))}
            </div>
          </div>

          {/* Included */}
          <ul className="space-y-3 mb-8 max-w-md">
            {[
              'Custom domain included — yourname.com is yours',
              '20 SEO-optimized pages — one per service',
              'Google Business Profile setup guide included',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700 font-medium">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/upgrade-offer"
            className="inline-block bg-indigo-600 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors text-base"
          >
            Get This for $29/mo →
          </Link>
        </div>
      </section>

      {/* ── 4. FLYERS ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          {/* Label */}
          <div className="mb-4">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Premium Add-On — $25 flat fee
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
            Print-ready flyers that look like<br className="hidden md:block" /> you paid a designer $500
          </h2>
          <p className="text-slate-500 mb-10 text-base">
            AI-designed flyers, branded to your business, delivered as a print-ready PDF in 48 hours.
          </p>

          {/* Sample config badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-sm bg-blue-600 inline-block" />
              Layout: Square
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-red-600 inline-block" />
              Colors: Blue &amp; Red
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              🔧 Trade: Plumbing
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Custom layouts &amp; colors available
            </span>
          </div>

          {/* 3 real flyer images */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img src="/showcase/flyer-1.png" alt="Clearwater Plumbing flyer — square blue design" className="w-full h-auto" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img src="/showcase/flyer-2.png" alt="Clearwater Plumbing flyer — square red design" className="w-full h-auto" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img src="/showcase/flyer-3.png" alt="Clearwater Plumbing flyer — square blue and red design" className="w-full h-auto" />
            </div>
          </div>


          <p className="text-slate-500 text-sm mb-8 max-w-xl">
            Each flyer is designed by AI under expert guidance and delivered as a
            print-ready PDF within 48 hours. Ready to hand out, mail, or post anywhere.
          </p>

          <Link
            href="/upgrade-offer"
            className="inline-block bg-orange-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-colors text-base"
          >
            Order Your Flyers — $25 →
          </Link>
        </div>
      </section>

      {/* ── 5. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Ready to get started?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Pick your plan and have a professional online presence by next week.
            </p>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 text-slate-500 font-semibold border-b border-slate-200 w-1/3" />
                  <th className="py-4 px-4 border-b border-slate-200 text-center">
                    <div className="font-extrabold text-slate-900 text-base">Starter</div>
                    <div className="text-blue-600 font-bold">$9/mo</div>
                  </th>
                  <th className="pt-7 pb-4 px-4 border-b border-indigo-200 bg-indigo-50 rounded-t-xl text-center relative overflow-visible">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </div>
                    <div className="font-extrabold text-slate-900 text-base">Pro</div>
                    <div className="text-indigo-600 font-bold">$29/mo</div>
                  </th>
                  <th className="py-4 px-4 border-b border-slate-200 text-center">
                    <div className="font-extrabold text-slate-900 text-base">Flyers Add-On</div>
                    <div className="text-orange-500 font-bold">$25 flat</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Professional website', true, true, false],
                  ['Hosted on trades network', true, false, false],
                  ['Your own custom domain', false, true, false],
                  ['20 SEO-optimized pages', false, true, false],
                  ['Google Business Profile guide', false, true, false],
                  ['Contact form', true, true, false],
                  ['Mobile-friendly design', true, true, false],
                  ['3 print-ready flyer designs', false, false, true],
                  ['Delivered in 48 hours', false, false, true],
                  ['PDF ready to print & distribute', false, false, true],
                ].map(([label, starter, pro, flyer], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-3 px-4 text-slate-700 font-medium">{label as string}</td>
                    <td className="py-3 px-4 text-center">
                      {starter ? (
                        <span className="text-blue-600 font-bold text-base">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center bg-indigo-50/50">
                      {pro ? (
                        <span className="text-indigo-600 font-bold text-base">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {flyer ? (
                        <span className="text-orange-500 font-bold text-base">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Big CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl py-12 px-8 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Your business deserves a professional presence.
            </h3>
            <p className="text-blue-100 mb-8 text-base max-w-lg mx-auto">
              Join hundreds of tradespeople who already have websites and flyers working
              for them 24/7. Setup takes less than 10 minutes.
            </p>
            <Link
              href="/upgrade-offer"
              className="inline-block bg-yellow-400 text-blue-900 font-extrabold px-10 py-5 rounded-xl text-lg shadow-2xl hover:bg-yellow-300 transition-colors"
            >
              Get Started Now →
            </Link>
            <p className="text-blue-200 text-xs mt-4 font-medium">
              No contracts. Cancel anytime. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
