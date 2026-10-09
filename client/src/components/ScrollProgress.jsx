import { motion, useScroll, useSpring } from "framer-motion";

// Indicador de progresso de leitura — fio fino, sem gradiente nem brilho.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand-500"
      aria-hidden
    />
  );
}
