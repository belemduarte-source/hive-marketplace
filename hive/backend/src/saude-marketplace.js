// Saúde do marketplace (painel de administração, GET /api/admin/marketplace-health):
// os pedidos dos clientes são respondidos? onde faltam empresas? Só SQL de
// agregação e só contagens na resposta — nada de nomes, emails ou texto livre:
// a localidade escrita pelo cliente só sai como concelho/distrito da tabela
// fechada de distritos.js, e uma área só sai pelo nome se existir em fichas
// aprovadas (o resto conta como 'outro').
//
// Canais (pedido → 1.ª resposta registada na Hivex):
//   mensagens   conversa (empresa + email do cliente) cuja 1.ª mensagem é do
//               cliente → a empresa escreve nessa conversa;
//   orcamentos  pedido de orçamento a várias empresas, um por cliente, área e
//               dia: quem o repete (o formulário sugere outra área quando não
//               chega a ninguém) conta uma vez, pela última tentativa → uma
//               empresa escreve a esse cliente depois do pedido (só as
//               destinatárias, onde estão registadas: desde 2026-10-30). Os que
//               não chegaram a nenhuma empresa ficam fora da taxa e contam em
//               sem_empresas;
//   convites    convite de concurso enviado (sem concursos de teste) → proposta
//               ou "não vamos concorrer" (1.ª entrada no tender_access_log).
// Respostas por email direto (fora da Hivex) não se veem. Uma ficha é
// reclamada com created_by preenchido e diferente da conta da plataforma (7).
const pool = require('./db');
const { MAPA, SQL_NORM } = require('./distritos');

const PLATAFORMA = 7;
const AREA = `'^[a-z_]{2,40}$'`;
const PROCURA_MAX = 60;
const SEM_EMPRESAS_MAX = 50;

// Início da janela: meia-noite de Lisboa de há ($1 - 1) dias — "7 dias" = hoje
// e os 6 anteriores, como no funil (/admin/site-events)
const SQL_LIM = `lim AS (
  SELECT (((now() AT TIME ZONE 'Europe/Lisbon')::date - ($1::int - 1))::timestamp
           AT TIME ZONE 'Europe/Lisbon') AS desde
)`;

// Conversas do chat. A de um pedido de orçamento começa com a empresa; quando
// começa com o cliente, a 1.ª mensagem da empresa é a resposta.
const SQL_CONVERSAS = `conversas AS (
  SELECT company_id, lower(client_email) AS email, MIN(created_at) AS inicio,
         (ARRAY_AGG(sender ORDER BY created_at, id))[1] AS primeiro,
         MIN(created_at) FILTER (WHERE sender = 'company') AS resposta
    FROM messages
   GROUP BY company_id, lower(client_email)
)`;

// Pedidos de orçamento da janela, um por cliente, área e dia (a última tentativa)
const SQL_ORCAMENTOS = `orcamentos AS (
  SELECT DISTINCT ON (lower(q.client_email), q.sector, (q.created_at AT TIME ZONE 'Europe/Lisbon')::date)
         q.id, q.created_at, q.client_email, q.sector, q.city, q.lat, q.lng, q.notified_count
    FROM quote_requests q
   WHERE q.created_at >= (SELECT desde FROM lim)
   ORDER BY lower(q.client_email), q.sector, (q.created_at AT TIME ZONE 'Europe/Lisbon')::date, q.created_at DESC, q.id DESC
)`;

// Um pedido por linha: canal, quando, se chegou a alguma empresa e a 1.ª resposta
const SQL_PEDIDOS = `pedidos AS (
  SELECT 'mensagens'::text AS canal, c.inicio, TRUE AS enviado, c.resposta
    FROM conversas c
   WHERE c.primeiro = 'client' AND c.inicio >= (SELECT desde FROM lim)
  UNION ALL
  SELECT 'orcamentos', q.created_at, q.notified_count > 0,
         MIN(m.created_at) FILTER (WHERE q.notified_count > 0)
    FROM orcamentos q
    LEFT JOIN messages m
      ON m.sender = 'company' AND lower(m.client_email) = lower(q.client_email) AND m.created_at > q.created_at
     AND (NOT EXISTS (SELECT 1 FROM quote_request_recipients r WHERE r.request_id = q.id)
          OR EXISTS (SELECT 1 FROM quote_request_recipients r WHERE r.request_id = q.id AND r.company_id = m.company_id))
   GROUP BY q.id, q.created_at, q.notified_count
  UNION ALL
  SELECT 'convites', i.sent_at, TRUE,
         COALESCE(MIN(l.created_at), LEAST(MIN(p.submitted_at), MIN(i.declined_at)))
    FROM tender_invites i
    JOIN tenders t ON t.id = i.tender_id AND NOT t.is_test
    LEFT JOIN tender_proposals p ON p.invite_id = i.id
    LEFT JOIN tender_access_log l ON l.tender_id = i.tender_id AND l.invite_id = i.id
     AND l.actor = 'company' AND l.action IN ('proposal', 'decline')
   WHERE i.status = 'sent' AND i.sent_at >= (SELECT desde FROM lim)
   GROUP BY i.id, i.sent_at
)`;

// Quadrícula de 0,05° (~5 km) de uma coordenada
const celula = (a) => `floor(${a}.lat / 0.05)::int AS gy, floor(${a}.lng / 0.05)::int AS gx`;

// Localidade → concelho/distrito. Primeiro pelo nome (o texto inteiro, o que
// está entre parênteses, antes do parêntese/vírgula, depois da última vírgula:
// "Chave (Arouca)", "Funchal (Madeira)", "Estrela, Lisboa"); sem nome
// reconhecido, pelo concelho mais comum entre as fichas da mesma quadrícula —
// as freguesias e vilas que não são concelho. Precisa das CTE cidades (os
// textos a resolver) e empresas (com gy/gx).
const SQL_LOCAIS = `mapa(k, concelho, distrito) AS (
  SELECT * FROM unnest($2::text[], $3::text[], $4::text[])
),
candidatas AS (
  SELECT ci.city, cand.o, cand.k
    FROM cidades ci
    CROSS JOIN LATERAL (SELECT regexp_replace(ci.city, '[0-9]{4}[[:space:]]*-[[:space:]]*[0-9]{3}', ' ', 'g') AS x) s
    CROSS JOIN LATERAL (VALUES
      (1, ${SQL_NORM('s.x')}),
      (2, ${SQL_NORM(`substring(s.x from '[(]([^)]*)[)]')`)}),
      (3, ${SQL_NORM(`split_part(split_part(s.x, '(', 1), ',', 1)`)}),
      (4, ${SQL_NORM(`regexp_replace(s.x, '^.*,', '')`)})
    ) AS cand(o, k)
),
pelo_nome AS (
  SELECT DISTINCT ON (c.city) c.city, m.concelho, m.distrito
    FROM candidatas c JOIN mapa m ON m.k = c.k
   ORDER BY c.city, c.o
),
celulas AS (
  SELECT DISTINCT ON (gy, gx) gy, gx, concelho, distrito
    FROM (SELECT e.gy, e.gx, p.concelho, p.distrito, COUNT(*) AS n
            FROM empresas e JOIN pelo_nome p ON p.city = e.city
           GROUP BY 1, 2, 3, 4) x
   ORDER BY gy, gx, n DESC, concelho
)`;

// Junta o concelho/distrito de uma linha com city/gy/gx (alias a); o nome
// ganha à quadrícula no COALESCE (pelo_nome nunca tem distrito vazio)
const juntarLocal = (a) => `
      LEFT JOIN pelo_nome pn_${a} ON pn_${a}.city = ${a}.city
      LEFT JOIN celulas ce_${a} ON ce_${a}.gy = ${a}.gy AND ce_${a}.gx = ${a}.gx`;
const distrito = (a) => `COALESCE(pn_${a}.distrito, ce_${a}.distrito)`;
const concelho = (a) => `COALESCE(pn_${a}.concelho, ce_${a}.concelho)`;

// As duas consultas pesadas correm sem junções em ciclo (nested loop): as CTE
// não têm estatísticas e, quando o planeador estima 1 linha, juntava-as em
// ciclo — com ~14 mil fichas e milhares de conversas passava dos 10 s do
// statement_timeout; com hash joins dá o mesmo resultado em menos de 1 s.
async function semCiclos(sql, params) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN READ ONLY');
    await c.query('SET LOCAL enable_nestloop = off');
    const r = await c.query(sql, params);
    await c.query('COMMIT');
    return r.rows;
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}

function canais(dias, granularidade) {
  return semCiclos(`
    WITH ${SQL_LIM}, ${SQL_CONVERSAS}, ${SQL_ORCAMENTOS}, ${SQL_PEDIDOS}
    SELECT canal, balde, GROUPING(balde) AS total,
           COUNT(*)::int AS pedidos,
           (COUNT(*) FILTER (WHERE enviado))::int AS enviados,
           COUNT(resposta)::int AS respondidos,
           (percentile_cont(0.5) WITHIN GROUP (ORDER BY GREATEST(0, extract(epoch FROM resposta - inicio)::float8))
              FILTER (WHERE resposta IS NOT NULL))::float8 AS mediana_s
      FROM (SELECT p.*, to_char(date_trunc($2, p.inicio AT TIME ZONE 'Europe/Lisbon'), 'YYYY-MM-DD') AS balde
              FROM pedidos p) x
     GROUP BY GROUPING SETS ((canal), (canal, balde))`, [dias, granularidade]);
}

// Os baldes do gráfico (dias ou semanas de segunda a domingo, hora de Lisboa)
async function baldes(dias, granularidade) {
  const { rows } = await pool.query(`
    SELECT to_char(g, 'YYYY-MM-DD') AS balde, to_char(l.desde, 'YYYY-MM-DD') AS desde, to_char(l.hoje, 'YYYY-MM-DD') AS hoje
      FROM (SELECT (now() AT TIME ZONE 'Europe/Lisbon')::date AS hoje,
                   (now() AT TIME ZONE 'Europe/Lisbon')::date - ($1::int - 1) AS desde) l
     CROSS JOIN generate_series(date_trunc($2, l.desde::timestamp), date_trunc($2, l.hoje::timestamp),
                                ('1 ' || $2)::interval) g
     ORDER BY g`, [dias, granularidade]);
  return rows;
}

async function concursos(dias) {
  const { rows } = await pool.query(`
    WITH ${SQL_LIM},
    c AS (
      SELECT (t.status = 'open' AND t.deadline > now()) AS aberto,
             (SELECT COUNT(*) FROM tender_invites i WHERE i.tender_id = t.id AND i.status = 'sent') AS convites,
             (SELECT COUNT(*) FROM tender_proposals p WHERE p.tender_id = t.id AND p.status <> 'withdrawn') AS propostas,
             (SELECT COUNT(*) FROM tender_invites i WHERE i.tender_id = t.id AND i.status = 'sent'
                 AND i.declined_at IS NOT NULL) AS recusas
        FROM tenders t
       WHERE NOT t.is_test AND t.published_at >= (SELECT desde FROM lim)
    )
    SELECT COUNT(*)::int AS publicados,
           (COUNT(*) FILTER (WHERE aberto))::int AS abertos,
           COALESCE(SUM(convites), 0)::int AS convites,
           COALESCE(SUM(propostas), 0)::int AS propostas,
           COALESCE(SUM(recusas), 0)::int AS recusas,
           (percentile_cont(0.5) WITHIN GROUP (ORDER BY propostas))::float8 AS mediana_propostas,
           (COUNT(*) FILTER (WHERE propostas = 0))::int AS p0,
           (COUNT(*) FILTER (WHERE propostas = 1))::int AS p1,
           (COUNT(*) FILTER (WHERE propostas = 2))::int AS p2,
           (COUNT(*) FILTER (WHERE propostas >= 3))::int AS p3,
           (SELECT COUNT(*) FROM tender_invites i JOIN tenders t ON t.id = i.tender_id
             WHERE NOT t.is_test AND i.status = 'failed' AND i.created_at >= (SELECT desde FROM lim))::int AS convites_falhados
      FROM c`, [dias]);
  return rows[0];
}

// Procura (pedidos por área e distrito) contra as fichas reclamadas, e os
// pedidos de orçamento que não chegaram a nenhuma empresa por área e concelho
function geografia(dias) {
  return semCiclos(`
    WITH ${SQL_LIM}, ${SQL_CONVERSAS}, ${SQL_ORCAMENTOS},
    empresas AS (
      SELECT c.id, c.city, ${celula('c')}, c.sector, c.sectors,
             (c.created_by IS NOT NULL AND c.created_by <> ${PLATAFORMA}) AS reclamada
        FROM companies c
       WHERE c.status = 'approved' AND lower(coalesce(c.country, 'pt')) = 'pt'
    ),
    -- áreas que existem em fichas aprovadas: só estas saem pelo nome
    areas AS (
      SELECT DISTINCT v AS setor
        FROM companies c CROSS JOIN unnest(array_append(coalesce(c.sectors, '{}'::text[]), c.sector)) AS u(v)
       WHERE c.status = 'approved' AND v ~ ${AREA}
    ),
    orc AS (
      SELECT o.city, ${celula('o')}, o.notified_count,
             CASE WHEN o.sector IN (SELECT setor FROM areas) THEN o.sector ELSE 'outro' END AS setor
        FROM orcamentos o
    ),
    conc AS (
      SELECT t.id, t.city, ${celula('t')},
             CASE WHEN jsonb_typeof(t.criteria -> 'sectors') = 'array' THEN t.criteria -> 'sectors' ELSE '[]'::jsonb END AS areas
        FROM tenders t
       WHERE NOT t.is_test AND t.published_at >= (SELECT desde FROM lim) AND lower(coalesce(t.country, 'pt')) = 'pt'
    ),
    cidades AS (
      SELECT DISTINCT city
        FROM (SELECT city FROM empresas UNION ALL SELECT city FROM orc UNION ALL SELECT city FROM conc) x
       WHERE coalesce(btrim(city), '') <> ''
    ),
    ${SQL_LOCAIS},
    -- o distrito de cada ficha e de cada pedido de orçamento, resolvido uma vez
    -- (nas fichas só as poucas sem nome reconhecido vão à quadrícula)
    empresas_loc AS (
      SELECT e.id, e.sector, e.sectors, e.reclamada, pn.distrito
        FROM empresas e JOIN pelo_nome pn ON pn.city = e.city
      UNION ALL
      SELECT e.id, e.sector, e.sectors, e.reclamada, ce.distrito
        FROM empresas e
        LEFT JOIN celulas ce ON ce.gy = e.gy AND ce.gx = e.gx
       WHERE NOT EXISTS (SELECT 1 FROM pelo_nome pn WHERE pn.city = e.city)
    ),
    orc_loc AS (
      SELECT o.setor, o.notified_count, ${concelho('o')} AS concelho, ${distrito('o')} AS distrito
        FROM orc o ${juntarLocal('o')}
    ),
    oferta AS (
      SELECT s.setor, e.distrito,
             COUNT(DISTINCT e.id)::int AS fichas, (COUNT(DISTINCT e.id) FILTER (WHERE e.reclamada))::int AS reclamadas
        FROM empresas_loc e
        CROSS JOIN unnest(array_append(coalesce(e.sectors, '{}'::text[]), e.sector)) AS s(setor)
       WHERE s.setor ~ ${AREA}
       GROUP BY 1, 2
    ),
    procura AS (
      SELECT x.setor, x.distrito, x.canal, COUNT(*)::int AS n FROM (
        SELECT o.setor, o.distrito, 'orcamentos'::text AS canal
          FROM orc_loc o
        UNION ALL
        SELECT a.setor, ${distrito('t')}, 'concursos'
          FROM conc t
          CROSS JOIN LATERAL (
            SELECT CASE WHEN v IN (SELECT setor FROM areas) THEN v ELSE 'outro' END AS setor
              FROM jsonb_array_elements_text(t.areas) AS u(v)
            UNION
            SELECT co.sector FROM tender_invites i JOIN companies co ON co.id = i.company_id
             WHERE jsonb_array_length(t.areas) = 0 AND i.tender_id = t.id AND co.sector IN (SELECT setor FROM areas)
          ) a
          ${juntarLocal('t')}
        UNION ALL
        SELECT CASE WHEN e.sector IN (SELECT setor FROM areas) THEN e.sector ELSE 'outro' END, e.distrito, 'mensagens'
          FROM conversas cv
          JOIN empresas_loc e ON e.id = cv.company_id
         WHERE cv.primeiro = 'client' AND cv.inicio >= (SELECT desde FROM lim)
      ) x
      GROUP BY 1, 2, 3
    )
    SELECT 'procura' AS tipo, p.setor, p.distrito, NULL::text AS concelho,
           SUM(p.n)::int AS n,
           COALESCE(SUM(p.n) FILTER (WHERE p.canal = 'mensagens'), 0)::int AS mensagens,
           COALESCE(SUM(p.n) FILTER (WHERE p.canal = 'orcamentos'), 0)::int AS orcamentos,
           COALESCE(SUM(p.n) FILTER (WHERE p.canal = 'concursos'), 0)::int AS concursos,
           MAX(f.fichas) AS fichas, MAX(f.reclamadas) AS reclamadas
      FROM procura p
      LEFT JOIN oferta f ON f.setor = p.setor AND f.distrito = p.distrito
     GROUP BY p.setor, p.distrito
    UNION ALL
    SELECT 'sem', o.setor, o.distrito, o.concelho, COUNT(*)::int,
           NULL::int, NULL::int, NULL::int, NULL::int, NULL::int
      FROM orc_loc o
     WHERE o.notified_count = 0
     GROUP BY 2, 3, 4`, [dias, ...MAPA]);
}

async function saudeMarketplace(dias) {
  const granularidade = dias <= 7 ? 'day' : 'week';
  const [linhas, bs, conc, geo] = await Promise.all([
    canais(dias, granularidade), baldes(dias, granularidade), concursos(dias), geografia(dias),
  ]);
  const vazio = () => ({ pedidos: 0, enviados: 0, respondidos: 0, mediana_s: null });
  const canal = { mensagens: vazio(), orcamentos: vazio(), convites: vazio() };
  const porBalde = new Map();
  for (const r of linhas) {
    if (!canal[r.canal]) continue;
    if (Number(r.total) === 1) {
      canal[r.canal] = {
        pedidos: r.pedidos, enviados: r.enviados, respondidos: r.respondidos,
        mediana_s: r.mediana_s == null ? null : Math.round(r.mediana_s),
      };
    } else {
      if (!porBalde.has(r.balde)) porBalde.set(r.balde, {});
      porBalde.get(r.balde)[r.canal] = r.pedidos;
    }
  }
  const desde = bs.length ? bs[0].desde : null;
  const hoje = bs.length ? bs[0].hoje : null;
  const dia = (s) => Date.parse(s + 'T00:00:00Z') / 864e5;
  const serie = bs.map(b => {
    // dias deste balde dentro da janela (a primeira e a última semana podem ser parciais)
    const ini = dia(b.balde), fim = granularidade === 'day' ? ini : ini + 6;
    const n = Math.min(fim, dia(hoje)) - Math.max(ini, dia(desde)) + 1;
    const c = porBalde.get(b.balde) || {};
    return { inicio: b.balde, dias: n, mensagens: c.mensagens || 0, orcamentos: c.orcamentos || 0, convites: c.convites || 0 };
  });

  const procura = geo.filter(r => r.tipo === 'procura')
    .map(r => ({
      setor: r.setor, distrito: r.distrito, pedidos: r.n,
      mensagens: r.mensagens, orcamentos: r.orcamentos, concursos: r.concursos,
      fichas: r.distrito ? (r.fichas || 0) : null, reclamadas: r.distrito ? (r.reclamadas || 0) : null,
    }))
    .sort((a, b) => b.pedidos - a.pedidos || (a.reclamadas ?? 1e9) - (b.reclamadas ?? 1e9) ||
      String(a.setor).localeCompare(String(b.setor)) || String(a.distrito || '').localeCompare(String(b.distrito || '')));
  const sem = geo.filter(r => r.tipo === 'sem')
    .map(r => ({ setor: r.setor, concelho: r.concelho, distrito: r.distrito, pedidos: r.n }))
    .sort((a, b) => b.pedidos - a.pedidos || String(a.setor).localeCompare(String(b.setor)) ||
      String(a.concelho || '').localeCompare(String(b.concelho || '')));

  return {
    dias, granularidade: granularidade === 'day' ? 'dia' : 'semana', desde, hoje,
    canais: {
      mensagens: canal.mensagens,
      orcamentos: { ...canal.orcamentos, sem_empresas: canal.orcamentos.pedidos - canal.orcamentos.enviados },
      convites: { ...canal.convites, falhados: conc.convites_falhados },
    },
    serie,
    concursos: {
      publicados: conc.publicados, abertos: conc.abertos, convites: conc.convites,
      propostas: conc.propostas, recusas: conc.recusas,
      mediana_propostas: conc.mediana_propostas,
      distribuicao: { 0: conc.p0, 1: conc.p1, 2: conc.p2, '3+': conc.p3 },
    },
    procura: procura.slice(0, PROCURA_MAX), procura_total: procura.length,
    sem_empresas: sem.slice(0, SEM_EMPRESAS_MAX), sem_empresas_grupos: sem.length,
    sem_empresas_total: sem.reduce((s, r) => s + r.pedidos, 0),
  };
}

module.exports = { saudeMarketplace };
