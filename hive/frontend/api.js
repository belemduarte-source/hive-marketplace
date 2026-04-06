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
  // Companies
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

  // Auth
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
};

window.api = api;
