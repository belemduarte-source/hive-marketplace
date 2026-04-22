/**
 * Hive API — functional test suite
 * Run: node test-suite.js
 * Requires the server to be running on PORT (default 4000)
 */
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 4000}`;
const TEST_EMAIL = `test_${Date.now()}@hive-test.dev`;
const TEST_PASSWORD = 'TestPass123!';

let passed = 0;
let failed = 0;
let cookie = '';

// ── helpers ───────────────────────────────────────────────────────────────────
function ok(label, bool, detail = '') {
  if (bool) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

async function req(method, path, body, useCookie = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (useCookie && cookie) headers['Cookie'] = cookie;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  // capture Set-Cookie from auth responses
  const sc = res.headers.get('set-cookie');
  if (sc) cookie = sc.split(';')[0];
  let json;
  try { json = await res.json(); } catch { json = null; }
  return { status: res.status, json, headers: res.headers };
}

// ── test groups ───────────────────────────────────────────────────────────────
async function testHealth() {
  console.log('\n🔵 Health');
  const r = await req('GET', '/api/health');
  ok('returns 200', r.status === 200, `got ${r.status}`);
  ok('ok: true',    r.json?.ok === true);
  ok('has timestamp', !!r.json?.ts);
}

async function testCompaniesPublic() {
  console.log('\n🔵 GET /api/companies (public)');
  const r = await req('GET', '/api/companies');
  ok('returns 200',          r.status === 200, `got ${r.status}`);
  ok('returns array',        Array.isArray(r.json), typeof r.json);
  if (Array.isArray(r.json) && r.json.length > 0) {
    const c = r.json[0];
    ok('company has id',     !!c.id);
    ok('company has name',   !!c.name);
    ok('company has lat',    c.lat !== undefined);
    ok('company has lng',    c.lng !== undefined);
    ok('status is approved', c.status === 'approved', c.status);
    ok('no created_by leak', c.created_by === undefined, 'internal field exposed');
  }
  // Country filter
  const pt = await req('GET', '/api/companies?country=pt');
  ok('country filter works', pt.status === 200 && Array.isArray(pt.json));
  if (Array.isArray(pt.json) && pt.json.length > 0) {
    ok('country filter correct', pt.json.every(c => c.country === 'pt'));
  }
}

async function testAuthRegister() {
  console.log('\n🔵 POST /api/auth/register');

  // Valid client registration
  const r = await req('POST', '/api/auth/register', {
    name: 'Test Client',
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    type: 'cliente',
  });
  ok('creates user (201)',   r.status === 201, `got ${r.status}`);
  ok('returns user object',  !!r.json?.user);
  ok('user has id',          !!r.json?.user?.id);
  ok('user has name',        r.json?.user?.name === 'Test Client');
  ok('no password in resp',  !r.json?.user?.password && !r.json?.user?.password_hash);
  ok('sets cookie',          cookie.includes('hive_token'));

  // Duplicate email
  const dup = await req('POST', '/api/auth/register', {
    name: 'Dup', email: TEST_EMAIL, password: TEST_PASSWORD, type: 'cliente',
  });
  ok('rejects duplicate (409)', dup.status === 409, `got ${dup.status}`);

  // Missing fields
  const missing = await req('POST', '/api/auth/register', { name: 'X', type: 'cliente' });
  ok('rejects missing fields (400)', missing.status === 400, `got ${missing.status}`);

  // Short password
  const short = await req('POST', '/api/auth/register', {
    name: 'X', email: `x_${Date.now()}@test.dev`, password: '123', type: 'cliente',
  });
  ok('rejects short password (400)', short.status === 400, `got ${short.status}`);

  // Invalid type
  const badType = await req('POST', '/api/auth/register', {
    name: 'X', email: `y_${Date.now()}@test.dev`, password: TEST_PASSWORD, type: 'admin',
  });
  ok('rejects invalid type (400)', badType.status === 400, `got ${badType.status}`);
}

async function testAuthLogin() {
  console.log('\n🔵 POST /api/auth/login');

  // Correct credentials
  const r = await req('POST', '/api/auth/login', { email: TEST_EMAIL, password: TEST_PASSWORD });
  ok('login OK (200)',       r.status === 200, `got ${r.status}`);
  ok('returns user',        !!r.json?.user);
  ok('sets cookie',         cookie.includes('hive_token'));

  // Wrong password
  const bad = await req('POST', '/api/auth/login', { email: TEST_EMAIL, password: 'wrong' });
  ok('wrong pass (401)',    bad.status === 401, `got ${bad.status}`);
  ok('no stack trace',      !JSON.stringify(bad.json).includes('at '));

  // Non-existent email
  const noUser = await req('POST', '/api/auth/login', { email: 'nobody@x.com', password: 'x' });
  ok('no user (401)',       noUser.status === 401, `got ${noUser.status}`);

  // Missing fields
  const mis = await req('POST', '/api/auth/login', { email: TEST_EMAIL });
  ok('missing pass (400)',  mis.status === 400, `got ${mis.status}`);
}

async function testAuthMe() {
  console.log('\n🔵 GET /api/auth/me');

  // Re-login to get fresh cookie
  await req('POST', '/api/auth/login', { email: TEST_EMAIL, password: TEST_PASSWORD });

  const r = await req('GET', '/api/auth/me', null, true);
  ok('returns user (200)',       r.status === 200, `got ${r.status}`);
  ok('correct email',           r.json?.user?.email === TEST_EMAIL);
  ok('no password_hash',        !r.json?.user?.password_hash);

  // Without cookie
  const savedCookie = cookie;
  cookie = '';
  const unauth = await req('GET', '/api/auth/me');
  ok('401 without token',       unauth.status === 401, `got ${unauth.status}`);
  cookie = savedCookie;
}

async function testCompanySubmit() {
  console.log('\n🔵 POST /api/companies (company registration)');

  // Valid submission (unauthenticated visitor — allowed)
  const savedCookie = cookie;
  cookie = '';
  const r = await req('POST', '/api/companies', {
    name: `Test Company ${Date.now()}`,
    lat: 38.716,
    lng: -9.139,
    city: 'Lisboa',
    country: 'pt',
    email: 'test@company.pt',
    phone: '+351 900 000 000',
    sectors: ['construcao'],
    tags: ['Obras', 'Remodelações'],
    description: 'Test company for automated tests',
  });
  ok('accepts unauthenticated submit (201)', r.status === 201, `got ${r.status}`);
  ok('status is pending',   r.json?.status === 'pending', r.json?.status);
  ok('has id',              !!r.json?.id);
  ok('has name',            !!r.json?.name);
  const newId = r.json?.id;

  // Missing required fields
  const bad = await req('POST', '/api/companies', { city: 'Porto' });
  ok('rejects missing name/lat/lng (400)', bad.status === 400, `got ${bad.status}`);

  // Payload too large (check body size cap)
  const huge = await req('POST', '/api/companies', {
    name: 'Big', lat: 38, lng: -9,
    description: 'x'.repeat(60000),
  });
  ok('rejects >50kb payload (413)', huge.status === 413, `got ${huge.status}`);

  cookie = savedCookie;
  return newId;
}

async function testCompanyDetail(id) {
  console.log('\n🔵 GET /api/companies/:id');
  if (!id) { console.log('  ⚠️  Skipped (no id from submit test)'); return; }

  // Pending company should NOT be visible publicly
  const r = await req('GET', `/api/companies/${id}`);
  ok('pending not visible (404)', r.status === 404, `got ${r.status}`);

  // Non-existent id
  const notFound = await req('GET', '/api/companies/999999999');
  ok('unknown id (404)',    notFound.status === 404, `got ${notFound.status}`);
}

async function testLogout() {
  console.log('\n🔵 POST /api/auth/logout');
  const r = await req('POST', '/api/auth/logout', null, true);
  ok('logout (200)', r.status === 200, `got ${r.status}`);
  ok('ok: true',     r.json?.ok === true);
}

async function testSecurityHeaders() {
  console.log('\n🔵 Security headers (helmet)');
  const r = await req('GET', '/api/health');
  ok('X-Content-Type-Options', !!r.headers.get('x-content-type-options'));
  ok('X-Frame-Options or CSP', !!r.headers.get('x-frame-options') || !!r.headers.get('content-security-policy'));
}

async function testCORS() {
  console.log('\n🔵 CORS');
  // Allowed origin — should get the header back
  const allowed = await fetch(BASE + '/api/health', {
    headers: { 'Origin': 'http://localhost:9091' },
  });
  ok('allowed origin passes', allowed.status === 200);
  ok('allowed origin gets CORS header',
    allowed.headers.get('access-control-allow-origin') === 'http://localhost:9091');

  // Foreign origin — should NOT get access-control-allow-origin
  const foreign = await fetch(BASE + '/api/health', {
    headers: { 'Origin': 'https://evil.example.com' },
  });
  ok('foreign origin blocked (no CORS header)',
    !foreign.headers.get('access-control-allow-origin'));
}

async function testInvalidJSON() {
  console.log('\n🔵 Malformed input');
  const r = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ bad json :::',
  });
  ok('malformed JSON returns 400', r.status === 400, `got ${r.status}`);
}

// ── runner ────────────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n🐝 Hive API Test Suite  —  ${BASE}`);
  console.log('─'.repeat(50));

  try {
    await testHealth();
    await testCompaniesPublic();
    await testAuthRegister();
    await testAuthLogin();
    await testAuthMe();
    const newId = await testCompanySubmit();
    await testCompanyDetail(newId);
    await testLogout();
    await testSecurityHeaders();
    await testCORS();
    await testInvalidJSON();
  } catch (e) {
    console.error('\n💥 Test runner threw:', e.message);
    failed++;
  }

  const total = passed + failed;
  console.log('\n' + '─'.repeat(50));
  console.log(`\n📊 Results: ${passed}/${total} passed`);
  if (failed > 0) {
    console.error(`   ${failed} test(s) FAILED`);
    process.exit(1);
  } else {
    console.log('   All tests passed ✅');
    process.exit(0);
  }
}

run();
