'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | undefined>('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setUserEmail(session.user.email);
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-slate-500 font-bold animate-pulse">Loading Dashboard...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Logged in as {userEmail}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-300 px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Current Plan</h3>
            <div className="text-2xl font-bold text-slate-900 mb-4">Free Preview</div>
            <Link href="/#pricing" className="text-blue-600 font-semibold hover:underline">Upgrade Plan &rarr;</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Saved Flyers</h3>
            <div className="text-2xl font-bold text-slate-900 mb-4">4 Watermarked</div>
            <Link href="/preview" className="text-blue-600 font-semibold hover:underline">View Flyers &rarr;</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Websites Active</h3>
            <div className="text-2xl font-bold text-slate-900 mb-4">0</div>
            <Link href="/#pricing" className="text-blue-600 font-semibold hover:underline">Build SEO Site &rarr;</Link>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600">
                <th className="p-4">Project Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-800 text-sm">
              <tr className="border-b border-slate-100">
                <td className="p-4 font-semibold">Apex Plumbing Promo</td>
                <td className="p-4">Flyer Template</td>
                <td className="p-4">Today</td>
                <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-bold">Watermarked</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
