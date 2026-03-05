import Link from 'next/link';

export default function PremiumSuccess() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-200">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4">Order Received!</h1>
        
        <p className="text-slate-600 mb-8 font-medium leading-relaxed">
          Thank you for your order. Our design team is currently reviewing your preferences and processing your premium flyers. 
          <br /><br />
          <strong className="text-slate-900">You will receive an email with your 5 high-resolution flyer variations within the next 48 hours.</strong>
        </p>

        <Link href="/dashboard" className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}
