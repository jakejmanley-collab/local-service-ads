export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter border-b-8 border-black pb-4 mb-8">Privacy Policy</h1>
        <p className="text-sm font-bold text-slate-500 uppercase">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">1. Information We Collect</h2>
          <p className="font-medium text-slate-700">
            We collect information you provide directly to us when you create an account, generate marketing assets, or purchase a subscription. This includes your name, email address, business name, phone number, and trade details. Payment processing information is handled securely by our third-party payment processors (e.g., Stripe) and is not stored directly on our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">2. How We Use Your Information</h2>
          <p className="font-medium text-slate-700">
            We use the information we collect to operate, maintain, and provide the features of the Service. This includes generating personalized AI flyers, processing transactions, hosting your SEO websites, and sending you technical notices or promotional offers related to Aretifi.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">3. Data Sharing and Third Parties</h2>
          <p className="font-medium text-slate-700">
            We do not sell your personal data to third parties. We may share your information with trusted third-party service providers (such as hosting providers and AI API endpoints) strictly for the purpose of fulfilling the Service operations. Your business details may be transmitted to AI language models to generate your customized ad copy and background images.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">4. Data Security and Retention</h2>
          <p className="font-medium text-slate-700">
            We implement reasonable security measures to protect your personal information. Your account data and generated assets are stored as long as your account remains active. You may request the deletion of your account and associated data at any time by contacting our support team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">5. Cookies and Tracking</h2>
          <p className="font-medium text-slate-700">
            Aretifi uses cookies and similar local storage technologies (such as saving your generator inputs to your browser's Local Storage) to improve user experience, maintain your session, and track aggregate site usage data.
          </p>
        </section>
      </div>
    </main>
  );
}
