import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Reveal from "../components/Reveal";
import { Container, Section, SectionHeader, Button } from "../components/ui";
import { api } from "../lib/api";
import { plansFallback } from "../data";
import { planWhatsappLink } from "../lib/whatsapp";

function formatPreco(valor) {
  return Number.isInteger(valor) ? valor : valor.toFixed(2).replace(".", ",");
}

/**
 * Seletor de planos para o celular.
 * Empilhados, os três cartões viram ~3 telas de rolagem e não dá para
 * comparar. Aqui velocidade e preço dos três ficam lado a lado, e o cartão
 * completo do escolhido aparece logo abaixo. No desktop não aparece.
 */
function SeletorDePlanos({ plans, ativoId, onSelect }) {
  return (
    <Reveal efeito="zoom" delay={0.1} className="mt-10 md:hidden">
    <div
      role="tablist"
      aria-label="Escolha o plano"
      className="grid grid-cols-3 gap-2"
    >
      {plans.map((p) => {
        const ativo = p.id === ativoId;
        return (
          <button
            key={p.id}
            role="tab"
            aria-selected={ativo}
            onClick={() => onSelect(p.id)}
            className={`relative rounded-lg border px-2 pb-3 pt-4 text-center transition-colors duration-300 ${
              ativo
                ? "border-brand-500 bg-brand-500/10"
                : "border-line bg-surface/60"
            }`}
          >
            {p.destaque && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-brand-500 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-[#04131c]">
                Recomendado
              </span>
            )}
            <span className="block font-display text-[1.625rem] font-bold leading-none text-content">
              {p.velocidade}
            </span>
            <span className="mt-1 block text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-400">
              Mega
            </span>
            <span
              className={`mt-2.5 block text-small ${
                ativo ? "text-content" : "text-content-muted"
              }`}
            >
              R$ <strong className="font-bold">{formatPreco(p.preco)}</strong>
            </span>
          </button>
        );
      })}
    </div>
    </Reveal>
  );
}

function PlanCard({ plano, index, whatsappNumber, visivelNoCelular }) {
  const destaque = plano.destaque;

  return (
    <Reveal
      efeito="cartao"
      delay={index * 0.14}
      duration={0.95}
      className={`h-full ${visivelNoCelular ? "" : "hidden md:block"}`}
    >
      <article
        className={`card-lift flex h-full flex-col rounded-xl border p-6 ${
          destaque
            ? "card-lift--ativo border-brand-500/45 bg-surface"
            : "border-line bg-surface/60 hover:border-line-strong"
        }`}
      >
        {/* Faixa superior com nome e selo — altura fixa mantém os
            três cards perfeitamente alinhados. */}
        <div className="flex h-6 items-center justify-between">
          <h3 className="text-small font-semibold uppercase tracking-wider text-content-muted">
            {plano.nome}
          </h3>
          {destaque && (
            <span className="rounded-sm bg-brand-500 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[#04131c]">
              Recomendado
            </span>
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-1.5">
          <span className="font-display text-[2.75rem] font-bold leading-none tracking-tight text-content">
            {plano.velocidade}
          </span>
          <span className="font-display text-base font-semibold text-brand-400">
            {plano.unidade}
          </span>
        </div>

        <p className="mt-3 text-content-muted">
          <span className="text-small">R$</span>{" "}
          <span className="font-display text-xl font-bold text-content">
            {formatPreco(plano.preco)}
          </span>
          <span className="text-small">/mês</span>
        </p>

        <div className="my-6 h-px bg-line" />

        <ul className="flex-1 space-y-3">
          {plano.beneficios.map((b) => (
            <li key={b} className="flex gap-2.5 text-small text-content-muted">
              <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Button
          href={planWhatsappLink(plano, whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          variant={destaque ? "primary" : "secondary"}
          size="lg"
          seta="diagonal"
          className="mt-7 w-full"
        >
          Assinar {plano.nome}
        </Button>
      </article>
    </Reveal>
  );
}

export default function Planos() {
  const [plans, setPlans] = useState(plansFallback);
  const [whatsappNumber, setWhatsappNumber] = useState(undefined);
  // Plano aberto no celular. Sem escolha do visitante, abre o recomendado.
  const [escolhido, setEscolhido] = useState(null);
  const ativoId =
    escolhido ?? plans.find((p) => p.destaque)?.id ?? plans[0]?.id;

  useEffect(() => {
    api.getPlans().then((r) => {
      if (r.ok && r.data?.plans?.length) setPlans(r.data.plans);
    });
    api.getContactInfo().then((r) => {
      if (r.ok && r.data?.whatsapp) setWhatsappNumber(r.data.whatsapp);
    });
  }, []);

  return (
    <Section id="planos" size="md" tone="soft" divider>
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Planos"
          title="Escolha a velocidade ideal"
          description="Sem fidelidade abusiva e sem letras miúdas. Instalação e roteador inclusos em todos os planos."
        />

        <SeletorDePlanos
          plans={plans}
          ativoId={ativoId}
          onSelect={setEscolhido}
        />

        <div className="mt-6 grid items-stretch gap-5 md:mt-12 md:grid-cols-3">
          {plans.map((p, i) => (
            <PlanCard
              key={p.id}
              plano={p}
              index={i}
              whatsappNumber={whatsappNumber}
              visivelNoCelular={p.id === ativoId}
            />
          ))}
        </div>

        <Reveal
          efeito="fade"
          delay={0.2}
          className="mt-8 text-center text-small text-content-faint"
        >
          Valores mensais. Consulte a disponibilidade no seu endereço.
        </Reveal>
      </Container>
    </Section>
  );
}
