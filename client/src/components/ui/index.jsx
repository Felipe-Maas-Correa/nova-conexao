import { ArrowRight, ArrowUpRight } from "lucide-react";

export { Container, Section, SectionHeader } from "./Section";

/**
 * Botão / link com variantes do Design System.
 * Renderiza <a> quando recebe `href`, senão <button>.
 *
 * `seta`: "direita" (→) ou "diagonal" (↗, para links externos). A seta
 * desliza no hover — o movimento está em `.btn-seta` no index.css.
 */
export function Button({
  as,
  href,
  variant = "primary",
  size = "md",
  seta,
  className = "",
  children,
  ...props
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    quiet: "btn-quiet"
  };
  const cls = `${variants[variant] || variants.primary} ${
    size === "lg" ? "btn-lg" : ""
  } ${className}`;

  const Tag = as || (href ? "a" : "button");
  return (
    <Tag href={href} className={cls} {...props}>
      {children}
      {seta === "direita" && (
        <ArrowRight size={16} className="btn-seta" aria-hidden />
      )}
      {seta === "diagonal" && (
        <ArrowUpRight size={16} className="btn-seta-diag" aria-hidden />
      )}
    </Tag>
  );
}

/** Painel de conteúdo. Use só quando o agrupamento ajudar a leitura. */
export function Surface({ as: Tag = "div", hover = false, className = "", children, ...props }) {
  return (
    <Tag
      className={`surface ${hover ? "surface-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Selo pequeno (badge). */
export function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={`badge ${tone === "brand" ? "badge-brand" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Indicador numérico sem caixa — números apoiados em tipografia e
 * divisores, não em cards.
 */
export function Stat({ value, label, hint, innerRef, className = "" }) {
  return (
    <div ref={innerRef} className={className}>
      <div className="font-display text-[1.75rem] font-bold leading-none text-content sm:text-[2rem]">
        {value}
      </div>
      <div className="mt-2 text-small font-medium text-content">{label}</div>
      {hint && <div className="mt-0.5 text-small text-content-faint">{hint}</div>}
    </div>
  );
}
