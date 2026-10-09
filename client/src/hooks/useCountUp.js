import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Anima um número de 0 até `end` quando o elemento entra na viewport.
 * Retorna { ref, value } — coloque o ref no elemento observado.
 */
export function useCountUp(end, { duration = 1800, decimals = 0 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return { ref, value, formatted };
}
