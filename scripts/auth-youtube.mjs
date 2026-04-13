/**
 * auth-youtube.mjs
 *
 * One-time OAuth flow to get a YouTube refresh token.
 * Run this ONCE after setting up your Google Cloud project.
 *
 * Steps:
 *   1. Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to .env.local
 *   2. Run: npm run auth-youtube
 *   3. Open the URL it prints, authorize with your Google account
 *   4. Paste the code it gives you back into the terminal
 *   5. Copy the YOUTUBE_REFRESH_TOKEN it prints into .env.local
 */

import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import { createInterface } from 'readline';

dotenv.config({ path: '.env.local' });

const CLIENT_ID     = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:3000/auth/youtube/callback';
const SCOPE         = 'https://www.googleapis.com/auth/youtube.upload';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nMissing YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET in .env.local');
  console.error('Set these up first at: https://console.cloud.google.com\n');
  process.exit(1);
}

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=${encodeURIComponent(SCOPE)}&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('\n── YouTube OAuth Setup ─────────────────────────────────────\n');
console.log('1. Open this URL in your browser:\n');
console.log(`   ${authUrl}\n`);
console.log('2. Sign in with the Google account that owns your YouTube channel');
console.log('3. Click Allow');
console.log('4. Copy the "code" from the URL you get redirected to\n');

async function exchangeCode(code) {
  const body = new URLSearchParams({
    code,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri:  REDIRECT_URI,
    grant_type:    'authorization_code',
  }).toString();

  const req = https.request({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type':   'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  }, (res) => {
    let data = '';
    res.on('data', c => (data += c));
    res.on('end', () => {
      const json = JSON.parse(data);
      if (!json.refresh_token) {
        console.error('\nFailed to get refresh token:', data);
        process.exit(1);
      }
      console.log('\n── Success! Add this to your .env.local ────────────────────\n');
      console.log(`YOUTUBE_REFRESH_TOKEN=${json.refresh_token}\n`);
      console.log('You only need to do this once — the refresh token does not expire.\n');
    });
  });

  req.on('error', err => { console.error('Request failed:', err.message); process.exit(1); });
  req.write(body);
  req.end();
}

// Accept code as --code=VALUE argument or via interactive prompt
const codeArg = process.argv.find(a => a.startsWith('--code='))?.split('=').slice(1).join('=');

if (codeArg) {
  exchangeCode(codeArg);
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Paste the code here: ', (code) => { rl.close(); exchangeCode(code.trim()); });
}
