// Armazenamento PRIVADO dos anexos dos concursos (Vercel Blob, store privado).
//
// O browser envia cada ficheiro diretamente para o Blob com um URL pré-assinado
// (o ficheiro não passa pela função — o corpo dos pedidos às funções está
// limitado a 4,5 MB) e cada download é um link temporário gerado só para quem
// tem acesso ao concurso. Nada fica público.
//
// Credenciais: o store privado ligado ao projeto (OIDC + BLOB_STORE_ID, o
// padrão da Vercel para stores novos). Se o projeto tiver mais de um store
// ligado, o privado pode ter o prefixo CONCURSOS (CONCURSOS_BLOB_STORE_ID…).
// O BLOB_READ_WRITE_TOKEN genérico NÃO é usado aqui: pertence ao store público
// do portfólio, onde um ficheiro privado nunca pode ir parar.
let _sdk = null;
function sdk() {
  if (!_sdk) _sdk = require('@vercel/blob');
  return _sdk;
}

const limpo = (v) => (v == null ? '' : String(v)).replace(/^[﻿​\s]+|[﻿​\s]+$/g, '');

function credenciais() {
  const env = process.env;
  const token = limpo(env.CONCURSOS_BLOB_READ_WRITE_TOKEN) || limpo(env.CONCURSOS_READ_WRITE_TOKEN);
  if (token) return { token };
  const storeId = limpo(env.CONCURSOS_BLOB_STORE_ID) || limpo(env.CONCURSOS_STORE_ID) || limpo(env.BLOB_STORE_ID);
  if (storeId) return { storeId };
  return null;
}

function configurado() {
  return !!credenciais();
}

// Token OIDC do pedido (cabeçalho x-vercel-oidc-token no contexto do pedido,
// o mesmo que o @vercel/oidc lê) ou do ambiente. Passado EXPLICITAMENTE ao SDK:
// sem ele o SDK cairia em silêncio para o BLOB_READ_WRITE_TOKEN (store público).
function _oidc() {
  try {
    const ctx = globalThis[Symbol.for('@vercel/request-context')];
    const h = ctx && typeof ctx.get === 'function' ? ((ctx.get() || {}).headers || {}) : {};
    const tok = limpo(h['x-vercel-oidc-token']) || limpo(process.env.VERCEL_OIDC_TOKEN);
    if (tok) return tok;
  } catch (_) {}
  return '';
}

function _cred() {
  const c = credenciais();
  if (!c) {
    const e = new Error('Os anexos ainda não estão disponíveis.');
    e.status = 503;
    throw e;
  }
  if (c.token) return c;
  const oidcToken = _oidc();
  if (!oidcToken) {
    const e = new Error('Armazenamento indisponível de momento (sem credenciais OIDC).');
    e.status = 503;
    throw e;
  }
  return { storeId: c.storeId, oidcToken };
}

// URL pré-assinado para UM envio (PUT) com o caminho, o tipo e o tamanho máximo
// fixados na assinatura — o Blob recusa tudo o que sair disso. Os cabeçalhos
// devolvidos são os que o SDK oficial do browser (uploadPresigned) envia.
async function urlDeEnvio({ pathname, mime, maxBytes, validadeMs = 15 * 60 * 1000 }) {
  const { issueSignedToken, presignUrl, parseStoreIdFromDelegationToken } = sdk();
  const validUntil = Date.now() + validadeMs;
  const tok = await issueSignedToken({
    ..._cred(), pathname, operations: ['put'], validUntil,
    allowedContentTypes: [mime], maximumSizeInBytes: maxBytes,
  });
  const { presignedUrl } = await presignUrl(tok, {
    operation: 'put', pathname, access: 'private',
    allowedContentTypes: [mime], maximumSizeInBytes: maxBytes,
    addRandomSuffix: false, allowOverwrite: false,
  });
  return {
    url: presignedUrl,
    headers: {
      'x-api-version': '13',
      'x-vercel-blob-access': 'private',
      'x-content-type': mime,
      'x-vercel-blob-store-id': parseStoreIdFromDelegationToken(tok.delegationToken),
    },
    validUntil,
  };
}

// Confirma um envio: o ficheiro existe, com que tamanho, e os primeiros bytes
// (até 4 KB) para confirmar o tipo pelo conteúdo e não só pela extensão.
// Devolve null se o ficheiro não chegou ao Blob.
async function verificar(pathname) {
  const { get } = sdk();
  let r;
  try {
    r = await get(pathname, {
      ..._cred(), access: 'private', useCache: false, headers: { Range: 'bytes=0-4095' },
    });
  } catch (e) {
    // 416: ficheiro de 0 bytes (o Range não cabe) — é um envio vazio, não um erro
    if (/\b416\b/.test(String(e && e.message))) return { size: 0, contentType: '', amostra: Buffer.alloc(0) };
    throw e;
  }
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  // Com Range o content-length é o do pedaço: o total vem do content-range
  // ("bytes 0-4095/123456"); sem Range a resposta é o ficheiro inteiro.
  const intervalo = /\/(\d+)\s*$/.exec(r.headers.get('content-range') || '');
  const size = intervalo ? Number(intervalo[1]) : Number(r.blob.size) || 0;
  const leitor = r.stream.getReader();
  const partes = [];
  let total = 0;
  while (total < 4096) {
    const { done, value } = await leitor.read();
    if (done) break;
    partes.push(Buffer.from(value));
    total += value.length;
  }
  try { await leitor.cancel(); } catch (_) {}
  return { size, contentType: r.blob.contentType || '', amostra: Buffer.concat(partes).subarray(0, 4096) };
}

// Link temporário de download (por omissão 10 minutos). `descarregar` força o
// browser a guardar o ficheiro em vez de o abrir.
async function urlDeDownload(pathname, { validadeMs = 10 * 60 * 1000, descarregar = true } = {}) {
  const { issueSignedToken, presignUrl } = sdk();
  const tok = await issueSignedToken({
    ..._cred(), pathname, operations: ['get'], validUntil: Date.now() + validadeMs,
  });
  const { presignedUrl } = await presignUrl(tok, { operation: 'get', pathname, access: 'private' });
  if (!descarregar) return presignedUrl;
  const u = new URL(presignedUrl);
  u.searchParams.set('download', '1');
  return u.toString();
}

// Lança erro se não conseguir apagar (incluindo sem store configurado): quem
// chama nunca pode dar ficheiros como apagados quando ficaram no Blob.
async function apagar(pathnames) {
  const lista = (Array.isArray(pathnames) ? pathnames : [pathnames]).filter(Boolean);
  if (!lista.length) return;
  const { del } = sdk();
  for (let i = 0; i < lista.length; i += 100) {
    await del(lista.slice(i, i + 100), _cred());
  }
}

module.exports = { configurado, urlDeEnvio, verificar, urlDeDownload, apagar };
