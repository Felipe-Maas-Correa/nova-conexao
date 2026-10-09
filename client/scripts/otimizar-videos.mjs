/**
 * Comprime os vídeos de public/img para uso como fundo/loop no site.
 *
 * - Remove o áudio (vídeos de fundo tocam mudos)
 * - Limita a 1280px de largura e 24fps
 * - Corta em no máximo 12s (loop curto)
 * - Gera também um pôster .webp do primeiro quadro
 *
 * Originais vão para public/img/originais/. Rode com: npm run otimizar-videos
 */
import ffmpegPath from "ffmpeg-static";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, mkdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);
const DIR = path.resolve("public/img");
// Fora de public/ — ver comentário em otimizar-imagens.mjs.
const ORIGINAIS = path.resolve("midias-originais");
const DURACAO_MAX = 12; // segundos

// NC_QUALIDADE=alta → servidor próprio: Full HD e compressão bem mais suave.
const ALTA = process.env.NC_QUALIDADE === "alta";
const LARGURA = ALTA ? 1920 : 1280;
const CRF = ALTA ? "22" : "30";
const PRESET = ALTA ? "slower" : "slow";

const mb = (b) => `${(b / 1048576).toFixed(1)} MB`;

async function main() {
  await mkdir(ORIGINAIS, { recursive: true });
  // Vídeos novos soltos em public/img + originais já arquivados (permite
  // refazer tudo em outra qualidade a qualquer momento).
  const soltos = (await readdir(DIR)).filter((f) => /\.mp4$/i.test(f));
  const arquivados = (await readdir(ORIGINAIS)).filter((f) => /\.mp4$/i.test(f));
  const arquivos = [...new Set([...soltos, ...arquivados])];

  if (!arquivos.length) {
    console.log("Nada para comprimir (sem vídeos novos nem originais).");
    return;
  }

  let antes = 0;
  let depois = 0;

  for (const arquivo of arquivos) {
    const veioDosOriginais = !soltos.includes(arquivo);
    const entrada = veioDosOriginais
      ? path.join(ORIGINAIS, arquivo)
      : path.join(DIR, arquivo);
    const base = arquivo.replace(/\.mp4$/i, "");
    const saida = path.join(DIR, `${base}.web.mp4`);
    const poster = path.join(DIR, `${base}-poster.webp`);

    const tamanhoOrig = (await stat(entrada)).size;
    antes += tamanhoOrig;

    // Vídeo comprimido, sem áudio, pronto para autoplay em loop.
    await run(ffmpegPath, [
      "-y",
      "-i", entrada,
      "-t", String(DURACAO_MAX),
      "-an",
      // Vídeos de celular guardam a localização GPS nos metadados. Sem isto
      // ela iria junto para o site e para o repositório.
      "-map_metadata", "-1",
      "-vf", `scale='min(${LARGURA},iw)':-2,fps=24`,
      "-c:v", "libx264",
      "-profile:v", "main",
      "-crf", CRF,
      "-preset", PRESET,
      "-movflags", "+faststart",
      "-pix_fmt", "yuv420p",
      saida
    ]);

    // Pôster: primeiro quadro, exibido enquanto o vídeo carrega.
    await run(ffmpegPath, [
      "-y",
      "-i", entrada,
      "-vf", `scale='min(${LARGURA},iw)':-2`,
      "-frames:v", "1",
      poster
    ]);

    const tamanhoNovo = (await stat(saida)).size;
    depois += tamanhoNovo;
    console.log(
      `${arquivo}   ${mb(tamanhoOrig)} -> ${mb(tamanhoNovo)}   (+ pôster)`
    );

    if (!veioDosOriginais) await rename(entrada, path.join(ORIGINAIS, arquivo));
    // renomeia o .web.mp4 para o nome final
    await rename(saida, path.join(DIR, `${base}.mp4`));
  }

  console.log("\n-----------------------------------------");
  console.log(`Total antes:  ${mb(antes)}`);
  console.log(`Total depois: ${mb(depois)}`);
  console.log(`Redução: ${Math.round((1 - depois / antes) * 100)}%`);
}

main().catch((e) => {
  console.error(e.stderr || e);
  process.exit(1);
});
