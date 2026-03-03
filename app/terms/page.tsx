export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 py-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter border-b-8 border-black pb-4 mb-8">Terms of Service</h1>
        <p className="text-sm font-bold text-slate-500 uppercase">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">1. Acceptance of Terms</h2>
          <p className="font-medium text-slate-700">
            By accessing and using Aretifi ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">2. Use of Generated Assets</h2>
          <p className="font-medium text-slate-700">
            Aretifi utilizes artificial intelligence to generate marketing copy and visual assets. Upon full payment of applicable fees (including one-time fees or active subscriptions), you are granted a non-exclusive, commercial license to use the generated flyers and ad copy for your own business marketing purposes. You may not resell the raw templates or offer access to the generation tool to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">3. Disclaimer of Warranties and Results</h2>
          <p className="font-medium text-slate-700">
            The Service is provided "as is". Aretifi does not guarantee specific financial results, lead generation metrics, or conversion rates from the use of our assets. We are not affiliated with, nor endorsed by, Facebook, Meta, Google, or any other third-party marketplace. You are solely responsible for ensuring your advertisements comply with the terms of service of any third-party platform you publish them on.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">4. Subscriptions and Payments</h2>
          <p className="font-medium text-slate-700">
            Certain features require a paid subscription. By providing a payment method, you authorize us to charge the applicable subscription fees on a recurring basis. You may cancel your subscription at any time through your dashboard; however, there are no refunds for partially used billing periods.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase">5. Limitation of Liability</h2>
          <p className="font-medium text-slate-700">
            In no event shall Aretifi or its operators be liable for any indirect, incidental, or consequential damages arising out of your use of the Service, including but not limited to suspended marketplace accounts, loss of revenue, or business interruption.
          </p>
        </section>
      </div>
    </main>
  );
}
