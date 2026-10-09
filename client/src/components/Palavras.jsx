import { Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Título cujas palavras sobem, uma por uma, de dentro de uma "máscara".
 *
 * O gatilho (useInView) fica no título inteiro — e não nas palavras. Isso é
 * importante: cada palavra começa deslocada para fora da máscara
 * (overflow hidden); um observador colocado nela veria o elemento 100%
 * cortado e nunca dispararia.
 *
 * <Palavras as="h2" className="h2">Escolha a velocidade ideal</Palavras>
 */
export default function Palavras({
  as: Tag = "h2",
  className = "",
  children,
  delay = 0,
  intervalo = 0.07
}) {
  const ref = useRef(null);
  const reduzir = useReducedMotion();
  const visto = useInView(ref, { once: true, amount: 0.6 });
  const texto = String(children);
  const palavras = texto.split(" ");

  return (
    // aria-label: leitores de tela leem o título inteiro, não palavra solta
    <Tag ref={ref} className={className} aria-label={texto}>
      {palavras.map((palavra, i) => (
        <Fragment key={`${palavra}-${i}`}>
          <span
            aria-hidden
            className="inline-block overflow-hidden align-bottom"
            // folga embaixo para não cortar descendentes (g, p, q, ç)
            style={{ paddingBottom: "0.16em", marginBottom: "-0.16em" }}
          >
            <motion.span
              className="inline-block"
              initial={reduzir ? false : { y: "115%" }}
              animate={visto || reduzir ? { y: 0 } : { y: "115%" }}
              transition={{
                duration: 0.85,
                delay: delay + i * intervalo,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {palavra}
            </motion.span>
          </span>
          {i < palavras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
