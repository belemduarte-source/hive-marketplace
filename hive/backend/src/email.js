const nodemailer = require('nodemailer');

// Build a transporter lazily so missing env vars don't crash startup
function createTransporter() {
  // Strip BOM/zero-width chars and surrounding whitespace — common when env values
  // are pasted from docs or copied through tools that prefix a U+FEFF marker.
  const clean = (v) => (v == null ? '' : String(v)).replace(/^[﻿​\s]+|[﻿​\s]+$/g, '');
  const host = clean(process.env.SMTP_HOST) || 'smtp.gmail.com';
  const portStr = clean(process.env.SMTP_PORT) || '465';
  const user = clean(process.env.SMTP_USER);
  const pass = clean(process.env.SMTP_PASS);
  if (!user || !pass) return null;

  const port = parseInt(portStr, 10);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
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
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Hivex — Nova empresa a aguardar validação</h1>
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
      Este email foi gerado automaticamente pelo sistema Hivex Marketplace.
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hivex Marketplace" <${process.env.SMTP_USER}>`,
    to:      adminEmail,
    subject: `[Hivex] ⏳ Nova empresa para validar: ${company.name}`,
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
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Bem-vindo à Hivex!</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151;font-size:16px">Olá, equipa da <strong>${esc(company.name)}</strong>,</p>
    <p style="color:#374151;font-size:16px">
      A vossa empresa foi <strong style="color:#16a34a">aprovada</strong> e já está visível na plataforma Hivex!
      Clientes e parceiros podem agora encontrar-vos no mapa e contactar-vos directamente.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${appUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
        Ver a minha empresa no Hivex →
      </a>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="color:#6b7280;font-size:13px;margin:0">
      Se tiverem alguma questão, respondam a este email ou contactem-nos em <a href="mailto:${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER)}" style="color:#f97316">${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER || '')}</a>.<br><br>
      Equipa Hivex Marketplace
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hivex Marketplace" <${process.env.SMTP_USER}>`,
    to:      company.email,
    subject: `✅ ${company.name} — Registo aprovado na Hivex!`,
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
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Hivex — Pedido de registo</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151;font-size:16px">Olá, equipa da <strong>${esc(company.name)}</strong>,</p>
    <p style="color:#374151;font-size:16px">
      Após análise, não foi possível aprovar o vosso registo na plataforma Hivex neste momento.
    </p>
    <p style="color:#374151;font-size:16px">
      Para mais informações ou para corrigir os dados submetidos, por favor contactem-nos directamente.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="color:#6b7280;font-size:13px;margin:0">
      Contacto: <a href="mailto:${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER)}" style="color:#f97316">${esc(process.env.ADMIN_EMAIL || process.env.SMTP_USER || '')}</a><br><br>
      Equipa Hivex Marketplace
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hivex Marketplace" <${process.env.SMTP_USER}>`,
    to:      company.email,
    subject: `Hivex — Pedido de registo de ${company.name}`,
    html,
  });
}

// CTA no rodapé dos emails enviados às empresas: quem já reclamou a ficha é
// convidado a INICIAR SESSÃO para responder no chat; quem ainda não tem conta
// é convidado a registar-se e reclamar a ficha (fica associada ao seu login).
function companyReplyCtaHtml(company) {
  const claimed = company.created_by != null && String(company.created_by) !== '7';
  const deepLink = `https://hivex.pt/?company=${company.id}`;
  if (claimed) {
    return `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin:18px 0">
        <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.6">
          <strong>Responda pela plataforma:</strong> inicie sessão em
          <a href="https://hivex.pt" style="color:#1d4ed8;font-weight:700">hivex.pt</a>
          e abra as mensagens da sua empresa — a conversa e os documentos ficam guardados durante 90 dias.
        </p>
      </div>`;
  }
  return `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin:18px 0">
      <p style="margin:0 0 8px;color:#1e40af;font-size:14px;line-height:1.6">
        <strong>Ainda não gere a sua ficha no Hivex?</strong> Registe-se gratuitamente e associe
        <strong>${esc(company.name)}</strong> à sua conta para responder pela plataforma e receber pedidos de clientes:
      </p>
      <ol style="margin:0;padding-left:18px;color:#1e40af;font-size:13px;line-height:1.7">
        <li>Crie a sua conta grátis em <a href="https://hivex.pt" style="color:#1d4ed8;font-weight:700">hivex.pt</a></li>
        <li>Abra a <a href="${deepLink}" style="color:#1d4ed8;font-weight:700">página da sua empresa</a></li>
        <li>Clique em <strong>&laquo;É a sua empresa? Reclame esta ficha&raquo;</strong> — receberá um código de confirmação neste email</li>
      </ol>
    </div>`;
}

/**
 * Relay a contact form message to a company's email address.
 * The sender's email is shown in the email body but the company's
 * address is never exposed to the frontend.
 */
async function sendContactEmail(company, sender, message) {
  const transporter = createTransporter();
  if (!transporter || !company.email) return;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#2563eb;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:20px">Hivex — Nova mensagem de contacto</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151;font-size:15px">
      Recebeu uma mensagem através da plataforma <strong>Hivex Marketplace</strong>:
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f9fafb">
        <td style="padding:10px 14px;font-weight:700;color:#111827;width:30%;border:1px solid #e5e7eb">De</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(sender.name)} &lt;${esc(sender.email)}&gt;</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:700;color:#111827;border:1px solid #e5e7eb">Para</td>
        <td style="padding:10px 14px;color:#374151;border:1px solid #e5e7eb">${esc(company.name)}</td>
      </tr>
    </table>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:8px">
      <p style="margin:0;color:#1f2937;font-size:15px;line-height:1.7;white-space:pre-wrap">${esc(message)}</p>
    </div>
    ${companyReplyCtaHtml(company)}
    <p style="color:#6b7280;font-size:13px;margin:0">
      Também pode responder diretamente por email: <a href="mailto:${esc(sender.email)}" style="color:#1d4ed8">${esc(sender.email)}</a><br><br>
      Equipa Hivex Marketplace
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hivex Marketplace" <${process.env.SMTP_USER}>`,
    to:      company.email,
    replyTo: sender.email,
    subject: `[Hivex] Mensagem de ${sender.name} para ${company.name}`,
    html,
  });
}

/**
 * Password reset email — single-use link valid for 60 minutes.
 */
async function sendPasswordResetEmail(user, resetUrl) {
  const transporter = createTransporter();
  if (!transporter || !user.email) return;

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#f97316;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:22px">🐝 Hivex — Recuperação de palavra-passe</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="margin-top:0;color:#374151;font-size:16px">Olá, ${esc(user.name || '')}.</p>
    <p style="color:#374151;font-size:16px">
      Recebemos um pedido para redefinir a sua palavra-passe na Hivex. Clique no botão abaixo para escolher uma nova palavra-passe — a hiperligação é válida durante <strong>60 minutos</strong>.
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${resetUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
        Redefinir palavra-passe →
      </a>
    </div>
    <p style="color:#6b7280;font-size:13px">
      Se o botão não funcionar, copie e cole esta hiperligação no navegador:<br>
      <span style="word-break:break-all;color:#374151">${esc(resetUrl)}</span>
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="color:#6b7280;font-size:13px;margin:0">
      Se não foi você que pediu esta recuperação, pode ignorar este email — a sua palavra-passe não será alterada.<br><br>
      Equipa Hivex Marketplace
    </p>
  </div>
</div>`;

  await transporter.sendMail({
    from:    `"Hivex Marketplace" <${process.env.SMTP_USER}>`,
    to:      user.email,
    subject: '🔑 Hivex — Recuperação de palavra-passe',
    html,
  });
}

// Generic branded email — one template for all the newer notification types
// (claim codes, quote requests, quote replies, review alerts, feature
// requests). bodyHtml is trusted template HTML built by the caller; user
// content inside it must be escaped by the caller via esc().
async function sendBrandedEmail({ to, replyTo, subject, title, bodyHtml }) {
  const transporter = createTransporter();
  if (!transporter || !to) return;
  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#f97316;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:20px">🐝 ${esc(title)}</h1>
  </div>
  <div style="padding:28px 32px;color:#374151;font-size:15px;line-height:1.65">
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
    <p style="color:#6b7280;font-size:13px;margin:0">Equipa Hivex Marketplace · <a href="https://www.hivex.pt" style="color:#f97316">hivex.pt</a></p>
  </div>
</div>`;
  await transporter.sendMail({
    from: `"Hivex Marketplace" <${process.env.SMTP_USER}>`,
    to,
    ...(replyTo ? { replyTo } : {}),
    subject,
    html,
  });
}

/**
 * Email de boas-vindas no registo de conta (sem verificação obrigatória:
 * a conta fica ativa imediatamente e este email é apenas um acolhimento).
 * Best-effort — nunca bloqueia o registo.
 */
async function sendWelcomeEmail(user) {
  await sendBrandedEmail({
    to: user.email,
    subject: 'Bem-vindo à Hivex! 🐝',
    title: `Bem-vindo à Hivex, ${user.name || ''}!`.trim(),
    bodyHtml: `
    <p style="margin-top:0">A sua conta está <strong>ativa</strong> — não precisa de confirmar nada.</p>
    <p>Com a Hivex pode, desde já:</p>
    <ul style="padding-left:20px;margin:12px 0 20px">
      <li>🔎 Encontrar <strong>milhares de empresas de construção</strong> perto de si, em Portugal e em todo o mundo;</li>
      <li>⭐ Comparar empresas e receber as <strong>3 melhores recomendações</strong> para o seu projeto;</li>
      <li>📩 Pedir orçamentos a várias empresas de uma só vez e falar com elas por mensagem;</li>
      <li>🏗️ Registar a <strong>sua própria empresa</strong> e aparecer no mapa.</li>
    </ul>
    <p style="text-align:center;margin:26px 0">
      <a href="https://www.hivex.pt" style="display:inline-block;background:#f97316;color:#fff;padding:14px 34px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Começar a explorar →</a>
    </p>
    <p style="color:#6b7280;font-size:13px">Precisa de ajuda? Basta responder a este email.</p>`,
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

module.exports = {
  sendRegistrationNotification, sendCompanyApprovalEmail, sendCompanyRejectionEmail,
  sendContactEmail, sendPasswordResetEmail, sendBrandedEmail, sendWelcomeEmail, esc, companyReplyCtaHtml,
};
