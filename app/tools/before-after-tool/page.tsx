"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Upload, X } from "lucide-react";

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgAspect = img.width / img.height;
  const targetAspect = w / h;
  let sx, sy, sw, sh;
  if (imgAspect > targetAspect) {
    sh = img.height;
    sw = img.height * targetAspect;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / targetAspect;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function BeforeAfterToolPage() {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [beforeDragging, setBeforeDragging] = useState(false);
  const [afterDragging, setAfterDragging] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File, side: "before" | "after") => {
      const url = URL.createObjectURL(file);
      if (side === "before") {
        setBeforeFile(file);
        setBeforePreview(url);
      } else {
        setAfterFile(file);
        setAfterPreview(url);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, side: "before" | "after") => {
      e.preventDefault();
      if (side === "before") setBeforeDragging(false);
      else setAfterDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file, side);
      }
    },
    [handleFileSelect]
  );

  const removeImage = useCallback((side: "before" | "after") => {
    if (side === "before") {
      setBeforeFile(null);
      setBeforePreview(null);
      if (beforeInputRef.current) beforeInputRef.current.value = "";
    } else {
      setAfterFile(null);
      setAfterPreview(null);
      if (afterInputRef.current) afterInputRef.current.value = "";
    }
    setResultDataUrl(null);
  }, []);

  const handleGenerate = async () => {
    if (!beforeFile || !afterFile) return;
    setGenerating(true);
    setResultDataUrl(null);

    try {
      const [beforeImg, afterImg] = await Promise.all([
        loadImage(beforeFile),
        loadImage(afterFile),
      ]);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const CANVAS_SIZE = 1080;
      const HALF = CANVAS_SIZE / 2;
      const hasBanner = businessName.trim() || phone.trim();
      const BANNER_HEIGHT = hasBanner ? 80 : 0;

      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;

      // Draw before (left half)
      drawImageCover(ctx, beforeImg, 0, 0, HALF, CANVAS_SIZE);

      // Draw after (right half)
      drawImageCover(ctx, afterImg, HALF, 0, HALF, CANVAS_SIZE);

      // White center divider
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(HALF - 2, 0, 4, CANVAS_SIZE);

      // Bottom banner
      if (hasBanner) {
        ctx.fillStyle = "rgba(20, 20, 20, 0.92)";
        ctx.fillRect(0, CANVAS_SIZE - BANNER_HEIGHT, CANVAS_SIZE, BANNER_HEIGHT);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const bannerY = CANVAS_SIZE - BANNER_HEIGHT / 2;
        const parts = [businessName.trim(), phone.trim()].filter(Boolean);
        const bannerText = parts.join("  |  ");

        ctx.font = "bold 32px sans-serif";
        ctx.fillText(bannerText, CANVAS_SIZE / 2, bannerY);
      }

      // BEFORE / AFTER labels
      ctx.font = "bold 52px sans-serif";
      ctx.textBaseline = "alphabetic";

      const LABEL_BOTTOM_MARGIN = 24;
      const LABEL_SIDE_MARGIN = 24;
      const LABEL_PAD_H = 12;
      const LABEL_PAD_V = 8;

      const labelBaseY = CANVAS_SIZE - BANNER_HEIGHT - LABEL_BOTTOM_MARGIN;

      // Measure text
      const beforeMetrics = ctx.measureText("BEFORE");
      const afterMetrics = ctx.measureText("AFTER");
      const textHeight = 52; // approx font size

      // BEFORE label (bottom-left)
      const beforeTextW = beforeMetrics.width;
      const beforeRectX = LABEL_SIDE_MARGIN;
      const beforeRectY = labelBaseY - textHeight - LABEL_PAD_V;
      const beforeRectW = beforeTextW + LABEL_PAD_H * 2;
      const beforeRectH = textHeight + LABEL_PAD_V * 2;

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(beforeRectX, beforeRectY, beforeRectW, beforeRectH);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(
        "BEFORE",
        beforeRectX + LABEL_PAD_H,
        labelBaseY - LABEL_PAD_V
      );

      // AFTER label (bottom-right)
      const afterTextW = afterMetrics.width;
      const afterRectW = afterTextW + LABEL_PAD_H * 2;
      const afterRectX = CANVAS_SIZE - LABEL_SIDE_MARGIN - afterRectW;
      const afterRectY = labelBaseY - textHeight - LABEL_PAD_V;
      const afterRectH = textHeight + LABEL_PAD_V * 2;

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(afterRectX, afterRectY, afterRectW, afterRectH);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(
        "AFTER",
        afterRectX + LABEL_PAD_H,
        labelBaseY - LABEL_PAD_V
      );

      const dataUrl = canvas.toDataURL("image/png");
      setResultDataUrl(dataUrl);
    } catch {
      // silently fail — user can try again
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "before-after.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (!leadSubmitted) {
        setShowLeadCapture(true);
      }
    }, "image/png");
  };

  const handleLeadSubmit = async () => {
    if (!leadEmail.includes("@")) return;
    setLeadLoading(true);
    try {
      await fetch("/api/tools/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, tool: "before-after-tool" }),
      });
    } catch {
      // fail silently
    } finally {
      setLeadLoading(false);
      setLeadSubmitted(true);
      setShowLeadCapture(false);
    }
  };

  const canGenerate = !!beforeFile && !!afterFile && !generating;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Hero */}
      <section className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Before &amp; After Image Maker
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Upload two photos and instantly get a polished 1080&times;1080
            before/after image — ready for Facebook Marketplace with your
            branding baked in.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {/* Upload zones */}
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {/* Before */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Before Photo <span className="text-amber-400">*</span>
              </label>
              <div
                className={`relative rounded-xl border-2 border-dashed transition-colors ${
                  beforeDragging
                    ? "border-amber-400 bg-amber-400/5"
                    : beforePreview
                    ? "border-zinc-700 bg-zinc-800"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                } cursor-pointer`}
                style={{ minHeight: "180px" }}
                onClick={() => !beforePreview && beforeInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setBeforeDragging(true);
                }}
                onDragLeave={() => setBeforeDragging(false)}
                onDrop={(e) => handleDrop(e, "before")}
              >
                {beforePreview ? (
                  <div className="relative w-full h-full" style={{ minHeight: "180px" }}>
                    <img
                      src={beforePreview}
                      alt="Before preview"
                      className="w-full h-full object-cover rounded-xl"
                      style={{ minHeight: "180px", maxHeight: "240px" }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage("before");
                      }}
                      className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-zinc-900 text-white rounded-full p-1 transition-colors"
                      aria-label="Remove before image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
                    <Upload className="w-8 h-8 text-zinc-500" />
                    <p className="text-zinc-400 text-sm font-medium">
                      Click or drag &amp; drop
                    </p>
                    <p className="text-zinc-600 text-xs">Before photo</p>
                  </div>
                )}
                <input
                  ref={beforeInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, "before");
                  }}
                />
              </div>
            </div>

            {/* After */}
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                After Photo <span className="text-amber-400">*</span>
              </label>
              <div
                className={`relative rounded-xl border-2 border-dashed transition-colors ${
                  afterDragging
                    ? "border-amber-400 bg-amber-400/5"
                    : afterPreview
                    ? "border-zinc-700 bg-zinc-800"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                } cursor-pointer`}
                style={{ minHeight: "180px" }}
                onClick={() => !afterPreview && afterInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setAfterDragging(true);
                }}
                onDragLeave={() => setAfterDragging(false)}
                onDrop={(e) => handleDrop(e, "after")}
              >
                {afterPreview ? (
                  <div className="relative w-full h-full" style={{ minHeight: "180px" }}>
                    <img
                      src={afterPreview}
                      alt="After preview"
                      className="w-full h-full object-cover rounded-xl"
                      style={{ minHeight: "180px", maxHeight: "240px" }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage("after");
                      }}
                      className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-zinc-900 text-white rounded-full p-1 transition-colors"
                      aria-label="Remove after image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
                    <Upload className="w-8 h-8 text-zinc-500" />
                    <p className="text-zinc-400 text-sm font-medium">
                      Click or drag &amp; drop
                    </p>
                    <p className="text-zinc-600 text-xs">After photo</p>
                  </div>
                )}
                <input
                  ref={afterInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, "after");
                  }}
                />
              </div>
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid sm:grid-cols-2 gap-5 mb-7">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Business Name{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Johnson Plumbing"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Phone Number{" "}
                <span className="text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. (615) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-900 font-bold text-base py-4 rounded-xl transition-colors duration-150"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Generating…
              </span>
            ) : (
              "Generate Image →"
            )}
          </button>
        </div>

        {/* Result */}
        {resultDataUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Image</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex justify-center mb-5">
                <img
                  src={resultDataUrl}
                  alt="Generated before and after"
                  className="rounded-xl max-w-full"
                  style={{ maxWidth: "500px", width: "100%" }}
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold py-3.5 rounded-xl text-sm transition-colors"
              >
                Download Image (1080×1080 PNG)
              </button>
            </div>

            {/* Lead capture modal */}
            {showLeadCapture && (
              <div className="mt-6 bg-zinc-900 border border-amber-400/40 rounded-2xl px-6 py-5">
                <p className="text-white font-semibold mb-1">
                  Want us to let you know when we add new free tools?
                </p>
                <div className="flex gap-2 mt-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <button
                    onClick={handleLeadSubmit}
                    disabled={leadLoading || !leadEmail.includes("@")}
                    className="bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-900 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
                  >
                    {leadLoading ? "Sending…" : "Yes, keep me posted"}
                  </button>
                </div>
                <button
                  onClick={() => setShowLeadCapture(false)}
                  className="mt-3 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  No thanks
                </button>
              </div>
            )}

            {leadSubmitted && (
              <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-center">
                <p className="text-zinc-300 text-sm">
                  Got it — check your inbox soon.
                </p>
              </div>
            )}

            {/* Upsell */}
            <div className="mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
              <p className="text-amber-300 font-semibold mb-1">
                Turn your best before &amp; after into a customer magnet.
              </p>
              <p className="text-zinc-400 text-sm mb-4">
                A website showcases your work 24/7 — so customers find you from
                Google, not just scrolling Facebook.
              </p>
              <Link
                href="/upgrade-offer"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                See how it works &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Upsell shown before generation too */}
        {!resultDataUrl && (
          <div className="mt-8 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-6 py-5 text-center">
            <p className="text-amber-300 font-semibold mb-1">
              Turn your best before &amp; after into a customer magnet.
            </p>
            <p className="text-zinc-400 text-sm mb-4">
              A website showcases your work 24/7 — so customers find you from
              Google, not just scrolling Facebook.
            </p>
            <Link
              href="/upgrade-offer"
              className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              See how it works &rarr;
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
