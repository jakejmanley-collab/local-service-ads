export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Complete Your Upgrade</h1>
          <div className="bg-blue-600 p-8 rounded-xl shadow-sm text-white mb-6">
            <div className="text-blue-200 font-bold text-sm uppercase tracking-wider mb-1">Selected Plan</div>
            <h2 className="text-3xl font-bold mb-4">Growth Package</h2>
            <div className="text-4xl font-extrabold mb-6">$99<span className="text-lg font-normal opacity-80">/mo</span></div>
            <ul className="space-y-2 text-blue-50">
              <li>✓ Unwatermarked Commercial Flyers</li>
              <li>✓ AI Ad Text Generator Access</li>
              <li>✓ Custom Single-Page Website</li>
              <li>✓ Lead capture contact form</li>
            </ul>
          </div>
        </div>

        {/* Payment Form (Mock) */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Payment Details</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Card Information</label>
              <div className="border border-slate-300 rounded-lg flex overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
                <input type="text" required className="w-full px-4 py-2 outline-none border-r border-slate-300" placeholder="Card number" />
                <input type="text" required className="w-24 px-4 py-2 outline-none border-r border-slate-300" placeholder="MM/YY" />
                <input type="text" required className="w-20 px-4 py-2 outline-none" placeholder="CVC" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg mt-4 hover:bg-slate-800 transition">
              Pay $99 & Subscribe
            </button>
            <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
              🔒 Secure checkout processed by Stripe
            </p>
          </form>
        </div>

      </div>
    </main>
  );
}
