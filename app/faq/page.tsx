export default function FAQPage() {
  const faqs = [
    {
      q: "Are the flyers actually editable?",
      a: "Yes. We use a hybrid layered workflow. The complex graphic backgrounds (textures, cuts, shadows) are high-end static images, while all text and specific photos (like your face or truck) are layered dynamically on top. This ensures a premium commercial look while remaining 100% editable."
    },
    {
      q: "Does the AI Ad writer work for both Kijiji and Facebook?",
      a: "Absolutely. Our ad generator is trained on the specific formatting structures that perform best on local marketplace algorithms, focusing on local SEO keywords and clear value propositions."
    },
    {
      q: "What is included in the 20-page SEO Website package?",
      a: "The Professional tier includes a programmatic SEO build. We create dedicated landing pages for specific services tied to specific local cities (e.g., 'Emergency Plumber in Toronto', 'Drain Cleaning in Mississauga') to capture high-intent Google search traffic outside of marketplace apps."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. You can manage, downgrade, or cancel your subscription directly from your user dashboard with one click."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
