// "Pedidos de clientes": a lista do dono de uma empresa com todos os clientes
// que contactaram as suas fichas pela Hivex — convites para concursos, pedidos
// de orçamento a várias empresas e mensagens diretas. Só leitura: responder
// segue pelas rotas de cada canal (convite do concurso, chat). Montado em /api.
//
// Estados de cada pedido: new (ainda não visto), todo (visto, por responder),
// done (respondido); nos concursos ainda proposal, nobid (não concorre),
// accepted, lost (o cliente escolheu outra) e missed (prazo terminou sem
// resposta).
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { _estado } = require('./tenders');

const PLATAFORMA = 7;   // dona das fichas importadas, ainda não reclamadas
const DIAS = 90;        // pedidos de orçamento e mensagens: a retenção do chat

// Fichas que o utilizador gere (a conta da plataforma não conta como dona)
async function _empresas(userId) {
  if (Number(userId) === PLATAFORMA) return [];
  const { rows } = await pool.query(
    `SELECT id, name FROM companies WHERE created_by = $1 ORDER BY name LIMIT 200`, [userId]);
  return rows.map(r => ({ id: Number(r.id), name: r.name }));
}

function _estadoConvite(r) {
  const aberto = _estado({ status: r.t_status, deadline: r.deadline }) === 'open';
  if (r.p_status === 'accepted') return 'accepted';
  if (r.p_status === 'declined') return 'lost';
  if (r.p_status === 'submitted') return 'proposal';
  if (r.declined_at) return 'nobid';
  if (!aberto) return 'missed';
  return r.first_viewed_at ? 'todo' : 'new';
}

router.get('/requests/received', requireAuth, async (req, res, next) => {
  try {
    res.set('Cache-Control', 'private, no-store');
    const empresas = await _empresas(req.user.id);
    if (!empresas.length) return res.json({ companies: [], items: [], novos: 0 });
    const ids = empresas.map(e => e.id);
    const nomes = new Map(empresas.map(e => [e.id, e.name]));
    const [{ rows: conv }, { rows: orc }, { rows: msg }] = await Promise.all([
      pool.query(
        `SELECT i.id, i.company_id, i.company_name, i.first_viewed_at, i.declined_at, i.sent_at, i.created_at,
                t.title, t.city, t.deadline, t.status AS t_status, t.owner_name, t.budget,
                p.status AS p_status, p.price_cents
           FROM tender_invites i
           JOIN tenders t ON t.id = i.tender_id
           LEFT JOIN tender_proposals p ON p.invite_id = i.id
          WHERE i.company_id = ANY($1::bigint[]) AND t.status <> 'draft' AND NOT t.is_test
          ORDER BY COALESCE(i.sent_at, i.created_at) DESC LIMIT 100`, [ids]),
      pool.query(
        `SELECT r.id, r.company_id, r.seen_at, r.created_at,
                q.client_name, q.client_email, q.client_phone, q.sector, q.description, q.city,
                q.timeline, q.budget_range,
                -- respondido = a empresa escreveu a este cliente pela Hivex depois do pedido
                EXISTS (SELECT 1 FROM messages m
                         WHERE m.company_id = r.company_id AND m.sender = 'company'
                           AND lower(m.client_email) = lower(q.client_email)
                           AND m.created_at >= r.created_at) AS respondido
           FROM quote_request_recipients r
           JOIN quote_requests q ON q.id = r.request_id
          WHERE r.company_id = ANY($1::bigint[]) AND r.created_at > NOW() - make_interval(days => $2)
          ORDER BY r.created_at DESC LIMIT 100`, [ids, DIAS]),
      // Conversas com pelo menos uma mensagem do cliente (as que só têm a
      // resposta da empresa a um pedido de orçamento aparecem nesse pedido)
      pool.query(
        `SELECT m.company_id, lower(m.client_email) AS email,
                (ARRAY_AGG(m.client_name ORDER BY m.created_at DESC)
                   FILTER (WHERE coalesce(m.client_name, '') <> ''))[1] AS client_name,
                MAX(m.created_at) AS last_at,
                (ARRAY_AGG(m.body ORDER BY m.created_at DESC) FILTER (WHERE m.sender = 'client'))[1] AS last_body,
                (ARRAY_AGG(m.sender ORDER BY m.created_at DESC))[1] AS last_sender,
                COUNT(*) FILTER (WHERE m.sender = 'client')::int AS n,
                COUNT(*) FILTER (WHERE m.sender = 'client' AND m.read_at IS NULL)::int AS unread
           FROM messages m
          WHERE m.company_id = ANY($1::bigint[]) AND m.created_at > NOW() - make_interval(days => $2)
          GROUP BY m.company_id, lower(m.client_email)
         HAVING COUNT(*) FILTER (WHERE m.sender = 'client') > 0
          ORDER BY MAX(m.created_at) DESC LIMIT 100`, [ids, DIAS]),
    ]);
    const items = [];
    for (const r of conv) {
      items.push({
        kind: 'tender', key: 'i' + r.id, ref: 'i' + r.id,
        at: r.sent_at || r.created_at, company_id: Number(r.company_id),
        company_name: nomes.get(Number(r.company_id)) || r.company_name,
        client: r.owner_name, title: r.title, city: r.city, deadline: r.deadline, budget: r.budget,
        state: _estadoConvite(r), price_cents: r.price_cents != null ? Number(r.price_cents) : null,
      });
    }
    for (const r of orc) {
      items.push({
        kind: 'rfq', key: 'q' + r.id, at: r.created_at, company_id: Number(r.company_id),
        company_name: nomes.get(Number(r.company_id)) || '',
        client: r.client_name, email: r.client_email, phone: r.client_phone || null,
        sector: r.sector, description: r.description, city: r.city,
        timeline: r.timeline, budget: r.budget_range,
        state: r.respondido ? 'done' : r.seen_at ? 'todo' : 'new',
      });
    }
    for (const r of msg) {
      items.push({
        kind: 'msg', key: 'm' + r.company_id + ':' + r.email, at: r.last_at, company_id: Number(r.company_id),
        company_name: nomes.get(Number(r.company_id)) || '',
        client: r.client_name || r.email, email: r.email, last_body: r.last_body,
        n: r.n, unread: r.unread,
        state: r.unread ? 'new' : r.last_sender === 'company' ? 'done' : 'todo',
      });
    }
    items.sort((a, b) => new Date(b.at) - new Date(a.at));
    const novos = items.filter(i => i.state === 'new').length;
    // Abrir a lista = ver os pedidos de orçamento (o texto está todo na lista);
    // os convites ficam "novos" até serem abertos e as mensagens até à conversa.
    // Só os que foram mostrados: um que chegue entretanto continua novo.
    const mostrados = orc.filter(r => !r.seen_at).map(r => r.id);
    if (mostrados.length) {
      await pool.query(
        `UPDATE quote_request_recipients SET seen_at = NOW()
          WHERE seen_at IS NULL AND id = ANY($1::bigint[])`, [mostrados]);
    }
    res.json({ companies: empresas, items, novos });
  } catch (e) { next(e); }
});

// Número de pedidos novos (menu da conta). empresas = 0 esconde a entrada.
router.get('/requests/received/count', requireAuth, async (req, res, next) => {
  try {
    res.set('Cache-Control', 'private, no-store');
    const empresas = await _empresas(req.user.id);
    if (!empresas.length) return res.json({ empresas: 0, novos: 0 });
    const ids = empresas.map(e => e.id);
    const { rows } = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM tender_invites i JOIN tenders t ON t.id = i.tender_id
           LEFT JOIN tender_proposals p ON p.invite_id = i.id
           WHERE i.company_id = ANY($1::bigint[]) AND t.status = 'open' AND t.deadline > NOW() AND NOT t.is_test
             AND i.first_viewed_at IS NULL AND i.declined_at IS NULL AND p.id IS NULL)::int
       + (SELECT COUNT(*) FROM quote_request_recipients r
           WHERE r.company_id = ANY($1::bigint[]) AND r.seen_at IS NULL
             AND r.created_at > NOW() - make_interval(days => $2))::int
       + (SELECT COUNT(DISTINCT (m.company_id, lower(m.client_email))) FROM messages m
           WHERE m.company_id = ANY($1::bigint[]) AND m.sender = 'client' AND m.read_at IS NULL
             AND m.created_at > NOW() - make_interval(days => $2))::int AS novos`, [ids, DIAS]);
    res.json({ empresas: empresas.length, novos: rows[0].novos });
  } catch (e) { next(e); }
});

module.exports = router;
