import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { chromium } from 'playwright';
import { spawnSync, spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

// ── Resolve paths relative to project root ─────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output', 'videos');

// ── Validate env vars ───────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Missing env var: GEMINI_API_KEY (check .env.local)');
  process.exit(1);
}
if (!ELEVENLABS_API_KEY) {
  console.error('Missing env var: ELEVENLABS_API_KEY (check .env.local)');
  process.exit(1);
}

// ── Dev server helpers ───────────────────────────────────────────────────────
async function checkDevServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      res.destroy();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
  });
}

// Starts the Next.js dev server as a background child process and waits until
// it responds on port 3000. Returns the child process so we can kill it later.
async function startDevServer() {
  console.log('Starting dev server...');
  const child = spawn('npm', ['run', 'dev'], {
    cwd: ROOT,
    shell: true,
    stdio: 'ignore',
    detached: false,
  });
  child.on('error', (err) => { throw new Error('Failed to start dev server: ' + err.message); });

  // Poll until ready (up to 60 seconds)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (await checkDevServer()) {
      console.log('✓ Dev server ready\n');
      return child;
    }
  }
  child.kill();
  throw new Error('Dev server did not start within 60 seconds');
}

// ── Step 1: Generate voiceover script with Gemini ──────────────────────────
async function generateScript() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Write a voiceover script for a 37-second screen recording demo video. The script must be EXACTLY 80 words — no more, no less. Count carefully.

The video has these exact scenes with timings:
- 0–6s: Hero section visible with title "Contractor Ad Headline Generator" and stat cards
- 6–15s: Form shown filled in — Trade: Plumber, City: Nashville TN, Specialty: emergency drain cleaning
- 15–25s: 6 generated headlines visible on screen, one gets copied
- 25–37s: Upsell section about getting a contractor website at aretifi.com

Write the script so the words being spoken always match what is visible at that moment.

Requirements:
- Hook in the first 6 seconds about weak headlines losing jobs
- Mention "according to BrightLocal, 87% of customers read your listing before they ever call" while the form is visible (6–15s)
- Final line must be: "Try it free at aretify dot com slash tools" — spell it "aretify" (rhymes with wifi) so the voiceover pronounces it correctly
- Sound like one contractor talking to another — plain, direct, no corporate speak
- NO stage directions, NO asterisks, NO labels like "Scene 1" — spoken words only

Output only the script. Count the words before submitting.`;

  const result = await model.generateContent(prompt);
  const script = result.response.text().trim();
  return script;
}

// ── Step 2: Generate voiceover MP3 ─────────────────────────────────────────
// Uses OpenAI TTS by default (cheap, no monthly quota).
// Set VOICEOVER_PROVIDER=elevenlabs in .env.local to switch back to ElevenLabs
// once your credits reset.
async function generateVoiceover(script) {
  const voicePath = path.join(OUTPUT_DIR, 'voiceover.mp3');
  const provider = (process.env.VOICEOVER_PROVIDER || 'openai').toLowerCase();

  if (provider === 'elevenlabs') {
    // ── ElevenLabs (Will, turbo) ──────────────────────────────────────────
    const body = JSON.stringify({
      text: script,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.65,
        style: 0.25,
        use_speaker_boost: true,
      },
    });

    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.elevenlabs.io',
        path: '/v1/text-to-speech/EriO78T4EfqSgL0MRber',  // Will
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', (c) => (errBody += c));
          res.on('end', () => reject(new Error(`ElevenLabs API error ${res.statusCode}: ${errBody}`)));
          return;
        }
        const fileStream = fs.createWriteStream(voicePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(); });
        fileStream.on('error', reject);
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

  } else {
    // ── OpenAI TTS (onyx voice) — default ────────────────────────────────
    // ~$0.01 per script, no monthly quota, sounds natural for male voiceovers
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY in .env.local');

    const body = JSON.stringify({
      model: 'tts-1-hd',   // hd = higher quality, still cheap
      voice: 'onyx',       // deep, warm male voice — good for contractor demos
      input: script,
      speed: 0.95,         // slightly slower = clearer for how-to content
    });

    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.openai.com',
        path: '/v1/audio/speech',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', (c) => (errBody += c));
          res.on('end', () => reject(new Error(`OpenAI TTS error ${res.statusCode}: ${errBody}`)));
          return;
        }
        const fileStream = fs.createWriteStream(voicePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(); });
        fileStream.on('error', reject);
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  return voicePath;
}

// ── Shared screenshot capture helper ────────────────────────────────────────
// Uses screenshots instead of Playwright's built-in video recording.
// Playwright VP8 WebM has inconsistent timing metadata that causes FFmpeg to
// silently drop the audio track. PNG frames have zero codec issues — FFmpeg
// reads them perfectly and audio always combines correctly.
const FPS = 10; // 10 frames/sec — smooth enough for demo scrolling

async function captureScreenshots(viewport, scrollSteps, label) {
  const framesDir = path.join(OUTPUT_DIR, `frames_${label}`);
  // Clean up any frames from a previous run
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/tools/headline-generator/demo', {
    waitUntil: 'load', timeout: 20000,
  });
  await page.waitForSelector('h1', { timeout: 10000 });
  await page.waitForTimeout(1200); // let fonts settle

  let frameIndex = 0;
  const msPerFrame = Math.round(1000 / FPS);

  // Capture a single frame to disk
  async function snap() {
    await page.screenshot({
      path: path.join(framesDir, `f${String(frameIndex).padStart(6, '0')}.png`),
      type: 'png',
    });
    frameIndex++;
  }

  for (const step of scrollSteps) {
    if (step.scrollTo !== undefined) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'smooth' }), step.scrollTo);
    }
    if (step.scrollBy !== undefined) {
      await page.evaluate((t) => window.scrollBy({ top: t, behavior: 'smooth' }), step.scrollBy);
    }
    if (step.waitForSelector) {
      await page.waitForSelector(step.waitForSelector, { timeout: 10000 });
    }
    if (step.hover) {
      await page.locator(step.hover).first().hover();
    }
    if (step.hoverNth) {
      await page.locator(step.hoverNth.selector).nth(step.hoverNth.index).hover();
    }
    if (step.click) {
      await page.locator(step.click).first().click({ timeout: 10000 });
    }
    if (step.wait) {
      // Capture frames at FPS rate for the duration of the wait
      const totalFrames = Math.max(1, Math.round((step.wait / 1000) * FPS));
      for (let i = 0; i < totalFrames; i++) {
        await snap();
        if (i < totalFrames - 1) await page.waitForTimeout(msPerFrame);
      }
    }
  }

  await browser.close();
  console.log(`    ${frameIndex} frames captured for ${label}`);
  return { framesDir, frameCount: frameIndex };
}

// ── Step 3a: Horizontal screenshots — 1280×720 desktop ──────────────────────
async function recordBrowserHorizontal() {
  return captureScreenshots({ width: 1280, height: 720 }, [
    { wait: 5000 },
    { scrollTo: 350, wait: 5000 },
    { waitForSelector: 'ul li', wait: 4000 },
    { scrollTo: 700, wait: 4000 },
    { hover: 'ul li', wait: 3000 },
    { click: 'ul li button', wait: 3000 },
    { hoverNth: { selector: 'ul li', index: 1 }, wait: 3000 },
    { scrollBy: 500, wait: 5000 },
    { wait: 4000 },
  ], 'horizontal');
}

// ── Step 3b: Mobile screenshots — 540×960 native 9:16 ───────────────────────
async function recordBrowserMobile() {
  return captureScreenshots({ width: 540, height: 960 }, [
    { wait: 5000 },
    { scrollTo: 250, wait: 5000 },
    { waitForSelector: 'ul li', wait: 4000 },
    { scrollTo: 550, wait: 4000 },
    { hover: 'ul li', wait: 3000 },
    { click: 'ul li button', wait: 3000 },
    { scrollBy: 450, wait: 5000 },
    { wait: 4000 },
  ], 'mobile');
}

// ── Step 5: Combine PNG frames + audio with FFmpeg ───────────────────────────
// PNG image sequences are 100% reliable — no codec/timing metadata issues.
// FFmpeg reads frames via the image2 demuxer and combines with WAV audio cleanly.
function combineWithFFmpeg({ framesDir: hFrames }, { framesDir: mFrames }, voicePath) {
  const horizontalPath = path.join(OUTPUT_DIR, 'headline-generator-horizontal.mp4');
  const verticalPath   = path.join(OUTPUT_DIR, 'headline-generator-vertical.mp4');
  const batPath        = path.join(OUTPUT_DIR, '_combine.bat');

  const audioSize = fs.statSync(voicePath).size;
  if (audioSize < 1000) throw new Error(`Audio file too small (${audioSize} bytes)`);
  console.log(`\n  Audio : ${path.basename(voicePath)} (${(audioSize / 1024).toFixed(0)} KB)`);

  if (fs.existsSync(horizontalPath)) fs.unlinkSync(horizontalPath);
  if (fs.existsSync(verticalPath))   fs.unlinkSync(verticalPath);

  const q  = (p) => `"${p}"`;
  // In a batch file % must be escaped as %% for the printf pattern
  const hPattern = path.join(hFrames, 'f%%06d.png');
  const mPattern = path.join(mFrames, 'f%%06d.png');

  const bat = [
    '@echo off',
    `echo Encoding horizontal 1280x720...`,
    `${q(ffmpegPath)} -y -framerate ${FPS} -i ${q(hPattern)} -i ${q(voicePath)} -map 0:v:0 -map 1:a:0 -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -b:a 192k -shortest -movflags +faststart ${q(horizontalPath)}`,
    `if errorlevel 1 ( echo HORIZONTAL FAILED && exit /b 1 )`,
    `echo Encoding vertical 1080x1920...`,
    `${q(ffmpegPath)} -y -framerate ${FPS} -i ${q(mPattern)} -i ${q(voicePath)} -map 0:v:0 -map 1:a:0 -vf scale=1080:1920:flags=lanczos -c:v libx264 -pix_fmt yuv420p -c:a aac -ar 44100 -ac 2 -b:a 192k -shortest -movflags +faststart ${q(verticalPath)}`,
    `if errorlevel 1 ( echo VERTICAL FAILED && exit /b 1 )`,
  ].join('\r\n');

  fs.writeFileSync(batPath, bat, 'utf8');
  const result = spawnSync('cmd.exe', ['/c', batPath], { stdio: 'inherit' });
  fs.unlinkSync(batPath);

  if (result.status !== 0) throw new Error('FFmpeg combine failed — check output above');

  // Clean up frame directories
  fs.rmSync(path.join(OUTPUT_DIR, 'frames_horizontal'), { recursive: true, force: true });
  fs.rmSync(path.join(OUTPUT_DIR, 'frames_mobile'),     { recursive: true, force: true });

  console.log(`\n  Horizontal : ${(fs.statSync(horizontalPath).size / 1024).toFixed(0)} KB`);
  console.log(`  Vertical   : ${(fs.statSync(verticalPath).size / 1024).toFixed(0)} KB`);

  return { horizontalPath, verticalPath };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Clean up any leftover frame directories from crashed previous runs
  for (const label of ['horizontal', 'mobile']) {
    const dir = path.join(OUTPUT_DIR, `frames_${label}`);
    if (fs.existsSync(dir)) { fs.rmSync(dir, { recursive: true }); }
  }

  // Auto-start dev server if not already running
  let devServerProcess = null;
  if (!(await checkDevServer())) {
    devServerProcess = await startDevServer();
  }

  // Shut down the server we started (not one the user already had running)
  const cleanup = () => { if (devServerProcess) { devServerProcess.kill(); devServerProcess = null; } };
  process.on('exit', cleanup);
  process.on('SIGINT', () => { cleanup(); process.exit(0); });

  console.log('\nStarting video generation pipeline...\n');

  // Step 1: Generate script — reuse cache, retry Gemini up to 3× if capacity error
  const scriptPath = path.join(OUTPUT_DIR, 'voiceover-script.txt');
  let script;
  if (fs.existsSync(scriptPath) && fs.statSync(scriptPath).size > 50) {
    script = fs.readFileSync(scriptPath, 'utf8').trim();
    console.log(`✓ Reusing cached script        (delete voiceover-script.txt to regenerate)`);
  } else {
    // Poll Gemini until it responds — no fixed limit, just keep trying.
    // Shows a live countdown so you know it's still working.
    let attempt = 0;
    while (true) {
      attempt++;
      try {
        process.stdout.write(`\rGenerating script (attempt ${attempt})...           `);
        script = await generateScript();
        fs.writeFileSync(scriptPath, script, 'utf8');
        console.log(`\r✓ Script generated (${script.split(/\s+/).length} words)              `);
        break;
      } catch (err) {
        const isCapacity = err.message?.includes('overloaded') || err.message?.includes('quota') ||
                           err.message?.includes('503') || err.message?.includes('429') ||
                           err.message?.includes('UNAVAILABLE') || err.message?.includes('busy');
        if (!isCapacity) throw err; // real error — don't retry

        // Gemini busy — wait with a visible countdown before next ping
        const waitSecs = Math.min(30 + attempt * 10, 120); // 40s, 50s … up to 2min
        for (let s = waitSecs; s > 0; s--) {
          process.stdout.write(`\r  Gemini busy — retrying in ${s}s... (attempt ${attempt})  `);
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }

  // Step 2: Generate voiceover — reuse cache, auto-fallback ElevenLabs → OpenAI
  const mp3Path = path.join(OUTPUT_DIR, 'voiceover.mp3');
  if (fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 1000) {
    console.log(`✓ Reusing existing voiceover   (delete voiceover.mp3 to regenerate)`);
  } else {
    // Auto-fallback: try preferred provider, silently switch to OpenAI if quota exceeded
    const preferredProvider = (process.env.VOICEOVER_PROVIDER || 'openai').toLowerCase();
    try {
      process.stdout.write(`Generating voiceover (${preferredProvider})...`);
      await generateVoiceover(script);
      console.log(`\r✓ Voiceover generated (${preferredProvider})                    `);
    } catch (err) {
      const isQuota = err.message?.includes('quota') || err.message?.includes('401') || err.message?.includes('429');
      if (preferredProvider === 'elevenlabs' && isQuota) {
        console.log(`\r  ElevenLabs quota exceeded — switching to OpenAI TTS automatically`);
        process.env.VOICEOVER_PROVIDER = 'openai';
        await generateVoiceover(script);
        console.log(`✓ Voiceover generated (openai fallback)                        `);
      } else {
        throw err;
      }
    }
  }

  // Step 2b: Convert MP3 → WAV before Playwright runs.
  // This runs FFmpeg in a clean process (no browser handles yet), producing an
  // uncompressed WAV that has zero codec ambiguity in the later combine step.
  // The WAV conversion is the most reliable way to guarantee audio works.
  process.stdout.write('Converting audio to WAV...');
  const wavPath = path.join(OUTPUT_DIR, 'voiceover.wav');
  const wavResult = spawnSync(ffmpegPath, ['-y', '-i', mp3Path, '-ar', '44100', '-ac', '2', wavPath], { stdio: 'pipe' });
  if (wavResult.status !== 0) throw new Error('MP3 → WAV conversion failed:\n' + (wavResult.stderr?.toString() ?? ''));
  console.log(`\r✓ Audio converted to WAV   → output/videos/voiceover.wav`);
  const voicePath = wavPath; // use WAV for all subsequent steps

  // Step 3a: Capture desktop screenshots (1280×720)
  console.log('Capturing desktop screenshots (1280×720)...');
  const horizontalFrames = await recordBrowserHorizontal();
  console.log(`✓ Desktop capture complete  (${horizontalFrames.frameCount} frames)`);

  // Step 3b: Capture mobile screenshots (540×960)
  console.log('Capturing mobile screenshots (540×960)...');
  const mobileFrames = await recordBrowserMobile();
  console.log(`✓ Mobile capture complete   (${mobileFrames.frameCount} frames)`);

  // Step 4 + 5: Combine each recording with the same voiceover
  console.log('\nCombining video and audio...');
  const { horizontalPath, verticalPath } = combineWithFFmpeg(horizontalFrames, mobileFrames, voicePath);
  console.log(`✓ Horizontal video → output/videos/headline-generator-horizontal.mp4`);
  console.log(`✓ Vertical video   → output/videos/headline-generator-vertical.mp4`);

  cleanup(); // shut down dev server if we started it
  console.log('\n✓ Done! Videos ready in output\\videos\\');
  console.log('  headline-generator-horizontal.mp4');
  console.log('  headline-generator-vertical.mp4\n');
}

main().catch((err) => {
  console.error('\nPipeline failed:', err.message);
  process.exit(1);
});
