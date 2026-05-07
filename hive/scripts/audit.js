/**
 * Hive frontend static audit (dev tool \u2014 not served to clients)
 * Run from anywhere: node hive/scripts/audit.js
 */
const fs   = require('fs');
const path = require('path');
const FRONTEND = path.join(__dirname, '..', 'frontend');
const html = fs.readFileSync(path.join(FRONTEND, 'index.html'), 'utf8');

// Extract all inline JS
const scripts = [];
let m;
const re = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
while ((m = re.exec(html)) !== null) scripts.push(m[1]);
const js = scripts.join('\n');

let pass = 0, fail = 0;
function ok(label, cond) {
  if (cond) { console.log('  \u2705 ' + label); pass++; }
  else       { console.error('  \u274c ' + label); fail++; }
}
const has    = pat => pat.test(js);
const inHtml = pat => pat.test(html);
const sw     = fs.readFileSync(path.join(FRONTEND, 'sw.js'), 'utf8');

// ── 1. Core functions exist ───────────────────────────────────────────────────
console.log('\n[1] Core functions');
ok('openDetail',              has(/function openDetail\b/));
ok('closeDetail',             has(/function closeDetail\b/));
ok('showTab',                 has(/function showTab\b/));
ok('applyFilters',            has(/function applyFilters\b/));
ok('detectUserLocation',      has(/function detectUserLocation\b/));
ok('saveCompanyToDB',         has(/function saveCompanyToDB\b/));
ok('submitRegister',          has(/function submitRegister\b/));
ok('regNextStep',             has(/function regNextStep\b/));
ok('openProfilePanel',        has(/function openProfilePanel\b/));
ok('profileEditCompany',      has(/function profileEditCompany\b/));
ok('mspOpenSheet',            has(/function mspOpenSheet\b/));
ok('mspCloseSheet',           has(/function mspCloseSheet\b/));
ok('mspUpdateChips',          has(/function mspUpdateChips\b/));
ok('mspRequestLocation',      has(/function mspRequestLocation\b/));
ok('mspRadiusApply',          has(/function mspRadiusApply\b/));
ok('mspRadiusInput',          has(/function mspRadiusInput\b/));
ok('mspClearLocation',        has(/function mspClearLocation\b/));
ok('doLogin',                 has(/async function doLogin\b/));
ok('doRegister',              has(/async function doRegister\b/));
ok('showToast',               has(/function showToast\b/));
ok('updateNavAuth',           has(/function updateNavAuth\b/));

// ── 2. Auth gate ──────────────────────────────────────────────────────────────
console.log('\n[2] Auth gate (detail panel)');
ok('dpQuoteBar toggled',       has(/dpQuoteBar/));
ok('dpLoginGate toggled',      has(/dpLoginGate/));
ok('dpGatedSections toggled',  has(/dpGatedSections/));
ok('loggedIn check in openDetail', has(/sessionStorage\.getItem.*hive_user[\s\S]{0,300}dpQuoteBar/));
ok('panel refresh after login',    has(/if \(selectedId\) openDetail/));
ok('panel refresh after register', js.includes('if (selectedId) openDetail'));

// ── 3. Registration form ──────────────────────────────────────────────────────
console.log('\n[3] Registration form');
ok('regName field in HTML',         inHtml(/id="regName"/));
ok('regAlvara field in HTML',       inHtml(/id="regAlvara"/));
ok('regCertidao field REMOVED',    !inHtml(/id="regCertidao"/));
ok('certidao validation call gone',!js.includes('valCertidao'));
ok('regCertidao not referenced in JS', !js.includes('regCertidao'));
ok('alvara not required (no if !alvara)', !has(/if\s*\(!alvara\)/));
ok('regZone hidden in HTML',        inHtml(/id="regZone"[\s\S]{0,30}display:none/));
ok('_editingCompanyId flag used',   js.includes('_editingCompanyId'));
ok('_editingCompanyId cleared',     js.includes('_editingCompanyId = null'));
ok('api.updateCompany on edit',     js.includes('api.updateCompany'));
ok('api.createCompany on new',      js.includes('api.createCompany'));
ok('no certidao_permanente:certidao', !js.includes('certidao_permanente: certidao'));

// ── 4. Mobile chips ───────────────────────────────────────────────────────────
console.log('\n[4] Mobile filter chips');
ok('mspChipLocation in HTML',  inHtml(/id="mspChipLocation"/));
ok('mspChipRadius in HTML',    inHtml(/id="mspChipRadius"/));
ok('mspChipArea in HTML',      inHtml(/id="mspChipArea"/));
ok('mspChipSort in HTML',      inHtml(/id="mspChipSort"/));
ok('mspChipRating in HTML',    inHtml(/id="mspChipRating"/));
ok('mspChipStatus in HTML',    inHtml(/id="mspChipStatus"/));
ok("location sheet handler",   js.includes("=== 'location'"));
ok("radius sheet handler",     js.includes("=== 'radius'"));
ok('radius syncs desktop slider', js.includes('radiusSlider'));
ok('chipId map includes location+radius', js.includes("'mspChipLocation'"));

// ── 5. Performance CSS ────────────────────────────────────────────────────────
console.log('\n[5] Performance CSS');
ok('touch-action:manipulation global', inHtml(/touch-action\s*:\s*manipulation/));
ok('will-change:transform declared',   inHtml(/will-change\s*:\s*transform/));
ok('backface-visibility:hidden',       inHtml(/backface-visibility\s*:\s*hidden/));
ok('mobile detail panel translateY',   inHtml(/translateY\(100%\).*!important/));
ok('mspSheet transition cubic-bezier', inHtml(/mspSheet[\s\S]{0,500}cubic-bezier/));
ok('passive event listeners',          js.includes('passive: true'));

// ── 6. GPS / location ─────────────────────────────────────────────────────────
console.log('\n[6] GPS & location');
ok('_locationObtained flag',        js.includes('_locationObtained'));
ok('getCurrentPosition called',     js.includes('getCurrentPosition'));
ok('permission denied error codes', js.includes('err.code') || js.includes('error.code'));
ok('error toast shown',             js.includes('toastGeoPermissionDenied') || js.includes('toastGeoError'));
ok('no duplicate auto-detect',     (js.match(/detectUserLocation\(true\)/g) || []).length === 2);
ok('DOMContentLoaded fires detect', js.includes('detectUserLocation(true)'));

// ── 7. Profile panel & company management ─────────────────────────────────────
console.log('\n[7] Profile panel');
ok('profileEditCompany in card',    js.includes('profileEditCompany(${c.id}') || js.includes('profileEditCompany(c.id)') || html.includes('profileEditCompany(${c.id}'));
ok('Add / Adicionar button',        html.includes('Adicionar'));
ok('status badges shown',           js.includes('Aprovada') && js.includes('Pendente'));
ok('closeProfilePanel function',    js.includes('function closeProfilePanel'));
ok('openRegister in edit flow',     js.includes('openRegister()'));

// ── 8. Integrity checks ───────────────────────────────────────────────────────
console.log('\n[8] Integrity');
ok('map null-guarded',          js.includes('if (map)'));
ok('SW cache v17',              sw.includes('hive-v17'));
ok('serviceWorker registered',  js.includes('serviceWorker.register'));
ok('translations.pt exists',    html.includes('pt: {') || html.includes("pt : {") || html.includes("pt:{"));
ok('localStorage hive_lang set', js.includes("localStorage.setItem('hive_lang'") || js.includes('localStorage.setItem("hive_lang"'));
ok('swipe close on touchend',   js.includes('touchend'));
ok('api.js loaded in head',     html.includes('src="api.js"') || html.includes("src='api.js'"));

// ── 9. Map ────────────────────────────────────────────────────────────────────
console.log('\n[9] Map');
ok('Leaflet CSS loaded',        inHtml(/leaflet@.*\.css/));
ok('markerClusterGroup used',   js.includes('markerClusterGroup'));
ok('flyTo null-guarded',        js.includes('if (map)'));
ok('L.map initialised',         js.includes('L.map('));

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n' + '\u2500'.repeat(50));
const total = pass + fail;
console.log('Results: ' + pass + '/' + total + ' pass  |  ' + fail + ' fail');
process.exit(fail > 0 ? 1 : 0);
