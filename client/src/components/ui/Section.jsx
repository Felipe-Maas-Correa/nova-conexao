import { motion, useReducedMotion } from "framer-motion";
import Reveal from "../Reveal";
import Palavras from "../Palavras";

/** Linha divisória que é "desenhada" do centro para as pontas. */
function LinhaDivisoria() {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      className="rule"
      initial={reduzir ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/**
 * Container único de conteúdo (max 1200px) — garante que todas as
 * seções compartilhem a mesma linha vertical nas laterais.
 */
export function Container({ className = "", children }) {
  return <div className={`container-nc ${className}`}>{children}</div>;
}

// Escala de espaçamento vertical de seção (ritmo consistente).
const pads = {
  sm: "py-section-sm",
  md: "py-section-sm sm:py-section",
  lg: "py-section sm:py-section-lg"
};

/**
 * Seção padrão. `tone="soft"` aplica uma variação de fundo muito
 * sutil (#0B1322) — usada com parcimônia para agrupar assuntos,
 * nunca para "quebrar" a página em blocos independentes.
 */
export function Section({
  id,
  size = "md",
  tone = "base",
  divider = false,
  className = "",
  children
}) {
  return (
    <section
      id={id}
      className={`relative ${pads[size]} ${
        tone === "soft" ? "bg-bg-soft" : ""
      } ${className}`}
    >
      {divider && (
        <div className="container-nc absolute inset-x-0 top-0">
          <LinhaDivisoria />
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Cabeçalho de seção com composições variadas, para evitar o padrão
 * repetitivo "label → título gigante → subtítulo" em toda a página.
 *
 * align: "left" | "center"
 * eyebrow, title, description, aside (conteúdo à direita no modo left)
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  aside,
  align = "left",
  className = ""
}) {
  const centered = align === "center";

  // Cada parte entra de um jeito: rótulo desliza, título sobe por palavras,
  // descrição sobe, conteúdo lateral entra pela direita.
  return (
    <div
      className={`${
        centered
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <div className={centered ? "" : "max-w-xl"}>
        {eyebrow && (
          <Reveal efeito="deslizar">
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
        )}
        <Palavras as="h2" className="h2 mt-2.5" delay={0.1}>
          {title}
        </Palavras>
        {description && (
          <Reveal efeito="subir" delay={0.3}>
            <p className={`lead mt-3 ${centered ? "text-balance" : ""}`}>
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {!centered && aside ? (
        <Reveal efeito="direita" delay={0.2} className="shrink-0">
          {aside}
        </Reveal>
      ) : null}
    </div>
  );
}
