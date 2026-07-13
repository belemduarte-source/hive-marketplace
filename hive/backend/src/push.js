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

// ── Web Push (browsers/PWA) ───────────────────────────────────────────────────
// Sem configuração manual: o par VAPID é gerado uma vez e persistido em
// app_settings, por isso funciona sem env vars (ao contrário do FCM acima).
let _webpush = null;
try { _webpush = require('web-push'); } catch (_) { /* dependência ainda não instalada */ }

let _vapid = null;
async function getVapid() {
  if (!_webpush) throw new Error('web-push não instalado');
  if (_vapid) return _vapid;
  const { rows } = await pool.query(`SELECT value FROM app_settings WHERE key = 'vapid'`);
  if (rows[0]) {
    _vapid = rows[0].value;
  } else {
    const keys = _webpush.generateVAPIDKeys();
    // duas instâncias frias a gerar em simultâneo convergem para a primeira
    await pool.query(
      `INSERT INTO app_settings (key, value) VALUES ('vapid', $1) ON CONFLICT (key) DO NOTHING`,
      [JSON.stringify(keys)]);
    const { rows: r2 } = await pool.query(`SELECT value FROM app_settings WHERE key = 'vapid'`);
    _vapid = r2[0].value;
  }
  _webpush.setVapidDetails('mailto:geral@hivex.pt', _vapid.publicKey, _vapid.privateKey);
  return _vapid;
}

async function webPushToUser(userId, title, body, data) {
  if (!_webpush || !userId) return;
  try {
    await getVapid();
    const { rows } = await pool.query(
      `SELECT id, endpoint, keys FROM push_subscriptions WHERE user_id = $1`, [userId]);
    const payload = JSON.stringify({ title, body, url: (data && data.url) || '/' });
    for (const s of rows) {
      _webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload)
        .catch(err => {
          const code = err && err.statusCode;
          // subscrições mortas saem na passada
          if (code === 410 || code === 404) {
            pool.query(`DELETE FROM push_subscriptions WHERE id = $1`, [s.id]).catch(() => {});
          }
        });
    }
  } catch (e) { console.warn('[webpush]', e.message); }
}

// Best-effort push to every device a user has registered. Never throws — a
// failed notification must not break the request that triggered it.
// Tenta os dois transportes: FCM (app nativa, se configurado) e Web Push.
async function pushToUser(userId, title, body, data) {
  if (!userId) return;
  webPushToUser(userId, title, body, data).catch(() => {});
  if (!pushEnabled()) return;
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

module.exports = { pushEnabled, pushToUser, getVapid };
