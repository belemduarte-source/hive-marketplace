// ── Push notifications (Firebase Cloud Messaging, HTTP v1) ────────────────────
// Dormant unless a service account is configured (FCM_PROJECT_ID +
// FCM_CLIENT_EMAIL + FCM_PRIVATE_KEY), mirroring the email/AI integrations.
// FCM HTTP v1 reaches both Android and iOS (APNs) devices through one API once
// you've uploaded your APNs key to the Firebase project.
const jwt = require('jsonwebtoken');
const pool = require('./db');

const FCM_PROJECT_ID = process.env.FCM_PROJECT_ID;
const FCM_CLIENT_EMAIL = process.env.FCM_CLIENT_EMAIL;
// Private keys are stored in env with literal "\n" — restore real newlines.
const FCM_PRIVATE_KEY = (process.env.FCM_PRIVATE_KEY || '').replace(/\\n/g, '\n');

function pushEnabled() {
  return !!(FCM_PROJECT_ID && FCM_CLIENT_EMAIL && FCM_PRIVATE_KEY);
}

// OAuth access token for the messaging scope, cached until ~1 min before expiry.
let _token = { value: null, exp: 0 };
async function getAccessToken() {
  if (_token.value && Date.now() < _token.exp - 60000) return _token.value;
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    {
      iss: FCM_CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    },
    FCM_PRIVATE_KEY,
    { algorithm: 'RS256' }
  );
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.access_token) {
    throw new Error('FCM token exchange failed: ' + (data.error_description || data.error || r.status));
  }
  _token = { value: data.access_token, exp: Date.now() + (data.expires_in || 3600) * 1000 };
  return _token.value;
}

async function sendToToken(token, notification, data) {
  const access = await getAccessToken();
  // FCM data payloads must be string→string.
  const strData = {};
  for (const k of Object.keys(data || {})) strData[k] = String(data[k]);
  const r = await fetch(`https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + access, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: { token, notification, data: strData } }),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    // Token no longer valid → prune it so we stop trying.
    if (r.status === 404 || /UNREGISTERED|NotRegistered|InvalidRegistration/i.test(txt)) {
      await pool.query('DELETE FROM device_tokens WHERE token = $1', [token]).catch(() => {});
    }
    throw new Error('FCM send failed ' + r.status + ': ' + txt.slice(0, 200));
  }
}

// Best-effort push to every device a user has registered. Never throws — a
// failed notification must not break the request that triggered it.
async function pushToUser(userId, title, body, data) {
  if (!pushEnabled() || !userId) return;
  try {
    const { rows } = await pool.query('SELECT token FROM device_tokens WHERE user_id = $1', [userId]);
    await Promise.all(
      rows.map((row) =>
        sendToToken(row.token, { title, body }, data).catch((e) => console.warn('[push]', e.message))
      )
    );
  } catch (e) {
    console.warn('[push] pushToUser failed:', e.message);
  }
}

module.exports = { pushEnabled, pushToUser };
