/**
 * Otimiza as fotos de public/img para uso na web.
 *
 * - Aplica a rotação EXIF (fotos de celular vêm deitadas sem isso)
 * - Gera .webp redimensionado (versão cheia + @md para telas menores)
 * - Guarda os originais em public/img/originais/
 *
 * Rode com:  npm run otimizar-imagens
 * Pode rodar quantas vezes quiser: se os originais já estiverem
 * arquivados, ele reprocessa a partir deles.
 */
import sharp from "sharp";
import { readdir, mkdir, rename, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DIR = path.resolve("public/img");
// Fora de public/: tudo que fica em public/ é copiado para o site publicado,
// e os originais (centenas de MB) não devem ir para o ar.
const ORIGINAIS = path.resolve("midias-originais");

const PERFIS = [
  { sufixo: "", largura: 1920, qualidade: 72 },
  { sufixo: "@md", largura: 960, qualidade: 74 },
  // Miniatura para os cartões do carrossel. Reduzir uma imagem de 960px
  // para ~170px dentro de um elemento girado em 3D gera serrilhado;
  // servir um arquivo já no tamanho certo resolve.
  { sufixo: "@sm", largura: 480, qualidade: 80 }
];

const kb = (b) => `${Math.round(b / 1024)} KB`;
const ehImagem = (f) => /\.(jpe?g|png)$/i.test(f);

async function main() {
  await mkdir(ORIGINAIS, { recursive: true });

  // Reprocessa a partir dos originais arquivados, se houver.
  const arquivados = existsSync(ORIGINAIS)
    ? (await readdir(ORIGINAIS)).filter(ehImagem)
    : [];
  const soltos = (await readdir(DIR)).filter(ehImagem);

  const tarefas = [
    ...arquivados.map((f) => ({ nome: f, origem: ORIGINAIS, arquivar: false })),
    ...soltos.map((f) => ({ nome: f, origem: DIR, arquivar: true }))
  ];

  if (!tarefas.length) {
    console.log("Nenhuma imagem encontrada.");
    return;
  }

  let antes = 0;
  let depois = 0;
  const gerados = new Set(); // evita dois originais gravarem o mesmo .webp

  for (const { nome, origem, arquivar } of tarefas) {
    const entrada = path.join(origem, nome);
    const base = nome.replace(/\.(jpe?g|png)$/i, "");
    const ehLogo = /^logo/i.test(base);
    const temAlfa = /\.png$/i.test(nome);

    const tamanhoOrig = (await stat(entrada)).size;
    antes += tamanhoOrig;

    const perfis = ehLogo
      ? [{ sufixo: "", largura: 600, qualidade: 86 }]
      : PERFIS;

    for (const p of perfis) {
      const saida = path.join(DIR, `${base}${p.sufixo}.webp`);

      if (gerados.has(saida)) {
        console.log(`[pulado] ${path.basename(saida)} já gerado por outro original`);
        continue;
      }
      gerados.add(saida);

      await sharp(entrada)
        // .rotate() sem argumento = aplica a orientação do EXIF
        .rotate()
        .resize({ width: p.largura, withoutEnlargement: true })
        .webp({ quality: p.qualidade, alphaQuality: temAlfa ? 100 : 80 })
        .toFile(saida);

      const tamanhoNovo = (await stat(saida)).size;
      depois += tamanhoNovo;
      const meta = await sharp(saida).metadata();
      console.log(
        `${path.basename(saida).padEnd(34)} ${String(meta.width).padStart(4)}x${String(
          meta.height
        ).padEnd(5)}  ${kb(tamanhoOrig)} -> ${kb(tamanhoNovo)}`
      );
    }

    if (arquivar) await rename(entrada, path.join(ORIGINAIS, nome));
  }

  await gerarRecortes();
  await gerarMarca();
  await gerarMiniaturasDePoster();

  console.log("\n-----------------------------------------");
  console.log(`Total antes:  ${kb(antes)}`);
  console.log(`Total depois: ${kb(depois)}`);
  console.log(`Redução: ${Math.round((1 - depois / antes) * 100)}%`);
}

/**
 * Recortes panorâmicos.
 * As fotos são verticais (celular); o Hero precisa de formato largo.
 * `foco` = ponto de interesse vertical, de 0 (topo) a 1 (base).
 */
const RECORTES = [
  {
    origem: "veiculo-por-do-sol-02.jpg",
    saida: "hero-por-do-sol",
    proporcao: 16 / 9,
    // Recorte suave: mantém a van à direita do bloco de texto sem
    // ampliar demais a foto (ampliar demais come a nitidez).
    larguraRel: 0.84,
    foco: 0.6 // banda do horizonte com o sol e a van
  }
];

/**
 * Miniaturas dos pôsteres de vídeo.
 * Os pôsteres saem do ffmpeg com ~1080px; no carrossel aparecem com ~170px.
 * Sem uma versão menor, a redução dentro do elemento 3D serrilha.
 */
async function gerarMiniaturasDePoster() {
  const posters = (await readdir(DIR)).filter(
    (f) => f.endsWith("-poster.webp") && !f.includes("@sm")
  );
  for (const nome of posters) {
    const entrada = path.join(DIR, nome);
    const saida = path.join(DIR, nome.replace("-poster.webp", "-poster@sm.webp"));
    await sharp(entrada)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(saida);
    console.log(`[miniatura] ${path.basename(saida)}`);
  }
}

/**
 * Ativos de marca.
 *
 * A logo oficial é empilhada (monograma + "NOVA CONEXÃO INTERNET" embaixo),
 * o que fica ilegível em tamanhos pequenos. Aqui extraímos só o monograma
 * "NC" para usar na navbar e no favicon.
 */
async function gerarMarca() {
  // 1) Monograma branco com fundo transparente (navbar / rodapé)
  const fonteBranca = path.join(ORIGINAIS, "logo-branco.png");
  if (existsSync(fonteBranca)) {
    const base = sharp(fonteBranca).ensureAlpha();
    const { width, height } = await base.metadata();
    const saida = path.join(DIR, "logo-nc.webp");

    await sharp(fonteBranca)
      .ensureAlpha()
      // recorta a parte de cima (só o "NC", sem o texto)
      .extract({ left: 0, top: 0, width, height: Math.round(height * 0.8) })
      // remove a sobra transparente das bordas
      .trim()
      .resize({ height: 128, withoutEnlargement: false })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(saida);

    const m = await sharp(saida).metadata();
    console.log(`[marca] logo-nc.webp             ${m.width}x${m.height}`);
  }

  // 2) Favicons: só o monograma (com o texto, some a 32px)
  const fonteQuadrada = path.join(ORIGINAIS, "logo-quadrado.png");
  if (existsSync(fonteQuadrada)) {
    const { width: lw, height: lh } = await sharp(fonteQuadrada).metadata();
    const monograma = await sharp(fonteQuadrada)
      .extract({
        left: Math.round(lw * 0.12),
        top: Math.round(lh * 0.16),
        width: Math.round(lw * 0.76),
        height: Math.round(lh * 0.5)
      })
      .toBuffer();

    for (const tamanho of [32, 180, 512]) {
      const saida = path.join(DIR, "..", `favicon-${tamanho}.png`);
      const margem = Math.round(tamanho * 0.1);
      await sharp(monograma)
        .resize(tamanho - margem * 2, tamanho - margem * 2, {
          fit: "contain",
          background: "#ffffff"
        })
        .extend({
          top: margem,
          bottom: margem,
          left: margem,
          right: margem,
          background: "#ffffff"
        })
        .png()
        .toFile(saida);
      console.log(`[marca] favicon-${tamanho}.png`);
    }
  }
}

async function gerarRecortes() {
  for (const r of RECORTES) {
    const entrada = path.join(ORIGINAIS, r.origem);
    if (!existsSync(entrada)) {
      console.log(`[recorte] original ausente: ${r.origem}`);
      continue;
    }

    // Rotaciona primeiro: as dimensões do EXIF vêm trocadas antes disso.
    const girada = await sharp(entrada).rotate().toBuffer();
    const { width, height } = await sharp(girada).metadata();

    const larguraCorte = Math.round(width * (r.larguraRel ?? 1));
    const alvoAltura = Math.round(larguraCorte / r.proporcao);
    const altura = Math.min(alvoAltura, height);
    let topo = Math.round(height * r.foco - altura / 2);
    topo = Math.max(0, Math.min(topo, height - altura));

    // O recorte do topo é a imagem mais visível do site: vale gerar
    // uma versão grande e com qualidade mais alta para telas amplas.
    for (const p of [
      { sufixo: "@xl", largura: 2560, qualidade: 80 },
      { sufixo: "", largura: 1920, qualidade: 82 },
      { sufixo: "@md", largura: 1100, qualidade: 84 }
    ]) {
      const saida = path.join(DIR, `${r.saida}${p.sufixo}.webp`);
      await sharp(girada)
        .extract({ left: 0, top: topo, width: larguraCorte, height: altura })
        .resize({ width: p.largura, withoutEnlargement: true })
        .webp({ quality: p.qualidade })
        .toFile(saida);

      const m = await sharp(saida).metadata();
      console.log(
        `[recorte] ${path.basename(saida).padEnd(28)} ${m.width}x${m.height}  ${kb(
          (await stat(saida)).size
        )}`
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
