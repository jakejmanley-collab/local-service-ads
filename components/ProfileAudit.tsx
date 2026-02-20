'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProfileAudit() {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(0);

  const handleAnswer = (points: number) => {
    setScore(score + points);
    setStep(step + 1);
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
      <div className="bg-slate-900 p-4 text-white text-center">
        <span className="text-xs font-black uppercase tracking-widest">Free Business Diagnostic</span>
      </div>
      
      <div className="p-8 min-h-[400px] flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">1. The Thumbnail Test</h2>
            <p className="text-slate-600">When scrolling on Marketplace/Thumbtack, is your primary image a generic photo or a branded asset?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleAnswer(0)} className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">Just a photo</button>
              <button onClick={() => handleAnswer(20)} className="w-full py-4 border-2 border-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all">Branded with my logo/text</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">2. Mobile Legibility</h2>
            <p className="text-slate-600">Can a user read your phone number or main service without clicking the post?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleAnswer(0)} className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50">No, they have to click</button>
              <button onClick={() => handleAnswer(30)} className="w-full py-4 border-2 border-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white">Yes, it's clear and bold</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Your Audit Score</h2>
            <div className="text-6xl font-black text-slate-900 italic">{score}/100</div>
            <p className="text-slate-600">
              {score < 50 
                ? "Your profile is currently 'Invisible.' You are likely losing 60% of potential leads to competitors with better branding."
                : "You have a good foundation, but there is room to increase your conversion rate by 25%."}
            </p>
            <Link 
              href="/create" 
              className="inline-block w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-tighter hover:bg-blue-700 shadow-xl"
            >
              Fix My Profile with ARETIFI
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
