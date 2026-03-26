'use client';

import { useState, useRef, useEffect } from 'react';

type Step = 1 | 2 | 3 | 4;
type Format = 'short' | 'long';

interface Captions {
  youtube: string;
  tiktok: string;
  instagram: string;
}

interface Article {
  slug: string;
  title: string;
}

export default function VideoStudioPage() {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<Format>('short');

  // Step 2
  const [script, setScript] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [captions, setCaptions] = useState<Captions>({ youtube: '', tiktok: '', instagram: '' });

  // Step 3
  const [audioBase64, setAudioBase64] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Step 4
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [copiedKey, setCopiedKey] = useState('');

  const wordCount = script.split(/\s+/).filter(Boolean).length;

  // Load articles when reaching step 4
  useEffect(() => {
    if (step === 4 && articles.length === 0) {
      fetchArticles();
    }
  }, [step]);

  const handleAuth = () => {
    if (!passcode.trim()) {
      setAuthError('Please enter a passcode.');
      return;
    }
    // We verify server-side on first API call; do a quick format check here
    setAuthenticated(true);
    setAuthError('');
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/save-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, fetchArticles: true, slug: '__list__' }),
      });
      // The save-video endpoint won't handle a list fetch — we use a separate fetch approach
      // Instead call Supabase public route or a dedicated list endpoint
    } catch {
      // Fallback: fetch articles via the public seo_articles query
    }

    // Use the public Supabase anon key to fetch article list for the dropdown
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnon) return;

      const res = await fetch(
        `${supabaseUrl}/rest/v1/seo_articles?select=slug,title&site_tag=eq.aretifi&order=title.asc`,
        {
          headers: {
            apikey: supabaseAnon,
            Authorization: `Bearer ${supabaseAnon}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setArticles(data || []);
        if (data && data.length > 0) setSelectedSlug(data[0].slug);
      }
    } catch (e) {
      console.error('Failed to load articles', e);
    }
  };

  const generateScript = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, format, passcode }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Script generation failed');
      }
      const data = await res.json();
      setScript(data.script);
      setEstimatedDuration(data.estimatedDuration);
      setCaptions(data.captions);
      setStep(2);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const generateVoiceover = async () => {
    if (!script.trim()) {
      setError('Script is empty.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/generate-voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, passcode }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Voiceover generation failed');
      }
      const data = await res.json();
      setAudioBase64(data.audioBase64);
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveVideo = async () => {
    if (!selectedSlug) {
      setError('Please select a guide page.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/save-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedSlug,
          youtubeUrl,
          tiktokUrl,
          instagramUrl,
          passcode,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }
      setSaveSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = `data:audio/mpeg;base64,${audioBase64}`;
    link.download = 'voiceover.mp3';
    link.click();
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const steps = [
    { num: 1, label: 'Topic' },
    { num: 2, label: 'Script' },
    { num: 3, label: 'Voiceover' },
    { num: 4, label: 'Done' },
  ];

  // Auth gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-2">Video Studio</h1>
          <p className="text-gray-400 text-sm mb-6">Enter admin passcode to continue</p>
          <input
            type="password"
            placeholder="Admin passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-indigo-500"
          />
          {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white">Video Studio</h1>
          <p className="text-gray-400 mt-1 text-sm">AI-powered video content workflow</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-10 gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <button
                onClick={() => step > s.num && setStep(s.num as Step)}
                className={`flex items-center gap-2 group ${step > s.num ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    step === s.num
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-900'
                      : step > s.num
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    step === s.num ? 'text-white' : step > s.num ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${step > s.num ? 'bg-green-600' : 'bg-gray-700'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-900/40 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Step 1 — Topic */}
        {step === 1 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">What is this video about?</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Video topic</label>
              <input
                type="text"
                placeholder="e.g. How to write a Facebook Marketplace listing that gets more calls"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && generateScript()}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Target platform style</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormat('short')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    format === 'short'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Short-form vertical
                  <span className="block text-xs font-normal mt-0.5 opacity-70">TikTok / Reels / Shorts</span>
                </button>
                <button
                  onClick={() => setFormat('long')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    format === 'long'
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Long-form
                  <span className="block text-xs font-normal mt-0.5 opacity-70">YouTube</span>
                </button>
              </div>
            </div>
            <button
              onClick={generateScript}
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-colors"
            >
              {loading ? 'Generating Script...' : 'Generate Script →'}
            </button>
          </div>
        )}

        {/* Step 2 — Script */}
        {step === 2 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Review & Edit Script</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Voiceover script</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={16}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-mono text-sm leading-relaxed resize-y"
              />
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <span>
                <span className="text-white font-semibold">{wordCount}</span> words
              </span>
              <span>
                Estimated duration:{' '}
                <span className="text-white font-semibold">{formatDuration(Math.round((wordCount / 130) * 60))}</span>
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-none bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={generateVoiceover}
                disabled={loading || !script.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-colors"
              >
                {loading ? 'Generating Voiceover...' : 'Generate Voiceover →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Voiceover */}
        {step === 3 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Voiceover Preview</h2>

            {/* Audio Player */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <audio
                ref={audioRef}
                controls
                src={`data:audio/mpeg;base64,${audioBase64}`}
                className="w-full"
              />
              <button
                onClick={downloadAudio}
                className="mt-3 w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Download MP3
              </button>
            </div>

            {/* Platform Captions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Platform Captions</h3>

              {/* YouTube */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-red-400">YouTube</span>
                  <button
                    onClick={() => copyToClipboard(captions.youtube, 'youtube')}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedKey === 'youtube' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">{captions.youtube}</pre>
              </div>

              {/* TikTok */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-pink-400">TikTok</span>
                  <button
                    onClick={() => copyToClipboard(captions.tiktok, 'tiktok')}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedKey === 'tiktok' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">{captions.tiktok}</pre>
              </div>

              {/* Instagram */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-400">Instagram</span>
                  <button
                    onClick={() => copyToClipboard(captions.instagram, 'instagram')}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedKey === 'instagram' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">{captions.instagram}</pre>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-none bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Done — I&apos;ll record and upload the video →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Upload & Embed</h2>

            <div className="bg-indigo-950 border border-indigo-800 rounded-xl p-4 text-sm text-indigo-200 leading-relaxed">
              <strong className="text-indigo-100">Next steps:</strong> Record your screen while playing the voiceover,
              then upload the video to YouTube, TikTok, and Instagram. Paste the URLs below to embed the video on a
              guide page.
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">YouTube URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">TikTok URL</label>
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@..."
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Embed video on guide page</label>
                {articles.length === 0 ? (
                  <div className="text-gray-500 text-sm py-3">Loading guide pages...</div>
                ) : (
                  <select
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">— Select a guide page —</option>
                    {articles.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.title} ({a.slug})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {saveSuccess && (
              <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-xl px-4 py-3 text-sm">
                Saved successfully! The video is now embedded on the guide page.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-none bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={saveVideo}
                disabled={loading || !selectedSlug}
                className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-colors"
              >
                {loading ? 'Saving...' : 'Save & Embed on Guide Page →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
