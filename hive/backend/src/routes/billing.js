// ── Destaque self-service via Stripe ──────────────────────────────────────────
// Dormente sem STRIPE_SECRET_KEY (como o email/IA/FCM): o frontend consulta
// /billing/status e mostra checkout quando ativo; senão mantém o pedido ao
// admin por email. Webhook exige STRIPE_WEBHOOK_SECRET e corpo RAW (a rota é
// montada em app.js ANTES dos parsers JSON).
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, ensureAdminFlag } = require('../middleware/auth');
const { sendBrandedEmail, esc } = require('../email');

const KEY = process.env.STRIPE_SECRET_KEY || '';
const WH_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const PRICE_CENTS = parseInt(process.env.STRIPE_FEATURE_CENTS || '1900', 10); // €19/mês
const BASE = 'https://www.hivex.pt';

let _stripe = null;
function stripe() {
  if (!KEY) return null;
  if (!_stripe) { try { _stripe = require('stripe')(KEY); } catch (_) { return null; } }
  return _stripe;
}

router.get('/billing/status', (req, res) => {
  res.json({ enabled: !!(KEY && stripe()), priceCents: PRICE_CENTS, currency: 'eur' });
});

// POST /api/billing/feature-checkout { companyId, months? } → { url }
router.post('/billing/feature-checkout', requireAuth, async (req, res, next) => {
  try {
    const s = stripe();
    if (!s) return res.status(503).json({ error: 'Pagamentos ainda não configurados' });
    const months = [1, 3, 6].includes(Number(req.body && req.body.months)) ? Number(req.body.months) : 1;
    const { rows: co } = await pool.query(
      `SELECT id, name, featured, created_by FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.body && req.body.companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o dono da ficha pode destacar' });
    }
    const amount = PRICE_CENTS * months;
    const session = await s.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: amount,
          product_data: {
            name: `Destaque Hivex — ${co[0].name} (${months} ${months === 1 ? 'mês' : 'meses'})`,
            description: 'Posição destacada nas listas e selo ★ Destacado',
          },
        },
      }],
      success_url: `${BASE}/?feature=success`,
      cancel_url: `${BASE}/?feature=cancel`,
      metadata: { companyId: String(co[0].id), userId: String(req.user.id), months: String(months) },
    });
    await pool.query(
      `INSERT INTO feature_orders (company_id, user_id, stripe_session, status, months, amount_cents)
       VALUES ($1, $2, $3, 'pending', $4, $5)`,
      [co[0].id, req.user.id, session.id, months, amount]);
    res.json({ url: session.url });
  } catch (e) { next(e); }
});

// Webhook (corpo RAW — ver app.js). checkout.session.completed → ativa destaque.
async function webhookHandler(req, res) {
  const s = stripe();
  if (!s || !WH_SECRET) return res.status(503).end();
  let event;
  try {
    event = s.webhooks.constructEvent(req.body, req.headers['stripe-signature'], WH_SECRET);
  } catch (e) {
    return res.status(400).json({ error: 'assinatura inválida' });
  }
  try {
    if (event.type === 'checkout.session.completed') {
      const sess = event.data.object;
      const companyId = Number(sess.metadata && sess.metadata.companyId);
      const months = Number(sess.metadata && sess.metadata.months) || 1;
      if (companyId) {
        await pool.query(
          `UPDATE feature_orders SET status = 'paid', paid_at = NOW(),
                  expires_at = NOW() + ($2 || ' months')::interval
            WHERE stripe_session = $1`, [sess.id, String(months)]);
        await pool.query(
          `UPDATE companies SET featured = TRUE,
                  featured_until = GREATEST(COALESCE(featured_until, NOW()), NOW()) + ($2 || ' months')::interval,
                  updated_at = NOW()
            WHERE id = $1`, [companyId, String(months)]);
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        if (adminEmail) {
          sendBrandedEmail({
            to: adminEmail,
            subject: `[Hivex] 💰 Destaque pago — empresa ${companyId} (${months}m)`,
            title: 'Hivex — destaque pago',
            bodyHtml: `<p>Pagamento Stripe confirmado para a empresa <strong>${esc(String(companyId))}</strong> (${months} mês/meses). Destaque ativado automaticamente.</p>`,
          }).catch(() => {});
        }
      }
    }
    res.json({ received: true });
  } catch (e) {
    console.error('[billing] webhook:', e.message);
    res.status(500).json({ error: 'erro interno' });
  }
}

// Cron diário: expira destaques vencidos (só os geridos por featured_until).
router.get('/billing/expire-features', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const fromCron = !!req.headers['x-vercel-cron'];
  const authed = secret && req.headers.authorization === `Bearer ${secret}`;
  if (!fromCron && !authed) return res.status(401).json({ error: 'unauthorized' });
  const { rowCount } = await pool.query(
    `UPDATE companies SET featured = FALSE, updated_at = NOW()
      WHERE featured = TRUE AND featured_until IS NOT NULL AND featured_until < NOW()`);
  await pool.query(
    `UPDATE feature_orders SET status = 'expired'
      WHERE status = 'paid' AND expires_at IS NOT NULL AND expires_at < NOW()`).catch(() => {});
  res.json({ ok: true, expired: rowCount });
});

module.exports = { router, webhookHandler };
