import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carrossel 3D em "roleta" (coverflow).
 *
 * Os cartões giram em torno de um eixo central: o do meio fica de frente,
 * e os laterais recuam, inclinam e perdem opacidade, dando profundidade.
 *
 * Interação: arrastar com o dedo/mouse, clicar num cartão lateral para
 * trazê-lo ao centro, ou usar as setas do teclado. Gira sozinho devagar
 * e pausa enquanto há interação.
 *
 * Performance: o vídeo só é baixado quando o cartão está no centro; em
 * telas pequenas, economia de dados ou "reduzir movimento", usa imagem.
 */

// Nota: torre-antena-01 não entra aqui — é a foto usada na seção
// "Nossa história" e repetir cansa o olho.
// `base` = nome do arquivo sem sufixo. As variantes @sm/@md são montadas
// no srcset para o navegador baixar a imagem no tamanho do cartão — servir
// uma foto grande num cartão pequeno é o que causa serrilhado no 3D.
const itens = [
  { tipo: "video", video: "video-antena-01", legenda: "Vista do alto da torre" },
  { tipo: "foto", base: "atendimento-tecnico-01", legenda: "Atendimento em campo" },
  { tipo: "video", video: "video-atendimento-local", legenda: "Atendimento na cidade" },
  { tipo: "foto", base: "atendimento-local-04", legenda: "Instalação em campo" },
  { tipo: "video", video: "video-antena-06", legenda: "Instalação de antena" },
  { tipo: "foto", base: "torre-painel", legenda: "Equipamento da torre" },
  { tipo: "foto", base: "atendimento-local-01", legenda: "Equipe da região" },
  { tipo: "video", video: "video-antena-04", legenda: "Manutenção da rede" },
  { tipo: "foto", base: "atendimento-local-05", legenda: "Time em atendimento" },
  { tipo: "foto", base: "torre-antena-02", legenda: "Estrutura da rede" },
  { tipo: "foto", base: "atendimento-local-03", legenda: "Instalação na casa do cliente" }
].map((it) => {
  const ehVideo = it.tipo === "video";
  // Pôsteres de vídeo: a versão grande não tem sufixo (`-poster.webp`).
  const pequena = ehVideo ? `${it.video}-poster@sm` : `${it.base}@sm`;
  const grande = ehVideo ? `${it.video}-poster` : `${it.base}@md`;
  return {
    ...it,
    chave: it.video || it.base,
    videoSrc: ehVideo ? `/img/${it.video}.mp4` : null,
    poster: `/img/${pequena}.webp`,
    posterSrcSet: `/img/${pequena}.webp 480w, /img/${grande}.webp 960w`
  };
});

const VISIVEIS = 3; // quantos cartões aparecem de cada lado
const AUTO_MS = 3800; // tempo entre giros automáticos
const RETOMAR_APOS = 4000; // pausa após interação
const ARRASTO_MIN = 55; // px para contar como um giro

/**
 * Giro de apresentação: ao aparecer pela primeira vez, o carrossel dá UMA
 * volta completa bem rápida e vai freando até parar no primeiro cartão.
 * Serve para mostrar, sem texto nenhum, que ele pode ser girado.
 *
 * Cada número é a espera (ms) antes de um passo. Um passo por cartão, então
 * a volta fecha exatamente onde começou. Começa rápido e freia no final.
 */
const FREIO_FINAL = [115, 157, 215, 300, 430, 615];
const PASSO_RAPIDO = 100;
const ESPERA_ENTRADA = 150; // só confirma que ainda está na tela; o giro acompanha o "zoom" de entrada

function atrasosDaIntro(n) {
  const freio = FREIO_FINAL.slice(-Math.min(n, FREIO_FINAL.length));
  const rapidos = Math.max(n - freio.length, 0);
  return [...Array(rapidos).fill(PASSO_RAPIDO), ...freio];
}

/** Conexão fraca ou economia de dados: nada de baixar tudo de uma vez. */
function conexaoLenta() {
  const c = typeof navigator !== "undefined" ? navigator.connection : null;
  return !!c && (c.saveData || /(^|-)(2g|3g)$/.test(c.effectiveType || ""));
}

function prefereMenosMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function podeUsarVideo() {
  if (typeof window === "undefined") return false;
  const telaGrande = window.matchMedia("(min-width: 768px)").matches;
  const movimentoOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const semEconomia = !navigator.connection?.saveData;
  return telaGrande && movimentoOk && semEconomia;
}

/** Distância circular mais curta entre o índice i e o ativo. */
function deslocamento(i, ativo, total) {
  let d = i - ativo;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

// Dois tamanhos: "amplo" (seção inteira) e "compacto" (dentro de uma coluna).
const MEDIDAS = {
  amplo: {
    largura: "w-[200px] sm:w-[260px] lg:w-[300px]",
    altura: "h-[300px] sm:h-[380px] lg:h-[440px]",
    sizes: "(min-width: 1024px) 300px, (min-width: 640px) 260px, 200px",
    passo: 58,
    profundidade: 150,
    giro: 34
  },
  compacto: {
    largura: "w-[150px] sm:w-[170px]",
    altura: "h-[250px] sm:h-[280px]",
    sizes: "(min-width: 640px) 170px, 150px",
    passo: 52,
    profundidade: 110,
    giro: 30
  }
};

function Cartao({ item, off, permitirVideo, girando, onClick, medidas }) {
  const abs = Math.abs(off);
  const forcaDaCena = abs > VISIVEIS;
  const noCentro = off === 0;

  // Profundidade: recua, inclina e encolhe conforme se afasta do centro.
  const estilo = {
    transform: [
      "translateX(-50%)",
      `translateX(${off * medidas.passo}%)`,
      `translateZ(${-abs * medidas.profundidade}px)`,
      `rotateY(${-off * medidas.giro}deg)`,
      `scale(${Math.max(1 - abs * 0.05, 0.7)})`
    ].join(" "),
    opacity: forcaDaCena ? 0 : 1 - abs * 0.2,
    zIndex: 50 - abs,
    pointerEvents: forcaDaCena ? "none" : "auto"
  };

  // Durante o giro de apresentação cada cartão passa pelo centro em ~70ms:
  // se o vídeo iniciasse a cada passagem, seriam vários downloads de 1–2 MB
  // abortados. Enquanto gira, mostra só o pôster.
  const rodarVideo =
    item.tipo === "video" && permitirVideo && noCentro && !girando;

  return (
    <figure
      className={`absolute left-1/2 top-0 transition-all duration-500 ease-out ${medidas.largura}`}
      style={estilo}
      aria-hidden={forcaDaCena}
    >
      <button
        type="button"
        onClick={onClick}
        tabIndex={noCentro ? -1 : 0}
        aria-label={noCentro ? undefined : `Ver: ${item.legenda}`}
        className={`block w-full overflow-hidden rounded-xl border bg-surface transition-colors ${
          noCentro ? "border-brand-500/40 cursor-default" : "border-line cursor-pointer"
        }`}
      >
        <div className="relative aspect-[9/13]">
          {/* Cartões fora de cena não baixam mídia nenhuma. Sem isso, os 11
              cartões pedem imagem ao mesmo tempo e no celular tudo demora. */}
          {forcaDaCena ? null : rodarVideo ? (
            <video
              src={item.videoSrc}
              poster={item.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={item.poster}
              srcSet={item.posterSrcSet}
              sizes={medidas.sizes}
              alt={item.legenda}
              loading={abs <= 1 ? "eager" : "lazy"}
              fetchpriority={noCentro ? "high" : "low"}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
          )}
          {/* escurece os laterais para o centro ganhar destaque */}
          <div
            aria-hidden
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: "#070D18",
              opacity: Math.min(abs * 0.18, 0.6)
            }}
          />
        </div>
      </button>
    </figure>
  );
}

export default function MediaStrip({ tamanho = "amplo" }) {
  const medidas = MEDIDAS[tamanho] || MEDIDAS.amplo;
  const [ativo, setAtivo] = useState(0);
  const [permitirVideo, setPermitirVideo] = useState(false);
  const pausado = useRef(false);
  const timerRetomar = useRef(null);
  const palcoRef = useRef(null);
  const total = itens.length;

  // Giro de apresentação
  const [girandoIntro, setGirandoIntro] = useState(false);
  const emIntro = useRef(false); // espelho em ref: o intervalo do autoplay lê isto
  const introFeita = useRef(false);
  const timersIntro = useRef([]);
  const visivelRef = useRef(false); // só gira sozinho quando está na tela
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    setPermitirVideo(podeUsarVideo());
  }, []);

  const cancelarIntro = useCallback(() => {
    timersIntro.current.forEach(clearTimeout);
    timersIntro.current = [];
    emIntro.current = false;
    setGirandoIntro(false);
  }, []);

  // Limpa os temporizadores se o componente sair da tela
  useEffect(() => () => timersIntro.current.forEach(clearTimeout), []);

  // Pré-carrega todas as fotos quando o carrossel está perto de aparecer.
  // O giro rápido passa por TODOS os cartões; sem isso apareceriam quadros
  // vazios. Em conexão lenta/economia de dados não pré-carrega (nem gira).
  useEffect(() => {
    const el = palcoRef.current;
    if (!el || conexaoLenta()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        itens.forEach((it) => {
          const im = new Image();
          im.sizes = medidas.sizes; // mesmos atributos da <img> real, para
          im.srcset = it.posterSrcSet; // o navegador escolher o mesmo arquivo
          im.src = it.poster;
        });
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [medidas.sizes]);

  // Detecta quando o carrossel está (bem) na tela
  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visivelRef.current = e.isIntersecting;
        setVisivel(e.isIntersecting);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pausar = useCallback(() => {
    pausado.current = true;
    clearTimeout(timerRetomar.current);
    timerRetomar.current = setTimeout(() => {
      pausado.current = false;
    }, RETOMAR_APOS);
  }, []);

  const girar = useCallback(
    (passos) => {
      setAtivo((a) => (a + passos + total) % total);
    },
    [total]
  );

  // Dispara o giro de apresentação UMA vez, na primeira vez que aparece.
  // Só começa se o carrossel CONTINUAR na tela depois da espera de entrada:
  // quem passa rolando rápido não pode gastar a apresentação fora de vista.
  useEffect(() => {
    if (!visivel || introFeita.current) return;
    if (prefereMenosMovimento() || conexaoLenta()) {
      introFeita.current = true;
      return;
    }

    const inicio = setTimeout(() => {
      if (!visivelRef.current) return; // saiu da tela: tenta de novo na próxima vez
      introFeita.current = true;
      emIntro.current = true;
      setGirandoIntro(true);

      let t = 0;
      const agendar = (fn, ms) => timersIntro.current.push(setTimeout(fn, ms));
      atrasosDaIntro(total).forEach((espera) => {
        t += espera;
        agendar(() => setAtivo((a) => (a + 1) % total), t);
      });
      agendar(() => {
        emIntro.current = false;
        setGirandoIntro(false);
        pausar(); // deixa o carrossel parado um tempo, já no cartão inicial
      }, t + 150);
    }, ESPERA_ENTRADA);

    return () => clearTimeout(inicio);
  }, [visivel, total, pausar]);

  // Giro automático
  useEffect(() => {
    if (prefereMenosMovimento()) return;
    const id = setInterval(() => {
      if (
        !pausado.current &&
        !document.hidden &&
        visivelRef.current &&
        !emIntro.current
      ) {
        girar(1);
      }
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [girar]);

  // Arrastar (mouse e toque) — pointer events cobrem os dois
  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return;

    let arrastando = false;
    let origemX = 0;

    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      arrastando = true;
      origemX = e.clientX;
      cancelarIntro();
      pausar();
    };
    const onMove = (e) => {
      if (!arrastando) return;
      const delta = e.clientX - origemX;
      if (Math.abs(delta) >= ARRASTO_MIN) {
        girar(delta < 0 ? 1 : -1);
        origemX = e.clientX; // permite girar vários passos num arrasto só
        pausar();
      }
    };
    const parar = () => {
      arrastando = false;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", parar);
    window.addEventListener("pointercancel", parar);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", parar);
      window.removeEventListener("pointercancel", parar);
    };
  }, [girar, pausar, cancelarIntro]);

  const onTeclado = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") cancelarIntro();
    if (e.key === "ArrowRight") {
      girar(1);
      pausar();
    } else if (e.key === "ArrowLeft") {
      girar(-1);
      pausar();
    }
  };

  return (
    <div className="relative">
      <div
        ref={palcoRef}
        role="group"
        aria-roledescription="carrossel"
        aria-label="Bastidores da operação da Nova Conexão"
        tabIndex={0}
        onKeyDown={onTeclado}
        onMouseEnter={pausar}
        className={`nc-roleta relative cursor-grab touch-pan-y select-none active:cursor-grabbing ${medidas.altura}`}
      >
        {itens.map((item, i) => (
          <Cartao
            key={item.chave}
            item={item}
            off={deslocamento(i, ativo, total)}
            medidas={medidas}
            permitirVideo={permitirVideo}
            girando={girandoIntro}
            onClick={() => {
              cancelarIntro();
              girar(deslocamento(i, ativo, total));
              pausar();
            }}
          />
        ))}
      </div>

    </div>
  );
}
