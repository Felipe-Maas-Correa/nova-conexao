import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "../components/Reveal";
import Palavras from "../components/Palavras";
import { Container, Section, Button } from "../components/ui";
import { whatsappLink } from "../lib/whatsapp";

const faqs = [
  {
    q: "Quanto tempo demora a instalação?",
    a: "Na maioria dos casos, instalamos em até 24h após a contratação, dependendo da disponibilidade na sua região."
  },
  {
    q: "Tem fidelidade?",
    a: "Não trabalhamos com fidelidade abusiva. Você fica com a gente pela qualidade, não por contrato amarrado."
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim. É só falar com a gente pelo WhatsApp ou pela Central do Cliente que ajustamos seu plano rapidamente."
  },
  {
    q: "Como faço para pagar ou pegar a 2ª via do boleto?",
    a: "Pela Central do Cliente você acessa boletos, 2ª via e histórico de pagamentos. Também enviamos por WhatsApp se preferir."
  },
  {
    q: "O roteador está incluso?",
    a: "Sim, todos os planos incluem o roteador Wi-Fi em comodato e a instalação feita pela nossa equipe local."
  },
  {
    q: "A velocidade contratada é a real?",
    a: "Sim. Nossa fibra é 100% óptica até sua casa (FTTH), então você recebe a velocidade que contratou. Você pode conferir no teste de velocidade aqui do site."
  }
];

function Item({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-body font-medium text-content">{faq.q}</span>
        <Plus
          size={18}
          className={`shrink-0 text-content-faint transition-transform duration-200 ${
            isOpen ? "rotate-45 text-brand-400" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-5 pr-8 text-body text-content-muted">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq" size="md" tone="soft" divider>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <div>
            <Reveal efeito="deslizar">
              <p className="eyebrow">Dúvidas frequentes</p>
            </Reveal>
            <Palavras as="h2" className="h2 mt-2.5" delay={0.1}>
              Tudo o que você precisa saber
            </Palavras>
            <Reveal efeito="subir" delay={0.35}>
              <p className="lead mt-4">Não encontrou sua dúvida?</p>
              <Button
                href={whatsappLink("Olá! Tenho uma dúvida sobre os planos.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="mt-4"
              >
                Falar com a equipe
              </Button>
            </Reveal>
          </div>

          {/* As perguntas entram pela direita, uma depois da outra */}
          <div className="border-t border-line">
            {faqs.map((faq, i) => (
              <Reveal
                key={faq.q}
                efeito="direita"
                delay={Math.min(i, 4) * 0.09}
              >
                <Item
                  faq={faq}
                  isOpen={open === i}
                  onToggle={() => setOpen(open === i ? -1 : i)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
