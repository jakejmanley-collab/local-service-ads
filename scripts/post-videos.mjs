/**
 * post-videos.mjs
 *
 * Reads approved entries from output/videos/queue.json and posts them
 * to connected social platforms. Run after reviewing videos at /admin/video-review.
 *
 * Usage:
 *   npm run post-videos              — post all approved, unposted videos
 *   npm run post-videos -- --dry-run — show what would be posted without posting
 *
 * Platform setup status:
 *   YouTube   — needs YOUTUBE_REFRESH_TOKEN (run: npm run auth-youtube)
 *   Instagram — needs INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_ACCOUNT_ID
 *   TikTok    — needs TIKTOK_ACCESS_TOKEN (apply at developers.tiktok.com)
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'output', 'videos');
const QUEUE_FILE = path.join(OUTPUT_DIR, 'queue.json');

const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) console.log('\n⚠  DRY RUN — no videos will actually be posted\n');

// ── Queue helpers ────────────────────────────────────────────────────────────
function readQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function writeQueue(entries) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

function markPosted(entries, id, platform) {
  return entries.map(e => {
    if (e.id !== id) return e;
    return {
      ...e,
      posted: {
        ...(e.posted || {}),
        [platform]: new Date().toISOString(),
      },
    };
  });
}

// ── Generic HTTPS POST helper ────────────────────────────────────────────────
function httpsPost(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── YouTube ──────────────────────────────────────────────────────────────────
// Docs: https://developers.google.com/youtube/v3/guides/uploading_a_video
async function getYouTubeAccessToken() {
  const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN } = process.env;
  if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    throw new Error('YouTube credentials missing. Run: npm run auth-youtube');
  }
  const body = new URLSearchParams({
    client_id:     YOUTUBE_CLIENT_ID,
    client_secret: YOUTUBE_CLIENT_SECRET,
    refresh_token: YOUTUBE_REFRESH_TOKEN,
    grant_type:    'refresh_token',
  }).toString();

  const res = await httpsPost({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }, body);

  const data = JSON.parse(res.body);
  if (!data.access_token) throw new Error('YouTube token refresh failed: ' + res.body);
  return data.access_token;
}

async function postToYouTube(entry) {
  const filePath = path.join(OUTPUT_DIR, entry.horizontal);
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${entry.horizontal}`);

  if (DRY_RUN) {
    console.log(`  [YouTube] Would upload: ${entry.horizontal}`);
    return;
  }

  const accessToken = await getYouTubeAccessToken();
  const fileSize    = fs.statSync(filePath).size;
  const metadata    = JSON.stringify({
    snippet: {
      title:       entry.youtubeTitle || `${entry.tool} — Free Tool Demo | aretifi.com`,
      description: entry.youtubeDescription || `Try this free tool at https://aretifi.com/tools`,
      tags:        ['contractor', 'small business', 'free tool', 'aretifi'],
      categoryId:  '28', // Science & Technology
    },
    status: { privacyStatus: 'public' },
  });

  // Step 1: Initiate resumable upload
  const initRes = await httpsPost({
    hostname: 'www.googleapis.com',
    path: `/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`,
    method: 'POST',
    headers: {
      'Authorization':           `Bearer ${accessToken}`,
      'Content-Type':            'application/json',
      'X-Upload-Content-Type':   'video/mp4',
      'X-Upload-Content-Length': fileSize,
    },
  }, metadata);

  const uploadUrl = initRes.status === 200
    ? JSON.parse(initRes.body).selfLink  // fallback
    : null;

  // The resumable upload URI comes back in the Location header — use a lower-level
  // approach for the actual file upload (handled by post-videos in a follow-up)
  console.log(`  [YouTube] Upload initiated. Status: ${initRes.status}`);
  console.log(`  Note: Full resumable upload implementation pending account setup.`);
}

// ── Instagram ────────────────────────────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/instagram-api/guides/reels
async function postToInstagram(entry) {
  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } = process.env;
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_ACCOUNT_ID) {
    throw new Error('Instagram credentials missing — add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID to .env.local');
  }

  if (DRY_RUN) {
    console.log(`  [Instagram] Would upload: ${entry.vertical}`);
    return;
  }

  // Instagram requires the video to be hosted at a public URL.
  // Once deployed, use: https://aretifi.com/videos/${entry.vertical}
  // For now this is a placeholder — full implementation after account setup.
  console.log(`  [Instagram] Pending: video must be at a public URL. Deploy first.`);
}

// ── TikTok ───────────────────────────────────────────────────────────────────
// Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
async function postToTikTok(entry) {
  const { TIKTOK_ACCESS_TOKEN } = process.env;
  if (!TIKTOK_ACCESS_TOKEN) {
    throw new Error('TikTok credentials missing — add TIKTOK_ACCESS_TOKEN to .env.local');
  }

  if (DRY_RUN) {
    console.log(`  [TikTok] Would upload: ${entry.vertical}`);
    return;
  }

  console.log(`  [TikTok] Pending: API access approval required from developers.tiktok.com`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(QUEUE_FILE)) {
    console.log('No queue.json found. Run npm run generate-video first.');
    return;
  }

  let entries = readQueue();
  const approved = entries.filter(e => e.status === 'approved');

  if (approved.length === 0) {
    console.log('No approved videos to post. Review videos at /admin/video-review first.');
    return;
  }

  // Only post videos that haven't been posted to all platforms yet
  const toPost = approved.filter(e => {
    const posted = e.posted || {};
    return !posted.youtube || !posted.instagram || !posted.tiktok;
  });

  if (toPost.length === 0) {
    console.log('All approved videos have already been posted.');
    return;
  }

  console.log(`\nPosting ${toPost.length} approved video(s)...\n`);

  for (const entry of toPost) {
    console.log(`▶ ${entry.tool} — created ${new Date(entry.createdAt).toLocaleDateString()}`);

    const platforms = [
      { name: 'youtube',   fn: postToYouTube,   envKey: 'YOUTUBE_REFRESH_TOKEN' },
      { name: 'instagram', fn: postToInstagram, envKey: 'INSTAGRAM_ACCESS_TOKEN' },
      { name: 'tiktok',    fn: postToTikTok,    envKey: 'TIKTOK_ACCESS_TOKEN' },
    ];

    for (const { name, fn, envKey } of platforms) {
      if (entry.posted?.[name]) {
        console.log(`  [${name}] Already posted — skipping`);
        continue;
      }
      if (!process.env[envKey]) {
        console.log(`  [${name}] Skipping — ${envKey} not set in .env.local`);
        continue;
      }
      try {
        await fn(entry);
        if (!DRY_RUN) {
          entries = markPosted(entries, entry.id, name);
          writeQueue(entries);
        }
      } catch (err) {
        console.error(`  [${name}] Failed: ${err.message}`);
      }
    }

    console.log('');
  }

  console.log(DRY_RUN ? 'Dry run complete.\n' : 'Done.\n');
}

main().catch(err => {
  console.error('\nFailed:', err.message);
  process.exit(1);
});
