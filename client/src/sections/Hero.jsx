import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, MapPin, Clock, Unlock, Headset } from "lucide-react";
import { whatsappLink } from "../lib/whatsapp";
import { Container, Button } from "../components/ui";

const rise = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.07 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

const beneficios = [
  { icon: Clock, t: "Instalação em até 24h" },
  { icon: Unlock, t: "Sem fidelidade" },
  { icon: Headset, t: "Atendimento local" }
];

export default function Hero() {
  const reduzir = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden"
    >
      {/* ── Foto de fundo: sem moldura, dissolvida no fundo da página ── */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/img/hero-por-do-sol.webp"
          srcSet="/img/hero-por-do-sol@md.webp 1100w, /img/hero-por-do-sol.webp 1920w, /img/hero-por-do-sol@xl.webp 2560w"
          sizes="100vw"
          alt=""
          aria-hidden
          fetchpriority="high"
          className="hero-zoom h-full w-full object-cover object-[56%_50%]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 22%, #000 72%, transparent 99%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 22%, #000 72%, transparent 99%)"
          }}
        />
      </div>

      {/* Escurece o lado do texto e deixa o pôr do sol aparecer à direita */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, #070D18 0%, rgba(7,13,24,0.90) 26%, rgba(7,13,24,0.42) 52%, rgba(7,13,24,0.18) 100%)"
        }}
      />
      {/* No celular o texto ocupa toda a largura: escurece um pouco mais */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-bg/45 sm:hidden" />
      {/* Fecha topo (navbar) e base (emenda com a próxima seção) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,13,24,0.85) 0%, rgba(7,13,24,0) 26%, rgba(7,13,24,0) 62%, #070D18 100%)"
        }}
      />

      <Container className="relative w-full pb-14 pt-32 sm:pt-36 lg:pb-16">
        <div className="max-w-2xl">
          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0}
            className="eyebrow"
          >
            [ Fibra óptica no interior do RS ]
          </motion.p>

          {/* Cada linha sobe de dentro de uma "máscara" (overflow hidden),
              uma depois da outra — o mesmo efeito de revelação do site da Alpha. */}
          <h1 className="h1 mt-5">
            {["Fibra óptica de verdade,", "com gente daqui"].map((linha, i) => (
              <span key={linha} className="linha">
                <motion.span
                  className={`block ${i === 1 ? "text-brand-400" : ""}`}
                  initial={reduzir ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.14,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {linha}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            initial="hidden"
            animate="show"
            custom={2}
            className="lead mt-5 max-w-lg"
          >
            Internet estável e rápida para sua casa ou empresa em Ajuricaba e
            região, com suporte de quem você encontra na rua.
          </motion.p>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              href="#planos"
              size="lg"
              seta="direita"
              className="w-full sm:w-auto"
            >
              Ver planos
            </Button>
            <Button
              href="#cobertura"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MapPin size={16} /> Consultar cobertura
            </Button>
            <Button
              href={whatsappLink(
                "Olá! Quero saber sobre disponibilidade na minha região."
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </Button>
          </motion.div>

          <motion.ul
            variants={rise}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-content-muted"
          >
            {beneficios.map((b) => (
              <li key={b.t} className="flex items-center gap-2">
                <b.icon size={15} className="text-brand-400" /> {b.t}
              </li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
