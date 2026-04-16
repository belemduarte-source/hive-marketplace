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
 * Silently skips if SMTP credentials are not configured.
 */
async function sendRegistrationNotification(company) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[email] SMTP not configured — skipping registration notification');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const sectors    = Array.isArray(company.sectors) ? company.sectors.join(', ') : (company.sector || '—');

  const html = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#f97316;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Hive — Nova empresa registada</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151">Uma nova empresa submeteu o registo na plataforma Hive e aguarda validação.</p>

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
    subject: `[Hive] Nova empresa para validar: ${company.name}`,
    html,
  });
}

// Minimal HTML escaping to prevent header injection / XSS in email
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendRegistrationNotification };
