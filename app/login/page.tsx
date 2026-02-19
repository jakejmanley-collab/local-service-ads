'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Success! Check your email for the confirmation link.');
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push('/dashboard');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6 flex justify-center items-center">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="you@email.com" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none" 
              placeholder="••••••••" 
              required
            />
          </div>

          {message && (
            <div className="text-sm font-semibold text-center text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
              {message}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              Sign In
            </button>
            <button 
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-white text-slate-900 border border-slate-300 font-bold py-3 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
