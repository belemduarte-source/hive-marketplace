#!/usr/bin/env node
/*
 * claim-campaign.js — campanha "reclame e complete a sua ficha" da Hivex.
 *
 * Convida (UMA vez) cada empresa com ficha incompleta a reclamá-la e
 * completá-la. Alvo: fichas aprovadas, ainda da plataforma (não reclamadas),
 * com email e sem descrição OU sem logótipo.
 *
 * Âmbito legal (ver também o relatório da campanha):
 *  - só Portugal: em PT o email de marketing a PESSOAS COLETIVAS é permitido
 *    em regime de oposição (Lei 41/2004, art. 13.º-A, n.º 2); noutros países
 *    o regime é outro (ex.: DE exige consentimento prévio também em B2B);
 *  - só NIF de pessoa coletiva (começa por 5 ou 6): empresários em nome
 *    individual são pessoas singulares → exigiriam consentimento prévio;
 *  - fora quem recusou (email_optouts — partilhada com os pedidos de
 *    avaliação) e quem consta da lista de oposição da DGC (art. 13.º-B);
 *  - cada email identifica o remetente (HIVEX_ENTIDADE_LEGAL) e leva link de
 *    opt-out + cabeçalhos List-Unsubscribe (cancelamento num clique).
 *
 * Uso (porta 5432 bloqueada → driver HTTP do Neon; DATABASE_URL e SMTP_* vêm
 * do .env.diag na raiz do workspace quando não estão no ambiente):
 *   node hive/scripts/claim-campaign.js              # dry-run: contagens + exemplo
 *   node hive/scripts/claim-campaign.js --empresa 61611   # exemplo com essa ficha
 *   node hive/scripts/claim-campaign.js --teste      # 1 email de teste p/ ADMIN_EMAIL
 *   node hive/scripts/claim-campaign.js --teste-para eu@exemplo.pt [--empresa ID]
 *   node hive/scripts/claim-campaign.js --enviar --lista-dgc dgc.csv \
 *        [--teto-diario 50] [--lote 20] [--intervalo 30]
 *
 * O envio real (--enviar) exige: caixa dedicada CAMPAIGN_SMTP_USER/PASS
 * (+ opcional CAMPAIGN_SMTP_HOST/PORT, CAMPAIGN_FROM) — nunca a dos emails
 * essenciais; HIVEX_ENTIDADE_LEGAL (nome legal, NIF, morada); e a lista da DGC
 * em CSV/TXT com ≤ 31 dias. Teto diário contado em claim_invites (dia de
 * Lisboa), por isso pode correr-se várias vezes no mesmo dia sem o exceder.
 * Cada convite é reservado ANTES de enviar (nunca dois à mesma empresa).
 * 1 só processo; Ctrl+C termina depois do email em curso.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// Ambiente: só preenche o que falta; nunca imprime valores.
(function carregarEnv() {
  const f = path.resolve(__dirname, '..', '..', '.env.diag');
  if (!fs.existsSync(f)) return;
  for (const linha of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m || process.env[m[1]] != null) continue;
    process.env[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n');
  }
})();

let neon;
try { ({ neon } = require('@neondatabase/serverless')); }
catch (_) { ({ neon } = require(path.resolve(__dirname, '..', 'backend', 'node_modules', '@neondatabase', 'serverless'))); }
const sql = neon(process.env.DATABASE_URL);
const q = (text, params = []) => sql.query(text, params);
const { createTransporter, deliver, esc } = require('../backend/src/email');

// ── Argumentos ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n) => argv.includes('--' + n);
const opt = (n, def) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
};
const ENVIAR = flag('enviar');
const TESTE_PARA = opt('teste-para', null) || (flag('teste') ? (process.env.ADMIN_EMAIL || '').trim() : null);
const EMPRESA = opt('empresa', null);
const TETO = parseInt(opt('teto-diario', process.env.CAMPAIGN_DAILY_CAP || '50'), 10);
const LOTE = parseInt(opt('lote', '0'), 10) || Infinity;
const INTERVALO = parseFloat(opt('intervalo', '30'));          // segundos entre envios (±30%)
const LISTA_DGC = opt('lista-dgc', null);
const HTML_OUT = opt('html', path.join(os.tmpdir(), 'claim-campaign-exemplo.html'));

const BASE = 'https://www.hivex.pt';
const PLATAFORMA = 7;   // created_by das fichas importadas, ainda não reclamadas
const REMETENTE = (process.env.HIVEX_ENTIDADE_LEGAL || '').trim();
const RESPOSTA = (process.env.CAMPAIGN_REPLY_TO || 'geral.hivex@gmail.com').trim();
const EMAIL_OK = /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i;
const NIF_COLETIVA = /^[56]\d{8}$/;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Cópia de hivexSlugify (backend/src/app.js) — URL canónica /c/{id}-{slug}.
const slugify = s => String(s == null ? '' : s)
  .replace(/ß/g, 'ss').replace(/[æÆ]/g, 'ae').replace(/[øØ]/g, 'o').replace(/[œŒ]/g, 'oe').replace(/[łŁ]/g, 'l')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80) || 'empresa';

// ── Tabela de envios (mesma DDL da migração v10 em backend/src/app.js) ──────
const DDL = [
  `CREATE TABLE IF NOT EXISTS claim_invites (
     id         BIGSERIAL PRIMARY KEY,
     company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     email      TEXT NOT NULL,
     token      TEXT NOT NULL UNIQUE,
     status     TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved','sent','failed','test')),
     transport  TEXT,
     message_id TEXT,
     error      TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     sent_at    TIMESTAMPTZ
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uq_claim_invites_company ON claim_invites(company_id) WHERE status <> 'test'`,
  `CREATE INDEX IF NOT EXISTS idx_claim_invites_email ON claim_invites(email)`,
];
async function tabelaExiste() {
  const r = await q(`SELECT to_regclass('claim_invites') IS NOT NULL AS ok`);
  return r[0].ok;
}

// ── Seleção ──────────────────────────────────────────────────────────────────
const ALVO = `
      c.status = 'approved' AND c.removed_at IS NULL
  AND (c.created_by IS NULL OR c.created_by = ${PLATAFORMA})
  AND c.email IS NOT NULL AND btrim(c.email) <> ''
  AND (c.description IS NULL OR btrim(c.description) = '' OR c.logo IS NULL OR c.logo = '')`;
const CAMPOS = `
  c.id, c.name, lower(btrim(c.email)) AS email, c.city, c.alvara,
  regexp_replace(coalesce(c.nif, ''), '[^0-9]', '', 'g') AS nif,
  (c.description IS NULL OR btrim(c.description) = '') AS sem_descricao,
  (c.logo IS NULL OR c.logo = '') AS sem_logo`;

async function universo() {
  return q(`SELECT lower(coalesce(c.country, 'pt')) AS pais, count(*)::int AS n
              FROM companies c WHERE ${ALVO} GROUP BY 1 ORDER BY 2 DESC`);
}

async function candidatasPT(temTabela) {
  const convidada = temTabela
    ? `EXISTS (SELECT 1 FROM claim_invites ci WHERE ci.status <> 'test'
                 AND (ci.company_id = c.id OR ci.email = lower(btrim(c.email))))`
    : 'FALSE';
  return q(`SELECT ${CAMPOS},
       EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = lower(btrim(c.email))) AS optout,
       ${convidada} AS convidada
     FROM companies c
    WHERE ${ALVO} AND lower(coalesce(c.country, 'pt')) = 'pt'
    ORDER BY c.id`);
}

function carregarListaDgc(f) {
  const txt = fs.readFileSync(f, 'utf8');
  return {
    ficheiro: f,
    dias: (Date.now() - fs.statSync(f).mtimeMs) / 864e5,
    emails: new Set((txt.match(/[^\s@,;"'<>]+@[^\s@,;"'<>]+\.[a-z]{2,}/gi) || []).map(s => s.toLowerCase())),
    nifs: new Set(txt.match(/\b\d{9}\b/g) || []),
  };
}

function filtrar(rows, dgc) {
  const st = { candidatas: rows.length, singular_ou_sem_nif: 0, optout: 0, ja_convidada: 0,
               email_invalido: 0, lista_dgc: 0, email_repetido: 0 };
  const vistos = new Set(), elegiveis = [];
  for (const r of rows) {
    if (!NIF_COLETIVA.test(r.nif)) { st.singular_ou_sem_nif++; continue; }
    if (r.optout) { st.optout++; continue; }
    if (r.convidada) { st.ja_convidada++; continue; }
    if (!EMAIL_OK.test(r.email)) { st.email_invalido++; continue; }
    if (dgc && (dgc.emails.has(r.email) || dgc.nifs.has(r.nif))) { st.lista_dgc++; continue; }
    if (vistos.has(r.email)) { st.email_repetido++; continue; }   // 1 email por endereço
    vistos.add(r.email);
    elegiveis.push(r);
  }
  return { st, elegiveis };
}

async function enviadosHoje(temTabela) {
  if (!temTabela) return 0;
  const r = await q(`SELECT count(*)::int AS n FROM claim_invites
     WHERE status <> 'test'
       AND created_at >= (date_trunc('day', now() AT TIME ZONE 'Europe/Lisbon') AT TIME ZONE 'Europe/Lisbon')`);
  return r[0].n;
}

// ── Email ────────────────────────────────────────────────────────────────────
function construirEmail(r, token, { teste = false } = {}) {
  const ficha = `${BASE}/?company=${r.id}`;
  const publica = `${BASE}/c/${r.id}-${slugify(r.name)}`;
  const optout = `${BASE}/api/reviews/optout?i=${token}`;
  const falta = r.sem_logo && r.sem_descricao ? 'logótipo nem descrição'
    : r.sem_logo ? 'logótipo' : 'descrição';
  const alv = (String(r.alvara || '').match(/\d+/) || [''])[0];
  const origem = alv ? ` do registo no IMPIC (alvará n.º ${alv})` : '';
  const remetente = REMETENTE || '[FALTA: identificação legal do remetente — HIVEX_ENTIDADE_LEGAL]';
  const motivo = `Recebe este email porque ${r.email} é o contacto público da ${r.name}` +
    (alv ? ' no registo do IMPIC' : '') + '. É um convite único: não enviamos lembretes.';
  const vantagens = [
    'acrescentar logótipo, descrição, até 6 fotografias de obras e horário;',
    'corrigir contactos, morada e áreas de atividade;',
    'responder pela plataforma a mensagens e pedidos de orçamento de clientes;',
    'responder a avaliações e ver as estatísticas de visitas e contactos da ficha.',
  ];

  const subject = `${teste ? '[TESTE] ' : ''}A ficha da ${r.name} na Hivex`;

  const text = [
    'Olá,',
    '',
    `A ${r.name} aparece na Hivex (hivex.pt), um mapa de empresas de construção onde particulares e empresas procuram profissionais e pedem orçamentos. A ficha foi criada com dados públicos${origem}.`,
    '',
    `Neste momento a ficha não tem ${falta}. Pode completá-la gratuitamente em poucos minutos:`,
    '',
    `1. Abra a ficha: ${ficha}`,
    '2. Clique em «É a sua empresa? Reclame esta ficha» e inicie sessão (com Google ou email).',
    `3. Introduza o código de 6 dígitos que enviamos para este endereço (${r.email}) — é assim que confirmamos que a empresa é sua.`,
    '',
    'Com a ficha reclamada pode:',
    ...vantagens.map(v => '- ' + v),
    '',
    'Reclamar e manter a ficha não tem custos.',
    '',
    'Se algum dado estiver errado, ou se preferir que a ficha seja removida, basta responder a este email.',
    '',
    'Cumprimentos,',
    'Equipa Hivex',
    '',
    '--',
    motivo,
    `Não quero receber emails da Hivex: ${optout}`,
    `${remetente} · hivex.pt · ${RESPOSTA}`,
  ].join('\n');

  const co = esc(r.name);
  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:#f97316;padding:18px 28px">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:700">🐝 Hivex</p>
  </div>
  <div style="padding:26px 28px;color:#374151;font-size:15px;line-height:1.65">
    <p style="margin-top:0">Olá,</p>
    <p>A <strong>${co}</strong> aparece na <a href="${BASE}" style="color:#f97316">Hivex</a>, um mapa de empresas de construção onde particulares e empresas procuram profissionais e pedem orçamentos. A ficha foi criada com dados públicos${esc(origem)}.</p>
    <p>Neste momento a ficha não tem <strong>${falta}</strong>. Pode completá-la gratuitamente em poucos minutos:</p>
    <ol style="padding-left:20px;margin:12px 0 18px">
      <li>Abra a <a href="${ficha}" style="color:#f97316;font-weight:700">ficha da ${co}</a>;</li>
      <li>Clique em <strong>&laquo;É a sua empresa? Reclame esta ficha&raquo;</strong> e inicie sessão (com Google ou email);</li>
      <li>Introduza o código de 6 dígitos que enviamos para este endereço (${esc(r.email)}) — é assim que confirmamos que a empresa é sua.</li>
    </ol>
    <p style="text-align:center;margin:24px 0">
      <a href="${ficha}" style="display:inline-block;background:#f97316;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Abrir a ficha da ${co} →</a>
    </p>
    <p style="margin-bottom:6px">Com a ficha reclamada pode:</p>
    <ul style="padding-left:20px;margin:0 0 16px">${vantagens.map(v => `<li>${esc(v)}</li>`).join('')}</ul>
    <p>Reclamar e manter a ficha <strong>não tem custos</strong>.</p>
    <p>Se algum dado estiver errado, ou se preferir que a ficha seja removida, basta responder a este email.</p>
    <p style="margin-bottom:0">Cumprimentos,<br>Equipa Hivex</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0 14px">
    <p style="color:#9ca3af;font-size:12px;line-height:1.55;margin:0">
      ${esc(motivo)}<br>
      <a href="${optout}" style="color:#9ca3af">Não quero receber emails da Hivex</a> ·
      <a href="${publica}" style="color:#9ca3af">ficha pública</a><br>
      ${esc(remetente)} · <a href="${BASE}" style="color:#9ca3af">hivex.pt</a> · ${esc(RESPOSTA)}
    </p>
  </div>
</div>`;

  const headers = {
    'List-Unsubscribe': `<${optout}>, <mailto:${RESPOSTA}?subject=${encodeURIComponent('Remover ' + r.email)}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
  return { subject, text, html, headers, ficha };
}

// ── Transporte ───────────────────────────────────────────────────────────────
// Campanha: SÓ a caixa dedicada (CAMPAIGN_SMTP_*). Teste: caixa dedicada se
// existir, senão o fornecedor dos emails da plataforma (1 email ao dono).
function transporteCampanha() {
  const t = createTransporter('CAMPAIGN_SMTP_');
  if (!t) return null;
  const user = String(process.env.CAMPAIGN_SMTP_USER).trim();
  return {
    nome: 'campaign-smtp',
    async enviar(to, m) {
      const info = await t.sendMail({
        from: (process.env.CAMPAIGN_FROM || '').trim() || `"Equipa Hivex" <${user}>`,
        to, replyTo: RESPOSTA, subject: m.subject, text: m.text, html: m.html, headers: m.headers,
      });
      return info.messageId || null;
    },
  };
}
function transportePrincipal() {
  return {
    nome: 'plataforma',
    async enviar(to, m) {
      const r = await deliver({ to, replyTo: RESPOSTA, subject: m.subject, html: m.html, text: m.text, headers: m.headers });
      if (!r) throw new Error('nenhum fornecedor de email configurado (SMTP_* / RESEND_API_KEY+EMAIL_FROM)');
      this.nome = 'plataforma:' + r.provider;
      return r.id;
    },
  };
}

// Falha permanente do destinatário (endereço recusado) → fica 'failed' e não
// se repete; falha de transporte (rede, autenticação, quota) → a reserva é
// apagada para a empresa voltar a ser elegível na próxima corrida.
const falhaDoDestinatario = (e) => e && e.responseCode >= 550 && e.responseCode < 560 && /RCPT/i.test(e.command || '');

// ── Main ─────────────────────────────────────────────────────────────────────
function linha(rotulo, valor) { console.log(('  ' + rotulo).padEnd(46, ' ') + valor); }

async function main() {
  if (flag('ajuda') || flag('help')) {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
    return;
  }
  if (ENVIAR && TESTE_PARA) throw new Error('--enviar e --teste são exclusivos');
  if (!Number.isFinite(TETO) || TETO < 1) throw new Error('--teto-diario inválido');

  let temTabela = await tabelaExiste();
  const dgc = LISTA_DGC ? carregarListaDgc(LISTA_DGC) : null;

  const uni = await universo();
  const rows = await candidatasPT(temTabela);
  const { st, elegiveis } = filtrar(rows, dgc);
  const hoje = await enviadosHoje(temTabela);
  const restanteHoje = Math.max(0, TETO - hoje);
  const nestaCorrida = Math.min(elegiveis.length, restanteHoje, LOTE);

  console.log('\nCampanha "reclame e complete a sua ficha" — ' +
    (ENVIAR ? 'ENVIO REAL' : TESTE_PARA ? 'ENVIO DE TESTE' : 'DRY-RUN (nada é enviado)'));
  console.log('\nUniverso (aprovadas, não reclamadas, com email, sem descrição ou sem logo):');
  linha('total', uni.reduce((s, x) => s + x.n, 0));
  linha('por país', uni.slice(0, 8).map(x => `${x.pais} ${x.n}`).join(' · '));
  console.log('\nÂmbito: Portugal, pessoa coletiva (NIF 5/6…)');
  linha('candidatas PT', st.candidatas);
  linha('− pessoa singular / sem NIF', st.singular_ou_sem_nif);
  linha('− recusaram emails (email_optouts)', st.optout);
  linha('− já convidadas', st.ja_convidada);
  linha('− email inválido', st.email_invalido);
  linha('− lista de oposição DGC', dgc ? `${st.lista_dgc}  (${dgc.emails.size} emails, ${dgc.nifs.size} NIF, ficheiro com ${dgc.dias.toFixed(0)} dias)` : 'não carregada (--lista-dgc)');
  linha('− mesmo email noutra ficha (1 por endereço)', st.email_repetido);
  linha('= ELEGÍVEIS', elegiveis.length);
  linha('   sem logo · sem descrição · sem ambos',
    `${elegiveis.filter(r => r.sem_logo && !r.sem_descricao).length} · ` +
    `${elegiveis.filter(r => r.sem_descricao && !r.sem_logo).length} · ` +
    `${elegiveis.filter(r => r.sem_logo && r.sem_descricao).length}`);
  console.log('\nRitmo:');
  linha('teto diário', `${TETO}  (hoje já: ${hoje}, resta: ${restanteHoje})`);
  linha('esta corrida enviaria', nestaCorrida);
  linha('dias até ao fim ao teto atual', Math.ceil(elegiveis.length / TETO));
  if (temTabela) {
    const tot = await q(`SELECT status, count(*)::int AS n FROM claim_invites GROUP BY 1 ORDER BY 1`);
    linha('claim_invites até agora', tot.length ? tot.map(x => `${x.status} ${x.n}`).join(' · ') : '(vazia)');
  } else {
    linha('claim_invites', 'tabela ainda não existe (criada pela migração v10 no deploy ou no 1.º envio)');
  }

  // Ficha de exemplo / de teste
  let ex = elegiveis[0];
  if (EMPRESA) {
    const r = await q(`SELECT ${CAMPOS} FROM companies c WHERE c.id = $1`, [EMPRESA]);
    if (!r[0]) throw new Error('empresa ' + EMPRESA + ' não existe');
    ex = r[0];
  }

  // ── Dry-run ────────────────────────────────────────────────────────────────
  if (!ENVIAR && !TESTE_PARA) {
    if (!ex) { console.log('\nNenhuma ficha elegível.'); return; }
    const m = construirEmail(ex, '0'.repeat(32));
    fs.writeFileSync(HTML_OUT, `<!doctype html><meta charset="utf-8"><title>${esc(m.subject)}</title>${m.html}`);
    console.log(`\nExemplo (ficha ${ex.id}):`);
    console.log('  Para:     ' + ex.email.replace(/^(.).*(@.*)$/, '$1***$2'));
    console.log('  Assunto:  ' + m.subject);
    console.log('  HTML:     ' + HTML_OUT);
    console.log('\n' + m.text.split('\n').map(l => '  │ ' + l).join('\n'));
    const faltas = requisitosEnvio(dgc);
    console.log('\nPara o envio real falta: ' + (faltas.length ? '\n  - ' + faltas.join('\n  - ') : 'nada.'));
    return;
  }

  if (!temTabela) { for (const s of DDL) await q(s); temTabela = true; }

  // ── Teste ──────────────────────────────────────────────────────────────────
  if (TESTE_PARA) {
    if (!EMAIL_OK.test(TESTE_PARA)) throw new Error('--teste-para precisa de um email (ou ADMIN_EMAIL no .env.diag)');
    if (!ex) throw new Error('sem ficha para o exemplo — use --empresa ID');
    const t = transporteCampanha() || transportePrincipal();
    const token = crypto.randomBytes(16).toString('hex');
    await q(`INSERT INTO claim_invites (company_id, email, token, status, transport) VALUES ($1, $2, $3, 'test', $4)`,
      [ex.id, TESTE_PARA.toLowerCase(), token, t.nome]);
    const m = construirEmail(ex, token, { teste: true });
    const id = await t.enviar(TESTE_PARA, m);
    await q(`UPDATE claim_invites SET sent_at = NOW(), message_id = $2, transport = $3 WHERE token = $1`, [token, id, t.nome]);
    console.log(`\nTeste enviado (ficha ${ex.id}) para ${TESTE_PARA.replace(/^(.).*(@.*)$/, '$1***$2')} via ${t.nome}.`);
    console.log('A empresa NÃO fica marcada como convidada. O link de opt-out do teste funciona (recusa esse endereço).');
    return;
  }

  // ── Envio real ─────────────────────────────────────────────────────────────
  const faltas = requisitosEnvio(dgc);
  if (faltas.length) {
    console.error('\nEnvio real recusado. Falta:\n  - ' + faltas.join('\n  - '));
    process.exitCode = 2;
    return;
  }
  if (!nestaCorrida) { console.log('\nNada a enviar nesta corrida (teto do dia atingido ou sem elegíveis).'); return; }
  const t = transporteCampanha();   // garantido por requisitosEnvio
  console.log(`\nA enviar ${nestaCorrida} convites via ${t.nome} dentro de 10 s — Ctrl+C para cancelar.`);
  await sleep(10000);

  let parar = false;
  process.on('SIGINT', () => { parar = true; console.log('\nA parar depois do email em curso…'); });
  let enviados = 0, falhados = 0, seguidas = 0;
  for (const r of elegiveis.slice(0, nestaCorrida)) {
    if (parar) break;
    const token = crypto.randomBytes(16).toString('hex');
    const ins = await q(
      `INSERT INTO claim_invites (company_id, email, token, status, transport) VALUES ($1, $2, $3, 'reserved', $4)
       ON CONFLICT (company_id) WHERE status <> 'test' DO NOTHING RETURNING id`,
      [r.id, r.email, token, t.nome]);
    if (!ins[0]) continue;
    try {
      const id = await t.enviar(r.email, construirEmail(r, token));
      await q(`UPDATE claim_invites SET status = 'sent', sent_at = NOW(), message_id = $2 WHERE id = $1`, [ins[0].id, id]);
      enviados++; seguidas = 0;
      console.log(`  ✓ ${r.id} ${r.name}`);
    } catch (e) {
      if (falhaDoDestinatario(e)) {
        await q(`UPDATE claim_invites SET status = 'failed', error = $2 WHERE id = $1`, [ins[0].id, String(e.message).slice(0, 300)]);
        falhados++;
        console.log(`  ✗ ${r.id} ${r.name} — destinatário recusado: ${e.message}`);
      } else {
        await q(`DELETE FROM claim_invites WHERE id = $1 AND status = 'reserved'`, [ins[0].id]);
        seguidas++;
        console.log(`  ! ${r.id} ${r.name} — falha de envio (fica para a próxima corrida): ${e.message}`);
        if (seguidas >= 3) { console.error('\n3 falhas de transporte seguidas — a parar.'); process.exitCode = 1; break; }
      }
    }
    await sleep(INTERVALO * 1000 * (0.7 + Math.random() * 0.6));
  }
  console.log(`\nFeito: ${enviados} enviados, ${falhados} recusados. Elegíveis por enviar: ${elegiveis.length - enviados - falhados}.`);
}

function requisitosEnvio(dgc) {
  const faltas = [];
  if (!createTransporter('CAMPAIGN_SMTP_')) faltas.push('CAMPAIGN_SMTP_USER/CAMPAIGN_SMTP_PASS — caixa dedicada à campanha (nunca a dos emails essenciais)');
  if (!REMETENTE) faltas.push('HIVEX_ENTIDADE_LEGAL — nome legal, NIF e morada do remetente (DL 7/2004, art. 21.º)');
  if (!dgc) faltas.push('--lista-dgc FICHEIRO — lista de oposição da DGC (Lei 41/2004, art. 13.º-B)');
  else if (dgc.dias > 31) faltas.push(`lista da DGC com ${dgc.dias.toFixed(0)} dias — pedir versão atual (atualização mensal)`);
  return faltas;
}

main().catch(e => { console.error('\nErro:', e.message); process.exit(1); });
