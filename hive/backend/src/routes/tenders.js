// Concursos (pedidos de proposta com anexos) — montado em /api.
//
// Quem lança (qualquer conta) descreve a obra, anexa o projeto ou o caderno de
// encargos, define critérios, escolhe até 10 empresas que os cumprem e convida-
// as. Cada empresa recebe UM email com um link pessoal (token aleatório; na BD
// só fica o hash) para ver o concurso, descarregar os anexos e responder com
// uma proposta — sem conta. Os acessos ficam registados (tender_access_log).
//
// Regras decididas pelo dono (2026-10-29):
//  - convites só a fichas reclamadas OU, das não reclamadas, a empresas
//    portuguesas com NIF de pessoa coletiva (5/6) — o mesmo critério legal da
//    campanha (Lei 41/2004, art. 13.º-A); nunca a quem está em email_optouts;
//  - até 10 empresas por concurso e 3 concursos publicados por dia por conta;
//  - anexos: PDF, imagens, DWG/DXF/IFC, DOCX/XLSX/ODT/ODS, TXT/CSV, até 25 MB
//    cada; 10 por concurso e 5 por proposta; tipo confirmado pelo conteúdo;
//  - retenção: anexos apagados 90 dias depois do fecho; o resto 12 meses.
// Os ficheiros vivem num Vercel Blob PRIVADO (ver ../blob-privado.js).
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../db');
const { requireAuth, optionalAuth, ensureAdminFlag } = require('../middleware/auth');
const { sendBrandedEmail, esc } = require('../email');
const { nomeLegivel } = require('../texto-legivel');
const blob = require('../blob-privado');

const BASE = 'https://www.hivex.pt';
const PLATAFORMA = 7;   // created_by das fichas importadas, ainda não reclamadas
const LIMITES = {
  ficheiros: 10,          // anexos do concurso
  ficheirosProposta: 5,   // anexos de cada proposta
  bytes: 25 * 1024 * 1024,
  empresas: 10,
  porDia: 3,              // concursos publicados por conta em 24 h
  rascunhos: 10,
  diasMax: 180,           // prazo máximo para propostas
};
const RETENCAO = { anexosDias: 90, concursoDias: 365, rascunhoDias: 30 };

// Extensão → [tipo MIME servido, verificação do conteúdo]
const TIPOS = {
  pdf: ['application/pdf', 'pdf'],
  jpg: ['image/jpeg', 'jpeg'],
  jpeg: ['image/jpeg', 'jpeg'],
  png: ['image/png', 'png'],
  webp: ['image/webp', 'webp'],
  dwg: ['image/vnd.dwg', 'dwg'],
  dxf: ['image/vnd.dxf', 'dxf'],
  ifc: ['application/x-step', 'ifc'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'ooxml'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ooxml'],
  odt: ['application/vnd.oasis.opendocument.text', 'odf'],
  ods: ['application/vnd.oasis.opendocument.spreadsheet', 'odf'],
  txt: ['text/plain', 'texto'],
  csv: ['text/csv', 'texto'],
};

// Os primeiros bytes (até 4 KB) têm de corresponder à extensão: um executável
// renomeado para .pdf, ou um ZIP qualquer renomeado para .docx, é recusado.
function _confereConteudo(tipo, b) {
  if (!b || !b.length) return false;
  const a = b.toString('latin1');
  switch (tipo) {
    case 'pdf': { const i = a.indexOf('%PDF-'); return i >= 0 && i < 1024; }
    case 'jpeg': return b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF;
    case 'png': return a.startsWith('\x89PNG\r\n\x1a\n');
    case 'webp': return a.startsWith('RIFF') && a.slice(8, 12) === 'WEBP';
    case 'dwg': return /^AC(1\d{3}|[12]\.\d)/.test(a.slice(0, 6));
    case 'dxf': return a.startsWith('AutoCAD Binary DXF') || (!b.includes(0) && /\bSECTION\b/.test(a));
    case 'ifc': return /^(﻿)?\s*ISO-10303-21;/.test(b.toString('utf8'));
    case 'ooxml': return a.startsWith('PK\x03\x04') && /\[Content_Types\]\.xml|_rels\/\.rels|docProps\/|word\/|xl\//.test(a);
    case 'odf': return a.startsWith('PK\x03\x04') && a.slice(0, 300).includes('application/vnd.oasis.opendocument.');
    case 'texto': return !b.includes(0);
    default: return false;
  }
}

// Mesmo padrão "responde primeiro, envia depois" do resto da API: no Vercel a
// promessa fica registada no contexto do pedido (waitUntil).
function deferEmail(makePromise, label) {
  const task = Promise.resolve()
    .then(makePromise)
    .then(() => console.log(`[email] ${label} sent`))
    .catch(err => console.error(`[email] ${label} failed:`, err && (err.message || err)));
  try {
    const ctxStore = globalThis[Symbol.for('@vercel/request-context')];
    const ctx = ctxStore && typeof ctxStore.get === 'function' ? ctxStore.get() : null;
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(task);
  } catch (_) {}
  return task;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const _txt = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const _hash = (k) => crypto.createHash('sha256').update(String(k)).digest('hex');
const _novoToken = () => crypto.randomBytes(24).toString('base64url');   // 32 caracteres
const _reclamada = (c) => c.created_by != null && Number(c.created_by) !== PLATAFORMA;
const _nifColetiva = (nif) => /^[56]\d{8}$/.test(String(nif || '').replace(/\D/g, ''));
// Pode receber convite por email (decisão do dono, ver o topo do ficheiro)
const _convidavel = (c) => _reclamada(c) || (String(c.country || '').toLowerCase() === 'pt' && _nifColetiva(c.nif));

function _erro(status, msg, extra) {
  const e = new Error(msg);
  e.status = status;
  if (extra) e.extra = extra;
  return e;
}
// Os erros com status saem como JSON { error } (o errorHandler genérico daria
// 500 com mensagem genérica).
function _resp(res, next, e) {
  if (e && e.status && e.status < 500) return res.status(e.status).json({ error: e.message, ...(e.extra || {}) });
  if (e && e.status === 503) return res.status(503).json({ error: e.message });
  return next(e);
}

function _estado(t) {
  if (t.status === 'draft') return 'draft';
  if (t.status === 'closed') return 'closed';
  return new Date(t.deadline).getTime() > Date.now() ? 'open' : 'expired';
}
const _aceitaPropostas = (t) => _estado(t) === 'open';

function _dataLonga(d) {
  try {
    return new Date(d).toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon', dateStyle: 'long', timeStyle: 'short' });
  } catch (_) { return new Date(d).toISOString().slice(0, 16).replace('T', ' '); }
}
function _euros(cents) {
  if (cents == null) return '—';
  try { return (Number(cents) / 100).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }); }
  catch (_) { return (Number(cents) / 100).toFixed(2) + ' €'; }
}
const IVA = { incluido: 'IVA incluído', acresce: 'acresce IVA', isento: 'isento de IVA' };

function _nomeVisivel(nome) {
  return _txt(String(nome || '').replace(/[\\/<>:"|?*]/g, ''), 120) || 'ficheiro';
}
function _nomeSeguro(nome, ext) {
  const base = String(nome || '').replace(/\.[^.]*$/, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 60) || 'ficheiro';
  return base + '.' + ext;
}
function _ext(nome) {
  const m = /\.([A-Za-z0-9]{2,5})$/.exec(String(nome || ''));
  return m ? m[1].toLowerCase() : '';
}

// Datas 'AAAA-MM-DD' que existem mesmo (o Date.parse aceita 2026-02-30 e o
// Postgres não); a validação de intervalo é feita no SQL, no fuso de Lisboa.
const _dataOk = (v) => {
  const s = String(v || '');
  if (!/^(19|20)\d{2}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const _linha = (v, max) => _txt(String(v == null ? '' : v).replace(/\s+/g, ' '), max);   // uma só linha (assuntos de email)
const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|scanner|monitor|curl|wget|python|axios|node-fetch/i;

// Concurso do utilizador (ou qualquer um, para administradores)
async function _meuConcurso(req, id) {
  if (!/^\d+$/.test(String(id))) return null;
  const { rows } = await pool.query(`SELECT * FROM tenders WHERE id = $1`, [id]);
  const t = rows[0];
  if (!t) return null;
  if (String(t.owner_user_id) === String(req.user.id)) return t;
  await ensureAdminFlag(req);
  return req.user.is_admin ? t : null;
}

// Convite a partir do link (token de 32 caracteres) ou, para quem gere a ficha
// convidada e tem sessão, de 'i<id>' (lista "Concursos recebidos").
async function _resolverConvite(ref, req) {
  ref = String(ref || '');
  let rows;
  if (/^[A-Za-z0-9_-]{32}$/.test(ref)) {
    ({ rows } = await pool.query(
      `SELECT i.*, c.created_by AS co_created_by, c.id AS co_id
         FROM tender_invites i LEFT JOIN companies c ON c.id = i.company_id
        WHERE i.token_hash = $1`, [_hash(ref)]));
  } else if (/^i\d{1,15}$/.test(ref) && req.user) {
    ({ rows } = await pool.query(
      `SELECT i.*, c.created_by AS co_created_by, c.id AS co_id
         FROM tender_invites i LEFT JOIN companies c ON c.id = i.company_id
        WHERE i.id = $1`, [ref.slice(1)]));
    const inv = rows[0];
    if (inv) {
      const dono = inv.co_created_by != null && String(inv.co_created_by) === String(req.user.id);
      await ensureAdminFlag(req);
      if (!dono && !req.user.is_admin) rows = [];
      else if (inv.status === 'test' && !req.user.is_admin) rows = [];   // concursos de teste: só administradores
    }
  } else {
    return null;
  }
  const inv = rows && rows[0];
  if (!inv) return null;
  const { rows: ts } = await pool.query(`SELECT * FROM tenders WHERE id = $1`, [inv.tender_id]);
  if (!ts[0] || ts[0].status === 'draft') return null;
  inv.tender = ts[0];
  return inv;
}

// Caminhos do Blob a apagar: entram no "lixo" (tender_blob_trash) ANTES de
// saírem da BD e são apagados já; a manutenção volta a apagá-los depois de os
// URLs de envio (15 min) expirarem — um envio em curso ainda pode aterrar — e
// só os esquece quando o del() tem sucesso. Assim nada fica órfão no Blob.
async function _paraLixo(pathnames) {
  const lista = [...new Set((pathnames || []).filter(Boolean))];
  if (!lista.length) return;
  await pool.query(
    `INSERT INTO tender_blob_trash (pathname) SELECT unnest($1::text[]) ON CONFLICT DO NOTHING`, [lista]);
  try { await blob.apagar(lista); }
  catch (e) { console.error('[concursos] apagar do Blob (fica no lixo):', e.message); }
}

async function _registar(tenderId, inviteId, actor, action, fileId) {
  try {
    await pool.query(
      `INSERT INTO tender_access_log (tender_id, invite_id, actor, action, file_id) VALUES ($1, $2, $3, $4, $5)`,
      [tenderId, inviteId || null, actor, action, fileId || null]);
  } catch (e) { console.error('[concursos] registo falhou:', e.message); }
}

function _ficheiroPublico(f) {
  return { id: Number(f.id), name: f.filename, size: Number(f.size_bytes), mime: f.mime, status: f.status };
}

// ── Configuração pública (o frontend mostra ou esconde os anexos) ─────────────
router.get('/tenders/config', (req, res) => {
  res.set('Cache-Control', 'public, max-age=0, s-maxage=300');
  res.json({
    anexos: blob.configurado(),
    limites: {
      ficheiros: LIMITES.ficheiros, ficheirosProposta: LIMITES.ficheirosProposta,
      mb: LIMITES.bytes / 1024 / 1024, empresas: LIMITES.empresas, porDia: LIMITES.porDia,
      diasMax: LIMITES.diasMax,
    },
    extensoes: Object.keys(TIPOS),
  });
});

// ── Criar / editar (rascunho) ─────────────────────────────────────────────────
function _camposConcurso(b) {
  const out = {};
  if ('title' in b) out.title = _linha(b.title, 140);   // vai para o assunto dos emails
  if ('description' in b) out.description = _txt(b.description, 8000);
  if ('city' in b) out.city = _linha(b.city, 120) || null;
  if ('country' in b) out.country = /^[a-z]{2}$/i.test(String(b.country || '')) ? String(b.country).toLowerCase() : 'pt';
  if ('lat' in b || 'lng' in b) {
    const lat = Number(b.lat), lng = Number(b.lng);
    const ok = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    out.lat = ok ? lat : null;
    out.lng = ok ? lng : null;
  }
  if ('budget' in b) out.budget = _txt(b.budget, 60) || null;
  if ('start_date' in b) out.start_date = _dataOk(b.start_date) ? b.start_date : null;
  if ('deadline' in b) {
    if (b.deadline && !_dataOk(b.deadline)) throw _erro(400, 'Data de prazo inválida.');
    out.deadline_date = b.deadline || null;
  }
  if ('phone' in b) out.owner_phone = _txt(b.phone, 40) || null;
  if ('criteria' in b) out.criteria = _criterios(b.criteria);
  return out;
}

function _criterios(c) {
  c = c && typeof c === 'object' ? c : {};
  const sectors = (Array.isArray(c.sectors) ? c.sectors : [])
    .map(s => String(s || '').toLowerCase()).filter(s => /^[a-z_]{2,40}$/.test(s)).slice(0, 12);
  const radius = Number(c.radius);
  return {
    sectors: [...new Set(sectors)],
    radius: [10, 25, 50, 100, 200].includes(radius) ? radius : 0,
    alvara: !!c.alvara,
    claimed: !!c.claimed,
  };
}

// Prazo = fim do dia escolhido, em Lisboa
const _SQL_PRAZO = `(($1::date + time '23:59:59') AT TIME ZONE 'Europe/Lisbon')`;

async function _gravarCampos(id, campos) {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(campos)) {
    if (k === 'deadline_date' && !v) {
      sets.push(`deadline = NULL`);
    } else if (k === 'deadline_date') {
      vals.push(v);
      sets.push(`deadline = (($${vals.length}::date + time '23:59:59') AT TIME ZONE 'Europe/Lisbon')`);
    } else if (k === 'criteria') {
      vals.push(JSON.stringify(v));
      sets.push(`criteria = $${vals.length}::jsonb`);
    } else {
      vals.push(v);
      sets.push(`${k} = $${vals.length}`);
    }
  }
  if (!sets.length) return;
  vals.push(id);
  await pool.query(`UPDATE tenders SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${vals.length}`, vals);
}

router.post('/tenders', requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    const { rows: n } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM tenders WHERE owner_user_id = $1 AND status = 'draft'`, [req.user.id]);
    if (n[0].n >= LIMITES.rascunhos) {
      throw _erro(429, 'Tem demasiados rascunhos. Publique ou apague um antes de criar outro.');
    }
    let teste = false;
    if (b.test) {
      await ensureAdminFlag(req);
      teste = !!req.user.is_admin;
    }
    const { rows: me } = await pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [req.user.id]);
    if (!me[0]) throw _erro(401, 'Sessão inválida');
    const campos = _camposConcurso(b);
    const { rows } = await pool.query(
      `INSERT INTO tenders (owner_user_id, owner_name, owner_email, title, description, is_test)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [me[0].id, _txt(me[0].name, 80) || 'Cliente', String(me[0].email).toLowerCase(),
       campos.title || '', campos.description || '', teste]);
    delete campos.title; delete campos.description;
    await _gravarCampos(rows[0].id, campos);
    res.status(201).json(await _detalhe(rows[0].id));
  } catch (e) { _resp(res, next, e); }
});

router.patch('/tenders/:id(\\d+)', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    const b = req.body || {};
    const campos = _camposConcurso(b);
    if (t.status !== 'draft') {
      // Publicado: só se pode PROLONGAR o prazo (nunca encurtar) e só até ao fecho.
      if (t.status === 'closed') throw _erro(409, 'O concurso já foi fechado.');
      if (t.purged_at) throw _erro(409, 'Este concurso já foi arquivado e os anexos apagados.');
      const permitido = Object.keys(campos).every(k => k === 'deadline_date');
      if (!permitido || !campos.deadline_date) throw _erro(409, 'Depois de publicado só pode prolongar o prazo.');
      const { rows } = await pool.query(
        `SELECT ${_SQL_PRAZO} > $2::timestamptz AS depois,
                $1::date <= (now() AT TIME ZONE 'Europe/Lisbon')::date + $3::int AS dentro`,
        [campos.deadline_date, t.deadline, LIMITES.diasMax]);
      if (!rows[0].depois) throw _erro(400, 'O novo prazo tem de ser depois do atual.');
      if (!rows[0].dentro) throw _erro(400, `O prazo pode ir no máximo até ${LIMITES.diasMax} dias.`);
      await pool.query(
        `UPDATE tenders SET deadline = ${_SQL_PRAZO}, deadline_notified_at = NULL, updated_at = NOW() WHERE id = $2`,
        [campos.deadline_date, t.id]);
      await _registar(t.id, null, 'owner', 'deadline');
      return res.json(await _detalhe(t.id));
    }
    if ('test' in b) {
      await ensureAdminFlag(req);
      if (req.user.is_admin) campos.is_test = !!b.test;
    }
    await _gravarCampos(t.id, campos);
    res.json(await _detalhe(t.id));
  } catch (e) { _resp(res, next, e); }
});

router.delete('/tenders/:id(\\d+)', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    if (t.status !== 'draft') throw _erro(409, 'Só pode apagar rascunhos. Um concurso publicado pode ser fechado.');
    const { rows: fs } = await pool.query(`SELECT pathname FROM tender_files WHERE tender_id = $1`, [t.id]);
    await _paraLixo(fs.map(f => f.pathname));
    await pool.query(`DELETE FROM tenders WHERE id = $1`, [t.id]);
    res.json({ ok: true });
  } catch (e) { _resp(res, next, e); }
});

// ── Listas ────────────────────────────────────────────────────────────────────
router.get('/tenders/mine', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.title, t.city, t.status, t.deadline, t.published_at, t.closed_at, t.created_at, t.is_test,
              (SELECT COUNT(*) FROM tender_invites i WHERE i.tender_id = t.id)::int AS convites,
              (SELECT COUNT(*) FROM tender_invites i WHERE i.tender_id = t.id AND i.first_viewed_at IS NOT NULL)::int AS vistas,
              (SELECT COUNT(*) FROM tender_proposals p WHERE p.tender_id = t.id AND p.status <> 'withdrawn')::int AS propostas
         FROM tenders t WHERE t.owner_user_id = $1
        ORDER BY t.created_at DESC LIMIT 100`, [req.user.id]);
    res.json(rows.map(r => ({ ...r, estado: _estado(r) })));
  } catch (e) { next(e); }
});

// Convites recebidos pelas empresas que o utilizador gere
router.get('/tenders/received', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT i.id, i.company_id, i.company_name, i.first_viewed_at, i.declined_at,
              t.id AS tender_id, t.title, t.city, t.deadline, t.status, p.status AS proposal_status
         FROM tender_invites i
         JOIN tenders t ON t.id = i.tender_id
         JOIN companies c ON c.id = i.company_id
         LEFT JOIN tender_proposals p ON p.invite_id = i.id
        WHERE c.created_by = $1 AND t.status <> 'draft' AND NOT t.is_test
        ORDER BY t.deadline DESC LIMIT 50`, [req.user.id]);
    res.json(rows.map(r => ({ ...r, ref: 'i' + r.id, estado: _estado(r) })));
  } catch (e) { next(e); }
});

// ── Detalhe para quem lançou ──────────────────────────────────────────────────
async function _detalhe(id) {
  const { rows: ts } = await pool.query(`SELECT * FROM tenders WHERE id = $1`, [id]);
  const t = ts[0];
  if (!t) return null;
  const [{ rows: files }, { rows: invites }, { rows: props }, { rows: log }, { rows: dl }] = await Promise.all([
    pool.query(`SELECT * FROM tender_files WHERE tender_id = $1 AND status <> 'deleted' ORDER BY id`, [id]),
    pool.query(
      `SELECT i.id, i.company_id, i.company_name, i.status, i.sent_at, i.first_viewed_at, i.last_viewed_at,
              i.views, i.declined_at, i.decline_reason, i.test_token, i.created_at, c.city
         FROM tender_invites i LEFT JOIN companies c ON c.id = i.company_id
        WHERE i.tender_id = $1 ORDER BY i.id`, [id]),
    pool.query(`SELECT * FROM tender_proposals WHERE tender_id = $1 ORDER BY submitted_at`, [id]),
    pool.query(
      `SELECT l.created_at, l.actor, l.action, l.invite_id, i.company_name, f.filename
         FROM tender_access_log l
         LEFT JOIN tender_invites i ON i.id = l.invite_id
         LEFT JOIN tender_files f ON f.id = l.file_id
        WHERE l.tender_id = $1 ORDER BY l.created_at DESC LIMIT 150`, [id]),
    pool.query(
      `SELECT invite_id, COUNT(DISTINCT file_id)::int AS n FROM tender_access_log
        WHERE tender_id = $1 AND action = 'download' AND invite_id IS NOT NULL GROUP BY invite_id`, [id]),
  ]);
  const downloads = new Map(dl.map(r => [String(r.invite_id), r.n]));
  const propPorConvite = new Map(props.map(p => [String(p.invite_id), p]));
  const ficheirosPorConvite = new Map();
  files.filter(f => f.invite_id != null && f.status === 'ready').forEach(f => {
    const k = String(f.invite_id);
    if (!ficheirosPorConvite.has(k)) ficheirosPorConvite.set(k, []);
    ficheirosPorConvite.get(k).push(_ficheiroPublico(f));
  });
  const nomeConvite = new Map(invites.map(i => [String(i.id), i]));
  return {
    tender: {
      id: Number(t.id), title: t.title, description: t.description, city: t.city, country: t.country,
      lat: t.lat, lng: t.lng, budget: t.budget, start_date: t.start_date, deadline: t.deadline,
      phone: t.owner_phone, status: t.status, estado: _estado(t), is_test: t.is_test,
      published_at: t.published_at, closed_at: t.closed_at, created_at: t.created_at,
      criteria: t.criteria || {}, owner_name: t.owner_name,
    },
    files: files.filter(f => f.invite_id == null).map(_ficheiroPublico),
    invites: invites.map(i => {
      const p = propPorConvite.get(String(i.id));
      return {
        id: Number(i.id), company_id: i.company_id != null ? Number(i.company_id) : null,
        company_name: i.company_name, city: i.city || null, status: i.status, sent_at: i.sent_at,
        first_viewed_at: i.first_viewed_at, last_viewed_at: i.last_viewed_at, views: i.views,
        downloads: downloads.get(String(i.id)) || 0,
        declined_at: i.declined_at, decline_reason: i.decline_reason,
        // Só nos concursos de teste (administradores): o link para abrir como empresa
        link: t.is_test && i.test_token ? `${BASE}/?concurso=${i.test_token}` : null,
        proposal: p ? { id: Number(p.id), status: p.status, price_cents: p.price_cents != null ? Number(p.price_cents) : null, submitted_at: p.submitted_at } : null,
      };
    }),
    proposals: props.map(p => {
      const inv = nomeConvite.get(String(p.invite_id)) || {};
      return {
        id: Number(p.id), invite_id: Number(p.invite_id), company_id: inv.company_id != null ? Number(inv.company_id) : null,
        company_name: inv.company_name || '', price_cents: p.price_cents != null ? Number(p.price_cents) : null,
        vat: p.vat, duration: p.duration, validity_days: p.validity_days, notes: p.notes,
        contact_name: p.contact_name, contact_email: p.contact_email, contact_phone: p.contact_phone,
        status: p.status, submitted_at: p.submitted_at, updated_at: p.updated_at, decided_at: p.decided_at,
        files: ficheirosPorConvite.get(String(p.invite_id)) || [],
      };
    }),
    log: log.map(l => ({
      at: l.created_at, actor: l.actor, action: l.action,
      company_name: l.company_name || null, file_name: l.filename || null,
    })),
    limites: LIMITES,
  };
}

router.get('/tenders/:id(\\d+)', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    res.set('Cache-Control', 'private, no-store');
    res.json(await _detalhe(t.id));
  } catch (e) { _resp(res, next, e); }
});

// ── Anexos ────────────────────────────────────────────────────────────────────
// 1) pedir URL de envio → 2) o browser envia direto para o Blob → 3) confirmar.
async function _pedirEnvio({ tenderId, inviteId, nome, tamanho, max }) {
  if (!blob.configurado()) throw _erro(503, 'Os anexos ainda não estão disponíveis.');
  const ext = _ext(nome);
  const tipo = TIPOS[ext];
  if (!tipo) throw _erro(400, 'Tipo de ficheiro não aceite. Aceites: PDF, imagens, DWG, DXF, IFC, DOCX, XLSX, ODT, ODS, TXT e CSV.');
  const size = Number(tamanho);
  if (!Number.isFinite(size) || size <= 0) throw _erro(400, 'Ficheiro vazio.');
  if (size > LIMITES.bytes) throw _erro(400, `O ficheiro passa de ${LIMITES.bytes / 1024 / 1024} MB.`);
  const { rows: cnt } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM tender_files
      WHERE tender_id = $1 AND status <> 'deleted' AND invite_id IS NOT DISTINCT FROM $2`,
    [tenderId, inviteId || null]);
  if (cnt[0].n >= max) throw _erro(400, `Máximo de ${max} ficheiros.`);
  const pasta = inviteId ? `p${inviteId}/` : '';
  const pathname = `concursos/${tenderId}/${pasta}${crypto.randomBytes(8).toString('hex')}/${_nomeSeguro(nome, ext)}`;
  const { rows } = await pool.query(
    `INSERT INTO tender_files (tender_id, invite_id, pathname, filename, mime, size_bytes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [tenderId, inviteId || null, pathname, _nomeVisivel(nome), tipo[0], size]);
  let upload;
  try {
    upload = await blob.urlDeEnvio({ pathname, mime: tipo[0], maxBytes: LIMITES.bytes });
  } catch (e) {
    await pool.query(`DELETE FROM tender_files WHERE id = $1`, [rows[0].id]);
    console.error('[concursos] URL de envio falhou:', e.message);
    throw _erro(503, 'Não foi possível preparar o envio. Tente de novo dentro de momentos.');
  }
  return { file: _ficheiroPublico(rows[0]), upload };
}

async function _confirmarEnvio(f) {
  if (f.status === 'ready') return _ficheiroPublico(f);
  const v = await blob.verificar(f.pathname);
  if (!v) throw _erro(409, 'O envio ainda não terminou. Tente de novo.');
  const tipo = TIPOS[_ext(f.pathname)];
  const recusa = async (msg) => {
    await _paraLixo([f.pathname]);
    await pool.query(`DELETE FROM tender_files WHERE id = $1`, [f.id]);
    throw _erro(400, msg);
  };
  if (v.size <= 0 || v.size > LIMITES.bytes) await recusa('O ficheiro está vazio ou é demasiado grande.');
  if (!tipo || !_confereConteudo(tipo[1], v.amostra)) {
    await recusa(`O conteúdo de «${f.filename}» não corresponde a um ficheiro .${_ext(f.pathname)}.`);
  }
  const { rows } = await pool.query(
    `UPDATE tender_files SET status = 'ready', size_bytes = $2 WHERE id = $1 RETURNING *`, [f.id, v.size]);
  return _ficheiroPublico(rows[0]);
}

async function _apagarFicheiro(f) {
  await _paraLixo([f.pathname]);
  await pool.query(`DELETE FROM tender_files WHERE id = $1`, [f.id]);
}

router.post('/tenders/:id(\\d+)/files', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    if (!['draft', 'open'].includes(_estado(t))) throw _erro(409, 'O concurso já não aceita anexos.');
    const b = req.body || {};
    res.status(201).json(await _pedirEnvio({ tenderId: t.id, nome: b.name, tamanho: b.size, max: LIMITES.ficheiros }));
  } catch (e) { _resp(res, next, e); }
});

router.post('/tenders/:id(\\d+)/files/:fileId(\\d+)/done', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    const { rows } = await pool.query(
      `SELECT * FROM tender_files WHERE id = $1 AND tender_id = $2 AND invite_id IS NULL AND status <> 'deleted'`,
      [req.params.fileId, t.id]);
    if (!rows[0]) throw _erro(404, 'Ficheiro não encontrado');
    res.json({ file: await _confirmarEnvio(rows[0]) });
  } catch (e) { _resp(res, next, e); }
});

router.delete('/tenders/:id(\\d+)/files/:fileId(\\d+)', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    const { rows } = await pool.query(
      `SELECT * FROM tender_files WHERE id = $1 AND tender_id = $2 AND invite_id IS NULL AND status <> 'deleted'`,
      [req.params.fileId, t.id]);
    const f = rows[0];
    if (!f) throw _erro(404, 'Ficheiro não encontrado');
    // Depois de os convites saírem, os anexos fazem parte do concurso.
    if (t.status !== 'draft' && f.status === 'ready') throw _erro(409, 'Os anexos de um concurso publicado já não podem ser retirados.');
    await _apagarFicheiro(f);
    res.json({ ok: true });
  } catch (e) { _resp(res, next, e); }
});

// Download: quem lançou (sessão) ou empresa convidada (?ref=). Redireciona para
// um link temporário (10 min) do Blob privado. Downloads das empresas ficam
// registados.
router.get('/tenders/files/:fileId(\\d+)', optionalAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.*, t.owner_user_id FROM tender_files f JOIN tenders t ON t.id = f.tender_id
        WHERE f.id = $1 AND f.status = 'ready'`, [req.params.fileId]);
    const f = rows[0];
    const naoHa = () => res.status(404).type('html').send(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<div style="font-family:Arial,sans-serif;max-width:520px;margin:60px auto;padding:0 20px;color:#374151;line-height:1.6">' +
      '<h2>Ficheiro indisponível</h2><p>O ficheiro não existe, já foi apagado (os anexos são guardados 90 dias depois do fecho do concurso) ou não tem acesso a ele.</p>' +
      '<p><a href="https://www.hivex.pt" style="color:#2563eb">Voltar à Hivex</a></p></div>');
    if (!f) return naoHa();
    let convite = null;
    let ok = false;
    if (req.user && String(f.owner_user_id) === String(req.user.id)) ok = true;
    if (!ok && req.query.ref) {
      convite = await _resolverConvite(req.query.ref, req);
      ok = !!convite && String(convite.tender_id) === String(f.tender_id) &&
        (f.invite_id == null || String(f.invite_id) === String(convite.id));
    }
    if (!ok && req.user) {
      await ensureAdminFlag(req);
      ok = !!req.user.is_admin;
    }
    if (!ok) return naoHa();
    if (convite) await _registar(f.tender_id, convite.id, 'company', 'download', f.id);
    const url = await blob.urlDeDownload(f.pathname, { descarregar: !/^(application\/pdf|image\/(jpeg|png|webp))$/.test(f.mime) });
    res.set('Cache-Control', 'private, no-store');
    res.redirect(302, url);
  } catch (e) { _resp(res, next, e); }
});

// ── Empresas que cumprem os critérios ─────────────────────────────────────────
// Uma CTE com os filtros; daí saem as convidáveis mais próximas (lista) e as
// contagens de TODAS as que cumprem (para o "N empresas cumprem; M não podem
// receber convite" não ficar limitado às mais próximas). A regra "convidável"
// é a mesma de _convidavel() — manter as duas iguais.
const _SQL_CANDIDATAS = `
  WITH base AS (
    SELECT c.id, c.name, c.city, c.country, c.sector, c.sectors, c.created_by, lower(trim(c.email)) AS email,
           (c.alvara IS NOT NULL AND c.alvara <> '') AS tem_alvara,
           (c.logo IS NOT NULL) AS tem_logo,
           CASE WHEN c.logo IS NOT NULL THEN extract(epoch from c.updated_at)::bigint END AS logo_v,
           (2 * 6371 * asin(sqrt(
              power(sin(radians(c.lat - $1) / 2), 2) +
              cos(radians($1)) * cos(radians(c.lat)) * power(sin(radians(c.lng - $2) / 2), 2)))) AS km,
           (coalesce(trim(c.email), '') <> '') AS tem_email,
           EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = lower(trim(c.email))) AS recusou,
           ((c.created_by IS NOT NULL AND c.created_by <> ${PLATAFORMA})
             OR (lower(coalesce(c.country, '')) = 'pt'
                 AND regexp_replace(coalesce(c.nif, ''), '[^0-9]', '', 'g') ~ '^[56][0-9]{8}$')) AS convidavel
      FROM companies c
     WHERE c.status = 'approved'
       AND (c.sector = ANY($3::text[]) OR c.sectors && $3::text[])
       AND ($4::float8 IS NULL OR (c.lat BETWEEN $1 - $5::float8 AND $1 + $5::float8
                                AND c.lng BETWEEN $2 - $6::float8 AND $2 + $6::float8))
       AND ($4::float8 IS NOT NULL OR c.country = $7)
       AND ($8::boolean IS NOT TRUE OR (c.alvara IS NOT NULL AND c.alvara <> ''))
       AND ($9::boolean IS NOT TRUE OR (c.created_by IS NOT NULL AND c.created_by <> ${PLATAFORMA}))
  ), dentro AS (
    SELECT * FROM base WHERE ($4::float8 IS NULL OR km <= $4::float8)
  )`;

async function _candidatas(t, crit) {
  if (t.lat == null || t.lng == null) throw _erro(400, 'Indique primeiro a localidade da obra.');
  if (!crit.sectors.length) throw _erro(400, 'Escolha pelo menos uma área de atividade.');
  const lat = Number(t.lat), lng = Number(t.lng);
  const r = crit.radius || null;
  const dLat = r ? r / 111 : null;
  const dLng = r ? r / (111 * Math.max(0.1, Math.cos(lat * Math.PI / 180))) : null;
  const params = [lat, lng, crit.sectors, r, dLat, dLng, t.country || 'pt', crit.alvara, crit.claimed];
  const [{ rows }, { rows: cont }] = await Promise.all([
    pool.query(`${_SQL_CANDIDATAS}
      SELECT * FROM dentro WHERE tem_email AND NOT recusou AND convidavel ORDER BY km ASC LIMIT 150`, params),
    pool.query(`${_SQL_CANDIDATAS}
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE NOT tem_email)::int AS sem_email,
             COUNT(*) FILTER (WHERE tem_email AND recusou)::int AS recusou,
             COUNT(*) FILTER (WHERE tem_email AND NOT recusou AND NOT convidavel)::int AS nao_convidavel,
             COUNT(DISTINCT email) FILTER (WHERE tem_email AND NOT recusou AND convidavel)::int AS convidaveis
        FROM dentro`, params),
  ]);
  return { rows, contagens: cont[0] };
}

router.get('/tenders/:id(\\d+)/candidates', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    const crit = _criterios({
      sectors: String(req.query.sectors || '').split(',').filter(Boolean),
      radius: req.query.radius, alvara: req.query.alvara === '1', claimed: req.query.claimed === '1',
    });
    const { rows, contagens } = await _candidatas(t, crit);
    const { rows: ja } = await pool.query(`SELECT company_id FROM tender_invites WHERE tender_id = $1`, [t.id]);
    const convidadas = new Set(ja.map(r => String(r.company_id)));
    const emails = new Set();
    const lista = [];
    for (const c of rows) {
      if (emails.has(c.email)) continue;   // o mesmo email noutra ficha: um convite chega
      emails.add(c.email);
      if (lista.length >= 60) break;
      lista.push({
        id: Number(c.id), name: nomeLegivel(c.name, c.country), city: c.city, country: c.country,
        sector: c.sector, sectors: c.sectors || [], km: Math.round(Number(c.km) * 10) / 10,
        alvara: !!c.tem_alvara, claimed: _reclamada(c),
        logo: c.tem_logo ? `/api/companies/${c.id}/logo?v=${c.logo_v}` : null,
        invited: convidadas.has(String(c.id)),
      });
    }
    res.json({
      candidates: lista,
      total: contagens.total,
      convidaveis: contagens.convidaveis,
      fora: { semEmail: contagens.sem_email, recusou: contagens.recusou, naoConvidavel: contagens.nao_convidavel },
      criteria: crit,
    });
  } catch (e) { _resp(res, next, e); }
});

// ── Publicar / convidar ───────────────────────────────────────────────────────
function _criteriosTexto(crit) {
  const partes = [];
  if (crit && crit.radius) partes.push(`até ${crit.radius} km da obra`);
  if (crit && crit.alvara) partes.push('com alvará IMPIC');
  return partes.join(', ');
}

async function _emailConvite(t, conv, token, nFicheiros) {
  const link = `${BASE}/?concurso=${token}`;
  const optout = `${BASE}/api/tender-invites/${token}/optout`;
  const linhas = [
    ['Obra', esc(t.title)],
    ['Local', esc(t.city || '—')],
    ['Prazo para propostas', esc(_dataLonga(t.deadline))],
    ['Orçamento indicativo', esc(t.budget || 'a definir')],
    ['Documentos', nFicheiros ? `${nFicheiros} anexo${nFicheiros === 1 ? '' : 's'}` : 'sem anexos'],
  ];
  const criterios = _criteriosTexto(t.criteria);
  await sendBrandedEmail({
    to: conv.email,
    replyTo: t.owner_email,
    subject: `Pedido de proposta: ${t.title}${t.city ? ' — ' + t.city : ''}`,
    title: 'Hivex — Pedido de proposta',
    headers: {
      'List-Unsubscribe': `<${optout}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    bodyHtml: `
      <p style="margin-top:0">Olá, equipa da <strong>${esc(conv.company_name)}</strong>,</p>
      <p><strong>${esc(t.owner_name)}</strong> está a pedir propostas para uma obra e escolheu a sua empresa na Hivex.</p>
      <table style="width:100%;border-collapse:collapse;margin:14px 0">
        ${linhas.map(([k, v], i) => `<tr${i % 2 ? '' : ' style="background:#f9fafb"'}><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb;width:38%">${k}</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${v}</td></tr>`).join('')}
      </table>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:18px"><p style="margin:0;white-space:pre-wrap">${esc(String(t.description || '').slice(0, 700))}${String(t.description || '').length > 700 ? '…' : ''}</p></div>
      <p style="text-align:center;margin:26px 0">
        <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Ver o concurso e responder</a>
      </p>
      <p style="color:#4b5563;font-size:14px">Não precisa de conta e não paga nada. Pelo link vê os documentos, envia a sua proposta (preço, prazo e anexos) ou indica que não vai concorrer. As outras empresas convidadas não veem a sua proposta.</p>
      <p style="color:#9ca3af;font-size:12px;margin-bottom:0">Recebeu este convite porque ${esc(t.owner_name)} escolheu a ${esc(conv.company_name)} na Hivex para este pedido${criterios ? ' (' + esc(criterios) + ')' : ''}. É um convite deste cliente, não publicidade, e o link é pessoal. <a href="${optout}" style="color:#9ca3af">Não quero receber convites de concursos</a>.</p>`,
  });
}

router.post('/tenders/:id(\\d+)/publish', requireAuth, async (req, res, next) => {
  try {
    const t0 = await _meuConcurso(req, req.params.id);
    if (!t0) throw _erro(404, 'Concurso não encontrado');
    await ensureAdminFlag(req);
    const b = req.body || {};
    const ids = [...new Set((Array.isArray(b.companyIds) ? b.companyIds : [])
      .map(Number).filter(n => Number.isInteger(n) && n > 0))];
    if (!ids.length) throw _erro(400, 'Escolha pelo menos uma empresa.');
    if (ids.length > LIMITES.empresas) throw _erro(400, `Pode convidar no máximo ${LIMITES.empresas} empresas por concurso.`);
    // Elegibilidade (só lê companies e email_optouts — pode ficar fora da transação)
    const { rows: cos } = await pool.query(
      `SELECT c.id, c.name, c.email, c.nif, c.country, c.created_by,
              EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = lower(trim(c.email))) AS recusou
         FROM companies c WHERE c.id = ANY($1::bigint[]) AND c.status = 'approved'`, [ids]);
    const ignoradas = [];
    const elegiveis = [];
    for (const c of cos) {
      const email = String(c.email || '').trim().toLowerCase();
      const nome = nomeLegivel(c.name, c.country);
      if (!EMAIL_RE.test(email)) ignoradas.push({ id: Number(c.id), name: nome, motivo: 'sem email' });
      else if (c.recusou) ignoradas.push({ id: Number(c.id), name: nome, motivo: 'não aceita convites' });
      else if (!_convidavel(c)) ignoradas.push({ id: Number(c.id), name: nome, motivo: 'ficha por reclamar' });
      else elegiveis.push({ ...c, name: nome, email });
    }

    // Transação: o bloqueio por conta serializa publicações em paralelo (limite
    // diário, publicação dupla) e a linha do concurso fica presa (limite de 10).
    // Tudo é verificado de novo cá dentro; os emails só saem depois do COMMIT.
    let t, primeira;
    const criados = [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock($1::bigint)', [t0.owner_user_id]);
      const { rows: ts } = await client.query('SELECT * FROM tenders WHERE id = $1 FOR UPDATE', [t0.id]);
      t = ts[0];
      if (!t) throw _erro(404, 'Concurso não encontrado');
      const estado = _estado(t);
      if (estado === 'closed') throw _erro(409, 'O concurso já foi fechado.');
      if (estado === 'expired') throw _erro(409, 'O prazo para propostas já terminou.');
      primeira = t.status === 'draft';
      if (primeira) {
        if (String(t.title || '').length < 5) throw _erro(400, 'Dê um título ao concurso (pelo menos 5 caracteres).');
        if (String(t.description || '').length < 30) throw _erro(400, 'Descreva a obra com mais detalhe (pelo menos 30 caracteres).');
        if (t.lat == null || t.lng == null) throw _erro(400, 'Indique a localidade da obra.');
        if (!t.deadline) throw _erro(400, 'Escolha o prazo para as propostas.');
        const { rows: p } = await client.query(
          `SELECT ($1::timestamptz AT TIME ZONE 'Europe/Lisbon')::date >= (now() AT TIME ZONE 'Europe/Lisbon')::date + 1 AS cedo,
                  ($1::timestamptz AT TIME ZONE 'Europe/Lisbon')::date <= (now() AT TIME ZONE 'Europe/Lisbon')::date + $2::int AS dentro`,
          [t.deadline, LIMITES.diasMax]);
        if (!p[0].cedo) throw _erro(400, 'O prazo tem de ser pelo menos amanhã, para as empresas terem tempo de responder.');
        if (!p[0].dentro) throw _erro(400, `O prazo pode ir no máximo até ${LIMITES.diasMax} dias.`);
        const { rows: pend } = await client.query(
          `SELECT COUNT(*)::int AS n FROM tender_files WHERE tender_id = $1 AND invite_id IS NULL AND status = 'pending'`, [t.id]);
        if (pend[0].n) throw _erro(409, 'Ainda há anexos a enviar. Espere que terminem ou retire-os.');
        if (!req.user.is_admin) {
          const { rows: dia } = await client.query(
            `SELECT COUNT(*)::int AS n FROM tenders
              WHERE owner_user_id = $1 AND published_at > NOW() - INTERVAL '24 hours'`, [t.owner_user_id]);
          if (dia[0].n >= LIMITES.porDia) {
            throw _erro(429, `Pode publicar no máximo ${LIMITES.porDia} concursos por dia. Tente de novo amanhã.`);
          }
        }
      }
      const { rows: ja } = await client.query(
        `SELECT company_id, lower(email) AS email FROM tender_invites WHERE tender_id = $1`, [t.id]);
      const emails = new Set(ja.map(r => r.email));
      const jaIds = new Set(ja.map(r => String(r.company_id)));
      const validas = [];
      for (const c of elegiveis) {
        if (jaIds.has(String(c.id))) ignoradas.push({ id: Number(c.id), name: c.name, motivo: 'já convidada' });
        else if (emails.has(c.email)) ignoradas.push({ id: Number(c.id), name: c.name, motivo: 'email repetido' });
        else { emails.add(c.email); validas.push(c); }
      }
      if (!validas.length) throw _erro(400, 'Nenhuma das empresas escolhidas pode receber convites.', { ignoradas });
      if (ja.length + validas.length > LIMITES.empresas) {
        throw _erro(400, `Pode convidar no máximo ${LIMITES.empresas} empresas por concurso.`);
      }
      if (primeira) {
        const crit = 'criteria' in b ? _criterios(b.criteria) : (t.criteria || {});
        const { rows: me } = await client.query(`SELECT name, email FROM users WHERE id = $1`, [t.owner_user_id]);
        await client.query(
          `UPDATE tenders SET status = 'open', published_at = NOW(), criteria = $2::jsonb,
                  owner_name = COALESCE($3, owner_name), owner_email = COALESCE($4, owner_email), updated_at = NOW()
            WHERE id = $1`,
          [t.id, JSON.stringify(crit), me[0] ? _txt(me[0].name, 80) || null : null, me[0] ? String(me[0].email).toLowerCase() : null]);
      } else {
        await client.query(`UPDATE tenders SET updated_at = NOW() WHERE id = $1`, [t.id]);
      }
      for (const c of validas) {
        const token = _novoToken();
        const { rows } = await client.query(
          `INSERT INTO tender_invites (tender_id, company_id, company_name, email, token_hash, status, test_token)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (tender_id, company_id) DO NOTHING RETURNING id`,
          [t.id, c.id, c.name, c.email, _hash(token), t.is_test ? 'test' : 'pending', t.is_test ? token : null]);
        if (rows[0]) criados.push({ id: rows[0].id, token, company_name: c.name, email: c.email });
      }
      await client.query('COMMIT');
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch (_) {}
      throw e;
    } finally {
      client.release();
    }
    await _registar(t.id, null, 'owner', primeira ? 'publish' : 'invite');

    if (!t.is_test && criados.length) {
      const { rows: ts } = await pool.query(`SELECT * FROM tenders WHERE id = $1`, [t.id]);
      const tt = ts[0];
      const { rows: nf } = await pool.query(
        `SELECT COUNT(*)::int AS n FROM tender_files WHERE tender_id = $1 AND invite_id IS NULL AND status = 'ready'`, [t.id]);
      deferEmail(async () => {
        for (const c of criados) {
          try {
            await _emailConvite(tt, c, c.token, nf[0].n);
            await pool.query(`UPDATE tender_invites SET status = 'sent', sent_at = NOW() WHERE id = $1`, [c.id]);
          } catch (e) {
            console.error('[concursos] convite falhou:', c.id, e.message);
            await pool.query(`UPDATE tender_invites SET status = 'failed' WHERE id = $1`, [c.id]).catch(() => {});
          }
        }
        if (primeira) {
          await sendBrandedEmail({
            to: tt.owner_email,
            subject: `[Hivex] O seu concurso foi enviado a ${criados.length} empresa${criados.length === 1 ? '' : 's'}`,
            title: 'Hivex — Concurso enviado',
            bodyHtml: `
              <p style="margin-top:0">Olá ${esc(tt.owner_name)},</p>
              <p>O concurso <strong>${esc(tt.title)}</strong> foi enviado a ${criados.length} empresa${criados.length === 1 ? '' : 's'}. As propostas podem chegar até <strong>${esc(_dataLonga(tt.deadline))}</strong>; avisamos por email a cada proposta nova.</p>
              <p style="text-align:center;margin:24px 0"><a href="${BASE}/?concursos=${tt.id}" style="display:inline-block;background:#2563eb;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700">Ver o painel do concurso</a></p>
              <p style="color:#6b7280;font-size:13px;margin-bottom:0">No painel vê quem abriu o concurso e descarregou os anexos, compara as propostas e aceita ou recusa cada uma.</p>`,
          });
        }
      }, `concurso ${t.id}: ${criados.length} convites`);
    }
    res.json({ ok: true, invited: criados.length, ignoradas, detail: await _detalhe(t.id) });
  } catch (e) { _resp(res, next, e); }
});

// ── Decidir propostas / fechar ────────────────────────────────────────────────
router.post('/tenders/:id(\\d+)/proposals/:pid(\\d+)/decision', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    const decisao = String((req.body && req.body.decision) || '');
    if (!['accepted', 'declined'].includes(decisao)) throw _erro(400, 'Decisão inválida.');
    const { rows } = await pool.query(
      `SELECT p.*, i.company_name, i.email AS invite_email, i.company_id FROM tender_proposals p
         JOIN tender_invites i ON i.id = p.invite_id
        WHERE p.id = $1 AND p.tender_id = $2`, [req.params.pid, t.id]);
    const p = rows[0];
    if (!p) throw _erro(404, 'Proposta não encontrada');
    if (p.status === 'withdrawn') throw _erro(409, 'A empresa retirou esta proposta.');
    if (p.status === decisao) return res.json(await _detalhe(t.id));
    // A decisão é final (o painel pede confirmação): um só email por proposta.
    // Atómico: duas decisões em paralelo não enviam dois emails.
    const { rowCount } = await pool.query(
      `UPDATE tender_proposals SET status = $2, decided_at = NOW() WHERE id = $1 AND status = 'submitted'`, [p.id, decisao]);
    if (!rowCount) throw _erro(409, 'Esta proposta já foi decidida.');
    await _registar(t.id, p.invite_id, 'owner', decisao === 'accepted' ? 'accept' : 'decline_proposal');
    // Para o email público da empresa (onde chegou o convite), não para o
    // contacto escrito na proposta, que ninguém verificou.
    const destino = p.invite_email;
    if (!t.is_test && destino) {
      const aceite = decisao === 'accepted';
      deferEmail(() => sendBrandedEmail({
        to: destino,
        replyTo: t.owner_email,
        subject: aceite ? `A sua proposta foi aceite: ${t.title}` : `Resultado do concurso: ${t.title}`,
        title: aceite ? 'Hivex — Proposta aceite' : 'Hivex — Resultado do concurso',
        bodyHtml: aceite ? `
          <p style="margin-top:0">Olá, equipa da <strong>${esc(p.company_name)}</strong>,</p>
          <p><strong>${esc(t.owner_name)}</strong> aceitou a vossa proposta para <strong>${esc(t.title)}</strong> (${esc(_euros(p.price_cents))}${p.vat && IVA[p.vat] ? ', ' + esc(IVA[p.vat]) : ''}).</p>
          <p>Para combinar os próximos passos, contacte o cliente diretamente: <a href="mailto:${esc(t.owner_email)}">${esc(t.owner_email)}</a>${t.owner_phone ? ' · ' + esc(t.owner_phone) : ''}. Pode também responder a este email.</p>
          <p style="color:#6b7280;font-size:13px;margin-bottom:0">A Hivex não é parte do contrato entre a empresa e o cliente.</p>` : `
          <p style="margin-top:0">Olá, equipa da <strong>${esc(p.company_name)}</strong>,</p>
          <p>Obrigado pela proposta para <strong>${esc(t.title)}</strong>. Desta vez ${esc(t.owner_name)} optou por outra solução.</p>
          <p style="color:#6b7280;font-size:13px;margin-bottom:0">Continuará a receber pedidos de clientes através da Hivex.</p>`,
      }), `concurso ${t.id}: decisão ${decisao} (proposta ${p.id})`);
    }
    res.json(await _detalhe(t.id));
  } catch (e) { _resp(res, next, e); }
});

router.post('/tenders/:id(\\d+)/close', requireAuth, async (req, res, next) => {
  try {
    const t = await _meuConcurso(req, req.params.id);
    if (!t) throw _erro(404, 'Concurso não encontrado');
    if (t.status === 'draft') throw _erro(409, 'Um rascunho não precisa de ser fechado: pode apagá-lo.');
    if (t.status !== 'closed') {
      await pool.query(`UPDATE tenders SET status = 'closed', closed_at = NOW(), updated_at = NOW() WHERE id = $1`, [t.id]);
      await _registar(t.id, null, 'owner', 'close');
    }
    res.json(await _detalhe(t.id));
  } catch (e) { _resp(res, next, e); }
});

// ── Lado da empresa convidada (link pessoal, sem conta) ───────────────────────
async function _vistaConvite(inv) {
  const t = inv.tender;
  const [{ rows: fs }, { rows: ps }, { rows: cs }] = await Promise.all([
    pool.query(
      `SELECT * FROM tender_files WHERE tender_id = $1 AND status = 'ready'
          AND (invite_id IS NULL OR invite_id = $2) ORDER BY id`, [t.id, inv.id]),
    pool.query(`SELECT * FROM tender_proposals WHERE invite_id = $1`, [inv.id]),
    inv.company_id ? pool.query(`SELECT id, name, email, created_by FROM companies WHERE id = $1`, [inv.company_id]) : Promise.resolve({ rows: [] }),
  ]);
  const p = ps[0];
  const co = cs[0];
  return {
    invite: {
      company_id: inv.company_id != null ? Number(inv.company_id) : null,
      company_name: inv.company_name,
      claimed: co ? _reclamada(co) : false,
      declined_at: inv.declined_at, decline_reason: inv.decline_reason,
      email: inv.email,
    },
    tender: {
      title: t.title, description: t.description, city: t.city, country: t.country,
      budget: t.budget, start_date: t.start_date, deadline: t.deadline, estado: _estado(t),
      owner_name: t.owner_name, owner_email: t.owner_email, owner_phone: t.owner_phone,
      published_at: t.published_at, is_test: t.is_test,
    },
    files: fs.filter(f => f.invite_id == null).map(_ficheiroPublico),
    proposal: p ? {
      price_cents: p.price_cents != null ? Number(p.price_cents) : null, vat: p.vat, duration: p.duration,
      validity_days: p.validity_days, notes: p.notes, contact_name: p.contact_name,
      contact_email: p.contact_email, contact_phone: p.contact_phone, status: p.status,
      submitted_at: p.submitted_at, updated_at: p.updated_at,
    } : null,
    proposalFiles: fs.filter(f => f.invite_id != null).map(_ficheiroPublico),
    limites: { ficheirosProposta: LIMITES.ficheirosProposta, mb: LIMITES.bytes / 1024 / 1024 },
    anexos: blob.configurado(),
  };
}

router.get('/tender-invites/:ref', optionalAuth, async (req, res, next) => {
  try {
    const inv = await _resolverConvite(req.params.ref, req);
    if (!inv) throw _erro(404, 'Este convite não existe ou já expirou.');
    // Uma entrada no registo por visita (no máx. uma a cada 30 minutos); os
    // verificadores de links dos servidores de email não contam como visita.
    if (!BOT_UA.test(String(req.get('user-agent') || ''))) {
      const novaVisita = !inv.last_viewed_at || Date.now() - new Date(inv.last_viewed_at).getTime() > 30 * 60 * 1000;
      await pool.query(
        `UPDATE tender_invites SET views = views + 1, first_viewed_at = COALESCE(first_viewed_at, NOW()),
                last_viewed_at = NOW() WHERE id = $1`, [inv.id]);
      if (novaVisita) await _registar(inv.tender_id, inv.id, 'company', 'view');
    }
    res.set('Cache-Control', 'private, no-store');
    res.json(await _vistaConvite(inv));
  } catch (e) { _resp(res, next, e); }
});

router.post('/tender-invites/:ref/files', optionalAuth, async (req, res, next) => {
  try {
    const inv = await _resolverConvite(req.params.ref, req);
    if (!inv) throw _erro(404, 'Este convite não existe ou já expirou.');
    if (!_aceitaPropostas(inv.tender)) throw _erro(409, 'O concurso já não aceita propostas.');
    const p = (await pool.query(`SELECT status FROM tender_proposals WHERE invite_id = $1`, [inv.id])).rows[0];
    if (p && ['accepted', 'declined'].includes(p.status)) throw _erro(409, 'A proposta já foi analisada pelo cliente.');
    const b = req.body || {};
    res.status(201).json(await _pedirEnvio({
      tenderId: inv.tender_id, inviteId: inv.id, nome: b.name, tamanho: b.size, max: LIMITES.ficheirosProposta,
    }));
  } catch (e) { _resp(res, next, e); }
});

router.post('/tender-invites/:ref/files/:fileId(\\d+)/done', optionalAuth, async (req, res, next) => {
  try {
    const inv = await _resolverConvite(req.params.ref, req);
    if (!inv) throw _erro(404, 'Este convite não existe ou já expirou.');
    const { rows } = await pool.query(
      `SELECT * FROM tender_files WHERE id = $1 AND invite_id = $2 AND status <> 'deleted'`, [req.params.fileId, inv.id]);
    const f = rows[0];
    if (!f) throw _erro(404, 'Ficheiro não encontrado');
    // As mesmas regras do pedido de envio: um link pedido antes do fim do prazo
    // (ou de a proposta ser decidida) não pode juntar anexos depois.
    const p = (await pool.query(`SELECT status FROM tender_proposals WHERE invite_id = $1`, [inv.id])).rows[0];
    const decidida = p && ['accepted', 'declined'].includes(p.status);
    if (f.status !== 'ready' && (!_aceitaPropostas(inv.tender) || decidida)) {
      await _apagarFicheiro(f);
      throw _erro(409, decidida ? 'A proposta já foi analisada pelo cliente.' : 'O concurso já não aceita propostas.');
    }
    res.json({ file: await _confirmarEnvio(f) });
  } catch (e) { _resp(res, next, e); }
});

router.delete('/tender-invites/:ref/files/:fileId(\\d+)', optionalAuth, async (req, res, next) => {
  try {
    const inv = await _resolverConvite(req.params.ref, req);
    if (!inv) throw _erro(404, 'Este convite não existe ou já expirou.');
    const { rows } = await pool.query(
      `SELECT * FROM tender_files WHERE id = $1 AND invite_id = $2 AND status <> 'deleted'`, [req.params.fileId, inv.id]);
    if (!rows[0]) throw _erro(404, 'Ficheiro não encontrado');
    if (rows[0].status === 'ready' && !_aceitaPropostas(inv.tender)) throw _erro(409, 'O concurso já não aceita alterações.');
    await _apagarFicheiro(rows[0]);
    res.json({ ok: true });
  } catch (e) { _resp(res, next, e); }
});

router.put('/tender-invites/:ref/proposal', optionalAuth, async (req, res, next) => {
  try {
    const inv = await _resolverConvite(req.params.ref, req);
    if (!inv) throw _erro(404, 'Este convite não existe ou já expirou.');
    const t = inv.tender;
    if (!_aceitaPropostas(t)) {
      throw _erro(409, _estado(t) === 'closed' ? 'O concurso foi fechado.' : 'O prazo para propostas terminou.');
    }
    const b = req.body || {};
    const preco = Number(String(b.price == null ? '' : b.price).replace(',', '.'));
    if (!Number.isFinite(preco) || preco <= 0 || preco > 1e10) throw _erro(400, 'Indique o preço da proposta.');
    const duracao = _txt(b.duration, 80);
    if (duracao.length < 2) throw _erro(400, 'Indique o prazo de execução.');
    const iva = ['incluido', 'acresce', 'isento'].includes(b.vat) ? b.vat : 'acresce';
    const validade = Number.isInteger(Number(b.validity_days)) && Number(b.validity_days) > 0 && Number(b.validity_days) <= 365
      ? Number(b.validity_days) : null;
    const notas = _txt(b.notes, 6000) || null;
    const nome = _txt(b.contact_name, 120);
    const email = _txt(b.contact_email, 254).toLowerCase();
    const tel = _txt(b.contact_phone, 40) || null;
    if (nome.length < 2) throw _erro(400, 'Indique o nome de quem responde pela proposta.');
    if (!EMAIL_RE.test(email)) throw _erro(400, 'Indique um email de contacto válido.');
    const { rows: pend } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM tender_files WHERE invite_id = $1 AND status = 'pending'`, [inv.id]);
    if (pend[0].n) throw _erro(409, 'Ainda há anexos a enviar. Espere que terminem ou retire-os.');
    const { rows: atual } = await pool.query(`SELECT id, status FROM tender_proposals WHERE invite_id = $1`, [inv.id]);
    if (atual[0] && ['accepted', 'declined'].includes(atual[0].status)) {
      throw _erro(409, 'A proposta já foi analisada pelo cliente e não pode ser alterada.');
    }
    const nova = !atual[0] || atual[0].status === 'withdrawn';
    // O WHERE do DO UPDATE impede que uma alteração em paralelo apague uma
    // decisão do cliente tomada entre a verificação acima e esta escrita.
    const { rowCount } = await pool.query(
      `INSERT INTO tender_proposals (tender_id, invite_id, price_cents, vat, duration, validity_days, notes,
                                     contact_name, contact_email, contact_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (invite_id) DO UPDATE SET
         price_cents = EXCLUDED.price_cents, vat = EXCLUDED.vat, duration = EXCLUDED.duration,
         validity_days = EXCLUDED.validity_days, notes = EXCLUDED.notes, contact_name = EXCLUDED.contact_name,
         contact_email = EXCLUDED.contact_email, contact_phone = EXCLUDED.contact_phone,
         status = 'submitted', updated_at = NOW(),
         submitted_at = CASE WHEN tender_proposals.status = 'withdrawn' THEN NOW() ELSE tender_proposals.submitted_at END
       WHERE tender_proposals.status NOT IN ('accepted', 'declined')`,
      [t.id, inv.id, Math.round(preco * 100), iva, duracao, validade, notas, nome, email, tel]);
    if (!rowCount) throw _erro(409, 'A proposta já foi analisada pelo cliente e não pode ser alterada.');
    await pool.query(`UPDATE tender_invites SET declined_at = NULL, decline_reason = NULL WHERE id = $1`, [inv.id]);
    inv.declined_at = null;
    inv.decline_reason = null;
    await _registar(t.id, inv.id, 'company', nova ? 'proposal' : 'proposal_update');
    if (!t.is_test) {
      deferEmail(() => sendBrandedEmail({
        to: t.owner_email,
        replyTo: email,
        subject: nova ? `[Hivex] Nova proposta de ${inv.company_name}: ${t.title}` : `[Hivex] ${inv.company_name} atualizou a proposta: ${t.title}`,
        title: nova ? 'Hivex — Nova proposta' : 'Hivex — Proposta atualizada',
        bodyHtml: `
          <p style="margin-top:0">Olá ${esc(t.owner_name)},</p>
          <p><strong>${esc(inv.company_name)}</strong> ${nova ? 'enviou uma proposta' : 'atualizou a proposta'} para <strong>${esc(t.title)}</strong>:</p>
          <table style="width:100%;border-collapse:collapse;margin:14px 0">
            <tr style="background:#f9fafb"><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb;width:38%">Preço</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(_euros(Math.round(preco * 100)))} (${esc(IVA[iva])})</td></tr>
            <tr><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Prazo de execução</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(duracao)}</td></tr>
          </table>
          <p style="text-align:center;margin:24px 0"><a href="${BASE}/?concursos=${t.id}" style="display:inline-block;background:#2563eb;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700">Ver e comparar as propostas</a></p>
          <p style="color:#6b7280;font-size:13px;margin-bottom:0">Pode responder a este email para falar diretamente com a empresa.</p>`,
      }), `concurso ${t.id}: proposta (convite ${inv.id})`);
    }
    res.json(await _vistaConvite(inv));
  } catch (e) { _resp(res, next, e); }
});

router.post('/tender-invites/:ref/decline', optionalAuth, async (req, res, next) => {
  try {
    const inv = await _resolverConvite(req.params.ref, req);
    if (!inv) throw _erro(404, 'Este convite não existe ou já expirou.');
    if (!_aceitaPropostas(inv.tender)) throw _erro(409, 'O concurso já não aceita respostas.');
    const { rows: p } = await pool.query(`SELECT id, status FROM tender_proposals WHERE invite_id = $1`, [inv.id]);
    if (p[0] && ['accepted', 'declined'].includes(p[0].status)) throw _erro(409, 'A proposta já foi analisada pelo cliente.');
    if (p[0]) await pool.query(`UPDATE tender_proposals SET status = 'withdrawn', updated_at = NOW() WHERE id = $1`, [p[0].id]);
    await pool.query(
      `UPDATE tender_invites SET declined_at = NOW(), decline_reason = $2 WHERE id = $1`,
      [inv.id, _txt(req.body && req.body.reason, 300) || null]);
    await _registar(inv.tender_id, inv.id, 'company', 'decline');
    res.json(await _vistaConvite({ ...inv, declined_at: new Date(), decline_reason: _txt(req.body && req.body.reason, 300) || null }));
  } catch (e) { _resp(res, next, e); }
});

// "Não quero receber convites de concursos" — GET mostra a confirmação (os
// filtros de email abrem links sozinhos; um GET não pode recusar por engano);
// POST regista (botão da página e cancelamento num clique, RFC 8058).
async function optoutConvite(req, res) {
  const ref = String(req.params.ref || '');
  const pagina = (corpo) => res.set('Content-Type', 'text/html; charset=utf-8').send(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<div style="font-family:Arial,sans-serif;max-width:520px;margin:60px auto;padding:0 20px;color:#374151;line-height:1.6">${corpo}` +
    `<p><a href="https://www.hivex.pt" style="color:#2563eb">Voltar à Hivex</a></p></div>`);
  let inv = null;
  if (/^[A-Za-z0-9_-]{32}$/.test(ref)) {
    const { rows } = await pool.query(`SELECT id, email FROM tender_invites WHERE token_hash = $1`, [_hash(ref)]);
    inv = rows[0] || null;
  }
  if (!inv) return pagina(`<h2>Link inválido</h2><p>Este link não é válido. Responda a qualquer email da Hivex e tratamos do pedido.</p>`);
  if (req.method === 'GET') {
    return pagina(
      `<h2>Deixar de receber convites</h2><p>Confirme que o endereço <strong>${esc(inv.email)}</strong> não quer receber convites de concursos nem outros emails não essenciais da Hivex.</p>` +
      `<form method="post"><button type="submit" style="background:#2563eb;color:#fff;border:0;border-radius:8px;padding:12px 22px;font-size:15px;font-weight:700;cursor:pointer">Confirmar</button></form>`);
  }
  try {
    await pool.query(`INSERT INTO email_optouts (email) VALUES ($1) ON CONFLICT DO NOTHING`, [String(inv.email).toLowerCase()]);
  } catch (e) {
    console.error('[concursos] opt-out falhou:', e.message);
    return res.status(500).set('Content-Type', 'text/html; charset=utf-8').send('Erro — tente de novo.');
  }
  return pagina(`<h2>Pedido registado</h2><p>Não voltará a receber convites de concursos nem outros emails não essenciais da Hivex em ${esc(inv.email)}.</p>`);
}
router.get('/tender-invites/:ref/optout', optoutConvite);
router.post('/tender-invites/:ref/optout', express.urlencoded({ extended: false, limit: '2kb' }), optoutConvite);

// ── Manutenção diária (chamada pelo cron de /api/messages/purge) ──────────────
async function manutencaoConcursos() {
  const out = { convites: 0, resumos: 0, anexosPurgados: 0, concursosApagados: 0, lixo: 0 };
  // 1) Convites que ficaram por enviar (a função terminou a meio do envio).
  //    Quem entretanto recusou convites (email_optouts) já não recebe.
  await pool.query(
    `UPDATE tender_invites i SET status = 'failed'
      WHERE i.status = 'pending' AND i.created_at < NOW() - INTERVAL '10 minutes'
        AND EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = lower(trim(i.email)))`);
  const { rows: pend } = await pool.query(
    `SELECT i.*, (SELECT COUNT(*) FROM tender_files f WHERE f.tender_id = i.tender_id AND f.invite_id IS NULL AND f.status = 'ready')::int AS nf
       FROM tender_invites i JOIN tenders t ON t.id = i.tender_id
      WHERE i.status = 'pending' AND i.created_at < NOW() - INTERVAL '10 minutes'
        AND t.status = 'open' AND t.deadline > NOW() LIMIT 30`);
  for (const i of pend) {
    // O link pessoal só existe no email: gera-se um novo token para o reenvio.
    const token = _novoToken();
    await pool.query(`UPDATE tender_invites SET token_hash = $2 WHERE id = $1`, [i.id, _hash(token)]);
    const { rows: ts } = await pool.query(`SELECT * FROM tenders WHERE id = $1`, [i.tender_id]);
    try {
      await _emailConvite(ts[0], i, token, i.nf);
      await pool.query(`UPDATE tender_invites SET status = 'sent', sent_at = NOW() WHERE id = $1`, [i.id]);
      out.convites++;
    } catch (e) {
      await pool.query(`UPDATE tender_invites SET status = 'failed' WHERE id = $1`, [i.id]);
    }
  }
  // 2) Resumo a quem lançou quando o prazo termina
  const { rows: fim } = await pool.query(
    `SELECT t.*, (SELECT COUNT(*) FROM tender_proposals p WHERE p.tender_id = t.id AND p.status <> 'withdrawn')::int AS np
       FROM tenders t
      WHERE t.status = 'open' AND t.deadline < NOW() AND t.deadline_notified_at IS NULL AND NOT t.is_test
      LIMIT 50`);
  for (const t of fim) {
    await pool.query(`UPDATE tenders SET deadline_notified_at = NOW() WHERE id = $1`, [t.id]);
    try {
      await sendBrandedEmail({
        to: t.owner_email,
        subject: `[Hivex] Terminou o prazo do concurso: ${t.title}`,
        title: 'Hivex — Prazo terminado',
        bodyHtml: `
          <p style="margin-top:0">Olá ${esc(t.owner_name)},</p>
          <p>Terminou o prazo para propostas do concurso <strong>${esc(t.title)}</strong>. Recebeu <strong>${t.np} proposta${t.np === 1 ? '' : 's'}</strong>.</p>
          <p style="text-align:center;margin:24px 0"><a href="${BASE}/?concursos=${t.id}" style="display:inline-block;background:#2563eb;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700">Comparar propostas</a></p>
          <p style="color:#6b7280;font-size:13px;margin-bottom:0">Os anexos ficam guardados durante ${RETENCAO.anexosDias} dias depois do fecho; descarregue o que precisar de guardar.</p>`,
      });
      out.resumos++;
    } catch (e) { console.error('[concursos] resumo falhou:', t.id, e.message); }
  }
  // 3) Retenção dos anexos: 90 dias depois do fecho (ou do fim do prazo)
  const { rows: velhos } = await pool.query(
    `SELECT id FROM tenders
      WHERE status <> 'draft' AND purged_at IS NULL
        AND COALESCE(closed_at, deadline) < NOW() - make_interval(days => $1)
      LIMIT 50`, [RETENCAO.anexosDias]);
  for (const t of velhos) {
    try {
      const { rows: fs } = await pool.query(`SELECT pathname FROM tender_files WHERE tender_id = $1 AND status <> 'deleted'`, [t.id]);
      await _paraLixo(fs.map(f => f.pathname));   // o lixo garante o del() mesmo que agora falhe
      await pool.query(`UPDATE tender_files SET status = 'deleted' WHERE tender_id = $1`, [t.id]);
      await pool.query(`UPDATE tenders SET purged_at = NOW() WHERE id = $1`, [t.id]);
      out.anexosPurgados += fs.length;
    } catch (e) { console.error('[concursos] retenção falhou:', t.id, e.message); }
  }
  // 4) Concursos 12 meses depois do fecho e rascunhos parados há 30 dias
  const { rows: apagar } = await pool.query(
    `SELECT id FROM tenders
      WHERE (status <> 'draft' AND COALESCE(closed_at, deadline) < NOW() - make_interval(days => $1))
         OR (status = 'draft' AND updated_at < NOW() - make_interval(days => $2))
      LIMIT 50`, [RETENCAO.concursoDias, RETENCAO.rascunhoDias]);
  for (const t of apagar) {
    try {
      const { rows: fs } = await pool.query(`SELECT pathname FROM tender_files WHERE tender_id = $1 AND status <> 'deleted'`, [t.id]);
      await _paraLixo(fs.map(f => f.pathname));
      await pool.query(`DELETE FROM tenders WHERE id = $1`, [t.id]);
      out.concursosApagados++;
    } catch (e) { console.error('[concursos] apagar concurso falhou:', t.id, e.message); }
  }
  // 5) Envios que nunca foram confirmados
  const { rows: orfaos } = await pool.query(
    `SELECT id, pathname FROM tender_files WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 day' LIMIT 200`);
  if (orfaos.length) {
    await _paraLixo(orfaos.map(f => f.pathname));
    await pool.query(`DELETE FROM tender_files WHERE id = ANY($1::bigint[])`, [orfaos.map(f => f.id)]);
  }
  // 6) Lixo do Blob: volta a apagar o que entrou há mais de 30 minutos (os URLs
  //    de envio duram 15) e só o esquece quando o Blob confirma.
  const { rows: lixo } = await pool.query(
    `SELECT pathname FROM tender_blob_trash WHERE created_at < NOW() - INTERVAL '30 minutes' ORDER BY created_at LIMIT 500`);
  if (lixo.length) {
    const caminhos = lixo.map(r => r.pathname);
    try {
      await blob.apagar(caminhos);
      await pool.query(`DELETE FROM tender_blob_trash WHERE pathname = ANY($1::text[])`, [caminhos]);
      out.lixo = caminhos.length;
    } catch (e) {
      console.error('[concursos] lixo do Blob por apagar:', e.message);
      await pool.query(`UPDATE tender_blob_trash SET tries = tries + 1 WHERE pathname = ANY($1::text[])`, [caminhos]);
    }
  }
  return out;
}

module.exports = router;
module.exports.manutencaoConcursos = manutencaoConcursos;
module.exports._paraLixo = _paraLixo;
module.exports._interno = { _confereConteudo, _convidavel, _nomeSeguro, TIPOS, LIMITES };
