import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, UserRound } from "lucide-react";
import { whatsappLink } from "../lib/whatsapp";
import { links } from "../lib/links";
import { Container, Button } from "./ui";

const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#cobertura", label: "Cobertura" },
  { href: "#velocidade", label: "Velocidade" },
  { href: "#sobre", label: "Nossa história" },
  { href: "#faq", label: "Dúvidas" },
  { href: "#contato", label: "Contato" }
];

function Logo() {
  return (
    <a
      href="#top"
      aria-label="Nova Conexão — início"
      className="flex shrink-0 items-center gap-3 whitespace-nowrap font-display text-[1.0625rem] font-bold tracking-tight text-content"
    >
      <img
        src="/img/logo-nc.webp"
        alt=""
        width={212}
        height={128}
        className="h-7 w-auto"
      />
      <span className="hidden sm:inline">
        Nova<span className="text-brand-400"> Conexão</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do corpo com o menu mobile aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container>
        <nav
          className="flex h-16 items-center justify-between gap-6"
          aria-label="Navegação principal"
        >
          <Logo />

          <ul className="hidden items-center gap-6 xl:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-link whitespace-nowrap text-small font-medium text-content-muted transition-colors duration-200 hover:text-content"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <Button
              href={links.centralDoCliente}
              target="_blank"
              rel="noopener noreferrer"
              variant="quiet"
            >
              <UserRound size={15} /> Central do Cliente
            </Button>
            <Button
              href={whatsappLink("Olá! Quero contratar um plano da Nova Conexão.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Assine já
            </Button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-content xl:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line bg-bg xl:hidden"
          >
            <Container className="py-4">
              <ul className="flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line py-3.5 text-content-muted transition-colors hover:text-content"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button
                  href={links.centralDoCliente}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                  onClick={() => setOpen(false)}
                >
                  <UserRound size={16} /> Central do Cliente
                </Button>
                <Button
                  href={whatsappLink("Olá! Quero contratar um plano da Nova Conexão.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  onClick={() => setOpen(false)}
                >
                  Assine já
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
