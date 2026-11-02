// Imagem de partilha de uma empresa (og:image de /e/ e /c/): o logótipo ao centro
// de uma tela de 1200x630. Os logótipos guardados são pequenos e de todas as
// formas (128x128, 48x48, 192x21) e o Facebook pede 200x200 no mínimo. O WhatsApp
// pode recortar a imagem a um quadrado central, por isso o logótipo fica dentro
// dos 630px do meio, com margem. Ver GET /api/companies/:id/og.png.
const OG_COVER = 'https://www.hivex.pt/og-cover.png?v=2';
const TELA_W = 1200, TELA_H = 630;
const LOGO_MAX_W = 540, LOGO_MAX_H = 440;
const LOGO_MIN = 32;      // abaixo disto (favicon de 16px) ampliar dá só uma mancha
const LE_MAX = 1024;      // lado máximo lido: o dobro da caixa chega e limita a memória
const ALFA_VISIVEL = 32;
const QUASE_BRANCO = 235; // inclui o branco sujo dos JPEG
const BRANCO = '#ffffff', ESCURO = '#0f172a'; // ESCURO é o fundo da og-cover

const LOGO_DATA_URI = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i;

// Devolve o PNG, ou null se não houver nada que valha a pena mostrar (sem logo,
// formato que o sharp não lê como .ico, logo minúsculo, todo transparente ou
// todo branco).
async function desenhaOgEmpresa(sharp, logo) {
  const m = logo && LOGO_DATA_URI.exec(logo);
  if (!sharp || !m) return null;
  try {
    const { data, info } = await sharp(Buffer.from(m[2], 'base64'), { failOn: 'none', ...(/svg/i.test(m[1]) ? { density: 200 } : {}) })
      .rotate()
      .resize({ width: LE_MAX, height: LE_MAX, fit: 'inside', withoutEnlargement: true })
      .ensureAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;

    // A margem do próprio ficheiro não conta: cortam-se só as bordas transparentes
    // ou brancas. O trim() do sharp toma o 1.º pixel por fundo e comia a moldura
    // dos logótipos a toda a largura (quadrado vermelho com o desenho a branco).
    const vis = [w, h, -1, -1], cor = [w, h, -1, -1];
    const alarga = (b, x, y) => {
      if (x < b[0]) b[0] = x;
      if (y < b[1]) b[1] = y;
      if (x > b[2]) b[2] = x;
      if (y > b[3]) b[3] = y;
    };
    let visiveis = 0, comCor = 0;
    for (let y = 0, i = 0; y < h; y++) {
      for (let x = 0; x < w; x++, i += 4) {
        if (data[i + 3] < ALFA_VISIVEL) continue;
        visiveis++;
        alarga(vis, x, y);
        if (Math.min(data[i], data[i + 1], data[i + 2]) < QUASE_BRANCO) { comCor++; alarga(cor, x, y); }
      }
    }
    if (!visiveis) return null;

    // Branco sobre transparente desaparecia numa tela branca: vai para a escura.
    const transparente = visiveis < w * h;
    if (!transparente && !comCor) return null;
    const claro = transparente && comCor / visiveis < 0.1;
    const [x0, y0, x1, y1] = claro || !comCor ? vis : cor;
    const lw = x1 - x0 + 1, lh = y1 - y0 + 1;
    if (Math.max(lw, lh) < LOGO_MIN) return null;

    const logoFinal = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .extract({ left: x0, top: y0, width: lw, height: lh })
      .resize({ width: LOGO_MAX_W, height: LOGO_MAX_H, fit: 'inside' })
      .png({ compressionLevel: 1 }).toBuffer();

    // Paleta: um terço do peso, para as apps de chat não ignorarem a imagem. Sem
    // dither, que punha ruído na tela branca. Com effort > 1 só se gasta mais CPU.
    return await sharp({ create: { width: TELA_W, height: TELA_H, channels: 3, background: claro ? ESCURO : BRANCO } })
      .composite([{ input: logoFinal, gravity: 'center' }])
      .png({ palette: true, dither: 0, effort: 1 }).toBuffer();
  } catch (_) {
    return null;
  }
}

module.exports = { OG_COVER, LOGO_DATA_URI, desenhaOgEmpresa };
