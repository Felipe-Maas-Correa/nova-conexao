import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Revelação ao rolar a página. Cada efeito tem um "caráter" próprio, para
 * a página não ficar repetitiva — escolha o que combina com o elemento:
 *
 *  subir     texto corrido, blocos           sobe e aparece
 *  esquerda  listas, colunas à esquerda      entra deslizando da esquerda
 *  direita   formulários, colunas à direita  entra deslizando da direita
 *  zoom      cartões "de destaque", carrossel cresce a partir de 90%
 *  cartao    cartões de planos               sobe + cresce levemente
 *  cortina   mapa, fotos                     abre da esquerda p/ a direita
 *  cortinaV  fotos altas                     abre de baixo para cima
 *  deslizar  itens pequenos em sequência     desliza poucos pixels
 *  fade      quando nada pode se mover       só aparece
 *
 * Os valores são deliberadamente maiores que antes: o deslocamento anterior
 * (14px em 0,3s) era tão sutil que parecia que nada animava.
 */
const RAIO = "16px"; // mesmo raio dos cartões (rounded-xl)

const EFEITOS = {
  subir: {
    de: { opacity: 0, y: 36 },
    para: { opacity: 1, y: 0 }
  },
  esquerda: {
    de: { opacity: 0, x: -44 },
    para: { opacity: 1, x: 0 }
  },
  direita: {
    de: { opacity: 0, x: 44 },
    para: { opacity: 1, x: 0 }
  },
  zoom: {
    de: { opacity: 0, scale: 0.9 },
    para: { opacity: 1, scale: 1 }
  },
  cartao: {
    de: { opacity: 0, y: 56, scale: 0.95 },
    para: { opacity: 1, y: 0, scale: 1 }
  },
  cortina: {
    de: { clipPath: `inset(0% 100% 0% 0% round ${RAIO})` },
    para: { clipPath: `inset(0% 0% 0% 0% round ${RAIO})` }
  },
  cortinaV: {
    de: { clipPath: `inset(100% 0% 0% 0% round ${RAIO})` },
    para: { clipPath: `inset(0% 0% 0% 0% round ${RAIO})` }
  },
  deslizar: {
    de: { opacity: 0, x: -18 },
    para: { opacity: 1, x: 0 }
  },
  fade: {
    de: { opacity: 0 },
    para: { opacity: 1 }
  }
};

// Compatibilidade com o uso antigo: direction="up" | "left" | "right" ...
const DIRECAO_PARA_EFEITO = {
  up: "subir",
  down: "subir",
  left: "direita", // "left" antigo = elemento se move para a esquerda
  right: "esquerda",
  none: "fade"
};

export default function Reveal({
  children,
  efeito,
  direction,
  delay = 0,
  duration = 0.85,
  className = "",
  as = "div",
  amount = 0.15
}) {
  const reduzir = useReducedMotion();
  const ref = useRef(null);
  const nome = efeito || DIRECAO_PARA_EFEITO[direction] || "subir";
  const { de, para } = EFEITOS[nome] || EFEITOS.subir;
  const MotionTag = motion[as] || motion.div;
  const transicao = { duration, delay, ease: [0.16, 1, 0.3, 1] };
  const margem = "0px 0px -6% 0px";

  // `recorta` = efeitos de clip-path (cortinas).
  // ARMADILHA: o gatilho de visibilidade mede a área VISÍVEL do elemento.
  // Com a cortina fechada essa área é zero, então um gatilho colocado no
  // próprio elemento nunca dispara e ele ficaria invisível para sempre.
  // Por isso, nesses efeitos o gatilho fica num invólucro externo, sem recorte.
  const visto = useInView(ref, { once: true, amount, margin: margem });

  if (nome === "cortina" || nome === "cortinaV") {
    return (
      <div ref={ref} className={className}>
        <motion.div
          initial={reduzir ? false : de}
          animate={visto || reduzir ? para : de}
          transition={transicao}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={reduzir ? false : de}
      whileInView={para}
      // margem negativa: só dispara depois que o elemento já entrou um pouco
      viewport={{ once: true, amount, margin: margem }}
      transition={transicao}
    >
      {children}
    </MotionTag>
  );
}
