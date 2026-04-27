// Hive API client — replaces Supabase SDK
// All requests use credentials: 'include' so the httpOnly JWT cookie is sent automatically

const API_BASE = window.API_BASE || '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Erro de servidor'), { status: res.status });
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

  // ── Contact form relay ─────────────────────────────────────────────────────
  contactCompany(companyId, message) {
    return apiFetch('/companies/' + companyId + '/contact', {
      method: 'POST',
      body: { message },
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
};

window.api = api;
