import { Instagram, Facebook, MessageCircle, ArrowUp } from "lucide-react";
import { whatsappLink } from "../lib/whatsapp";
import { links } from "../lib/links";
import { Container } from "./ui";
import Reveal from "./Reveal";

const socials = [
  { icon: Instagram, label: "Instagram", href: links.instagram },
  { icon: Facebook, label: "Facebook", href: links.facebook },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: whatsappLink("Olá, Nova Conexão!")
  }
];

const cols = [
  {
    titulo: "Navegação",
    items: [
      { label: "Planos", href: "#planos" },
      { label: "Cobertura", href: "#cobertura" },
      { label: "Teste de velocidade", href: "#velocidade" },
      { label: "Nossa história", href: "#sobre" },
      { label: "Dúvidas", href: "#faq" },
      { label: "Contato", href: "#contato" }
    ]
  },
  {
    titulo: "Suporte",
    items: [
      { label: "Central do Cliente", href: links.centralDoCliente },
      { label: "2ª via de boleto", href: links.centralDoCliente },
      {
        label: "Falar no WhatsApp",
        href: whatsappLink("Olá! Preciso de suporte.")
      }
    ]
  },
  {
    titulo: "Institucional",
    items: [
      { label: "Política de Privacidade", href: "#" },
      { label: "LGPD", href: "#" },
      { label: "Contrato e Termos", href: "#" },
      { label: "ANATEL", href: "https://www.gov.br/anatel/" },
      {
        label: "Trabalhe Conosco",
        href: whatsappLink(
          "Olá! Eu gostaria de fazer parte do time Nova Conexão."
        ),
        destaque: true
      }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <Reveal efeito="fade" duration={1.1}>
          <div>
            <a href="#top" className="inline-block">
              <img
                src="/img/logo-branco.webp"
                alt="Nova Conexão Internet"
                width={575}
                height={434}
                loading="lazy"
                className="h-24 w-auto opacity-95"
              />
            </a>
            <p className="mt-4 max-w-xs text-small leading-relaxed text-content-muted">
              Provedor de internet fibra óptica em Ajuricaba-RS e região
              noroeste. Tecnologia com atendimento local.
            </p>
            <p className="mt-4 text-small text-content-faint">
              {links.endereco}
              <br />
              {links.telefone}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-md border border-line text-content-muted transition-colors duration-200 hover:border-line-strong hover:text-content"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>
          </Reveal>

          {cols.map((col, i) => (
            <Reveal key={col.titulo} efeito="subir" delay={0.12 + i * 0.12}>
            <div>
              <h4 className="text-small font-semibold text-content">
                {col.titulo}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.destaque
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`link-sublinha text-small ${
                        l.destaque
                          ? // brand-400 em vez de 300: o tom mais claro "lava"
                            // em telas de celular e acaba parecendo branco.
                            "font-semibold text-brand-400 hover:text-brand-300"
                          : "text-content-muted hover:text-content"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 sm:flex-row">
          <p className="text-small text-content-faint">
            © {new Date().getFullYear()} Nova Conexão · Ajuricaba-RS
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-small text-content-muted transition-colors duration-200 hover:text-content"
          >
            Ao topo <ArrowUp size={14} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
