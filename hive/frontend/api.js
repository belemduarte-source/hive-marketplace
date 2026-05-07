// Hive API client — replaces Supabase SDK
// All requests use credentials: 'include' so the httpOnly JWT cookie is sent automatically

const API_BASE = window.API_BASE || '/api';

async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (netErr) {
    // fetch only throws on actual network failure — DNS, offline, CORS, etc.
    // Tag with status:0 so callers can distinguish from server-side errors.
    const e = new Error('Sem ligação ao servidor');
    e.status = 0;
    e.cause  = netErr;
    throw e;
  }
  // Read body as text first so non-JSON 5xx responses still surface usefully.
  const raw = await res.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch (_) { /* keep data={} */ }
  if (!res.ok) {
    const msg = data.error || `Erro do servidor (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.body   = raw.slice(0, 200);
    throw err;
  }
  return data;
}

const api = {
  // ── Companies ──────────────────────────────────────────────────────────────
  getCompanies(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch('/companies' + qs);
  },
  getCompany(id) {
    return apiFetch('/companies/' + id);
  },
  createCompany(company) {
    return apiFetch('/companies', { method: 'POST', body: company });
  },
  updateCompany(id, data) {
    return apiFetch('/companies/' + id, { method: 'PUT', body: data });
  },
  deleteCompany(id) {
    return apiFetch('/companies/' + id, { method: 'DELETE' });
  },

  // GET /api/companies/status?email= — check registration status
  getCompanyStatus(email) {
    return apiFetch('/companies/status?email=' + encodeURIComponent(email));
  },

  // ── Reviews ────────────────────────────────────────────────────────────────
  getReviews(companyId) {
    return apiFetch('/companies/' + companyId + '/reviews');
  },
  submitReview(companyId, score, comment) {
    return apiFetch('/companies/' + companyId + '/reviews', {
      method: 'POST',
      body: { score, comment },
    });
  },
  // Company owner replies to a single review
  replyToReview(companyId, reviewId, reply) {
    return apiFetch('/companies/' + companyId + '/reviews/' + reviewId + '/reply', {
      method: 'POST',
      body: { reply },
    });
  },

  // ── Contact form relay ─────────────────────────────────────────────────────
  contactCompany(companyId, message) {
    return apiFetch('/companies/' + companyId + '/contact', {
      method: 'POST',
      body: { message },
    });
  },

  // ── Reporting ──────────────────────────────────────────────────────────────
  reportCompany(companyId, reason, details) {
    return apiFetch('/companies/' + companyId + '/report', {
      method: 'POST',
      body: { reason, details },
    });
  },

  // ── Analytics ──────────────────────────────────────────────────────────────
  trackEvent(companyId, type) {
    // Fire-and-forget — never throws
    apiFetch('/companies/' + companyId + '/event', {
      method: 'POST',
      body: { type },
    }).catch(() => {});
  },
  getAnalytics(companyId) {
    return apiFetch('/companies/' + companyId + '/analytics');
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  adminStats() {
    return apiFetch('/admin/stats');
  },
  adminCompanies(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch('/admin/companies' + qs);
  },
  adminSetStatus(id, status) {
    return apiFetch('/admin/companies/' + id + '/status', { method: 'PUT', body: { status } });
  },
  adminSetFeatured(id, featured) {
    return apiFetch('/admin/companies/' + id + '/featured', { method: 'PUT', body: { featured } });
  },
  adminSetVerified(id, verified) {
    return apiFetch('/admin/companies/' + id + '/verified', { method: 'PUT', body: { verified } });
  },
  adminDeleteReview(id) {
    return apiFetch('/admin/reviews/' + id, { method: 'DELETE' });
  },
  adminReports(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch('/admin/reports' + qs);
  },
  adminSetReportStatus(id, status) {
    return apiFetch('/admin/reports/' + id + '/status', { method: 'PUT', body: { status } });
  },

  // ── Auth ───────────────────────────────────────────────────────────────────
  login(email, password) {
    return apiFetch('/auth/login', { method: 'POST', body: { email, password } });
  },
  register(data) {
    return apiFetch('/auth/register', { method: 'POST', body: data });
  },
  logout() {
    return apiFetch('/auth/logout', { method: 'POST' });
  },
  getMe() {
    return apiFetch('/auth/me');
  },
  // Google sign-in: exchanges a Google ID token for a Hive session cookie
  loginWithGoogle(idToken, type) {
    return apiFetch('/auth/google', { method: 'POST', body: { idToken, type } });
  },
  // Returns { googleClientId } — empty string if Google sign-in is disabled
  getAuthConfig() {
    return apiFetch('/auth/config');
  },
  // Password reset
  requestPasswordReset(email) {
    return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
  },
  resetPassword(token, password) {
    return apiFetch('/auth/reset-password', { method: 'POST', body: { token, password } });
  },
  // Email verification
  resendEmailVerification() {
    return apiFetch('/auth/resend-verification', { method: 'POST' });
  },

  // ── Favourites (per-user, server-persisted) ──────────────────────────────
  // All four require a valid session cookie; logged-out callers get 401.
  getFavourites() {
    return apiFetch('/favourites');
  },
  addFavourite(companyId) {
    return apiFetch('/favourites/' + companyId, { method: 'POST' });
  },
  removeFavourite(companyId) {
    return apiFetch('/favourites/' + companyId, { method: 'DELETE' });
  },
  // Used at login time to lift any localStorage favourites into the user's
  // server-side list. ids is an array of company ids; the server merges them
  // with ON CONFLICT DO NOTHING so it's safe to call multiple times.
  bulkAddFavourites(ids) {
    return apiFetch('/favourites/bulk', { method: 'POST', body: { ids } });
  },
};

window.api = api;
