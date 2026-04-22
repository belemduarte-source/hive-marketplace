const nodemailer = require('nodemailer');

// Build a transporter lazily so missing env vars don't crash startup
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host:   SMTP_HOST  || 'smtp.gmail.com',
    port:   parseInt(SMTP_PORT || '465', 10),
    secure: parseInt(SMTP_PORT || '465', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Send an admin notification when a new company registers.
 * Includes one-click Approve / Reject links.
 * Silently skips if SMTP credentials are not configured.
 */
async function sendRegistrationNotification(company) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured — skipping registration notification');
    return;
  }

  const adminEmail  = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const appUrl      = (process.env.APP_URL || '').replace(/\/$/, '');
  const adminToken  = process.env.ADMIN_TOKEN || '';
  const sectors     = Array.isArray(company.sectors) ? company.sectors.join(', ') : (company.sector || '—');

  const approveUrl = `${appUrl}/api/companies/${company.id}/approve?token=${encodeURIComponent(adminToken)}`;
  const rejectUrl  = `${appUrl}/api/companies/${company.id}/reject?token=${encodeURIComponent(adminToken)}`;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:660px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#f97316;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Hive — Nova empresa a aguardar validação</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151">Uma nova empresa submeteu o registo e aguarda a sua aprovação.</p>

    <!-- Action buttons -->
    <div style="display:flex;gap:12px;margin-bottom:28px">
      <a href="${approveUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">✅ Aprovar empresa</a>
      <a href="${rejectUrl}"  style="display:inline-block;background:#dc2626;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">🚫 Rejeitar</a>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;width:38%;border:1px solid #e5e7eb">Nome</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.name)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Área(s) de actividade</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(sectors)}</td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">CAE</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.cae || '—')}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Alvará</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.alvara || '—')}</td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Certidão Permanente</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.certidao_permanente || '—')}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Morada</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.address || '—')}</td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Cidade / Zona</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc([company.city, company.zone].filter(Boolean).join(' / ') || '—')}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Email</td>
        <td style="padding:10px 14px;border:1px solid #e5e7eb"><a href="mailto:${esc(company.email)}" style="color:#f97316">${esc(company.email || '—')}</a></td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Telefone / WhatsApp</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.phone || '—')}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Website</td>
        <td style="padding:10px 14px;border:1px solid #e5e7eb">${company.website ? `<a href="${esc(company.website)}" style="color:#f97316">${esc(company.website)}</a>` : '—'}</td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Especialidades</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(Array.isArray(company.tags) ? company.tags.join(', ') : (company.tags || '—'))}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Descrição</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.description || '—')}</td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Coordenadas</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${company.lat}, ${company.lng}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">ID na base de dados</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(String(company.id || '—'))}</td>
      </tr>
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Data de registo</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}</td>
      </tr>
    </table>

    <p style="color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;margin-bottom:0">
      Este email foi gerado automaticamente pelo sistema Hive Marketplace.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hive Marketplace" <${process.env.SMTP_USER}>`,
    to:      adminEmail,
    subject: `[Hive] ⏳ Nova empresa para validar: ${company.name}`,
    html,
  });
}

/**
 * Send a welcome / approval confirmation email to the company.
 */
async function sendCompanyApprovalEmail(company) {
  const transporter = createTransporter();
  if (!transporter || !company.email) return;

  const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#f97316;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Bem-vindo à Hive!</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151;font-size:16px">Olá, equipa da <strong>${esc(company.name)}</strong>,</p>
    <p style="color:#374151;font-size:16px">
      A vossa empresa foi <strong style="color:#16a34a">aprovada</strong> e já está visível na plataforma Hive!
      Clientes e parceiros podem agora encontrar-vos no mapa e contactar-vos directamente.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${appUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
        Ver a minha empresa no Hive →
      </a>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="color:#6b7280;font-size:13px;margin:0">
      Se tiverem alguma questão, respondam a este email ou contactem-nos em <a href="mailto:${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER)}" style="color:#f97316">${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER || '')}</a>.<br><br>
      Equipa Hive Marketplace
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hive Marketplace" <${process.env.SMTP_USER}>`,
    to:      company.email,
    subject: `✅ ${company.name} — Registo aprovado na Hive!`,
    html,
  });
}

/**
 * Optionally notify a company that their registration was not accepted.
 */
async function sendCompanyRejectionEmail(company) {
  const transporter = createTransporter();
  if (!transporter || !company.email) return;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#6b7280;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Hive — Pedido de registo</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151;font-size:16px">Olá, equipa da <strong>${esc(company.name)}</strong>,</p>
    <p style="color:#374151;font-size:16px">
      Após análise, não foi possível aprovar o vosso registo na plataforma Hive neste momento.
    </p>
    <p style="color:#374151;font-size:16px">
      Para mais informações ou para corrigir os dados submetidos, por favor contactem-nos directamente.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="color:#6b7280;font-size:13px;margin:0">
      Contacto: <a href="mailto:${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER)}" style="color:#f97316">${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER || '')}</a><br><br>
      Equipa Hive Marketplace
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hive Marketplace" <${process.env.SMTP_USER}>`,
    to:      company.email,
    subject: `Hive — Pedido de registo de ${company.name}`,
    html,
  });
}

// Minimal HTML escaping
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendRegistrationNotification, sendCompanyApprovalEmail, sendCompanyRejectionEmail };
