import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal";
import SatelliteMap from "../components/SatelliteMap";
import { Container, Section, SectionHeader } from "../components/ui";
import { api } from "../lib/api";
import { coverageFallback } from "../data";

/** Linha de apoio sob o nome da cidade. */
function detalhe(c) {
  const n = c.pontos?.length || 0;
  if (n) return `${n} ${n === 1 ? "torre" : "torres"}`;
  return c.status === "expansao" ? "Em expansão" : "Atendida";
}

export default function Cobertura() {
  const [data, setData] = useState(coverageFallback);
  const [ativa, setAtiva] = useState(coverageFallback.cidades[0].id);

  useEffect(() => {
    api.getCoverage().then((r) => {
      if (r.ok && r.data?.cidades) setData(r.data);
    });
  }, []);

  return (
    <Section id="cobertura" size="md" divider>
      <Container>
        <SectionHeader
          eyebrow="Cobertura"
          title="Veja se a fibra já chegou até você"
          description="Rede em expansão contínua pela região noroeste do RS."
        />

        {/* Seletor: nome grande + detalhe, com um sublinhado que desliza */}
        <Reveal efeito="subir" className="mt-8 sm:mt-10">
          <div
            role="group"
            aria-label="Cidades atendidas"
            className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"
          >
            {data.cidades.map((c) => {
              const active = c.id === ativa;
              return (
                <button
                  key={c.id}
                  onClick={() => setAtiva(c.id)}
                  aria-pressed={active}
                  className={`group relative overflow-hidden rounded-sm border px-5 py-4 text-left transition-all duration-200 active:scale-[0.97] sm:min-w-[150px] ${
                    active
                      ? "border-brand-500 text-content shadow-[0_0_0_1px_rgba(8,184,234,0.35)]"
                      : "border-line bg-surface text-content-muted hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-hi hover:text-content"
                  }`}
                >
                  {/* o preenchimento azul desliza de um botão para o outro */}
                  {active && (
                    <motion.span
                      layoutId="cidade-ativa"
                      className="absolute inset-0 bg-brand-500/15"
                      transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    />
                  )}
                  <span className="relative block text-body-lg font-semibold leading-tight">
                    {c.nome}
                  </span>
                  <span
                    className={`relative mt-1 block text-small transition-colors duration-200 ${
                      active ? "text-brand-400" : "text-content-faint"
                    }`}
                  >
                    {detalhe(c)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>


        {/* O mapa se "abre" da esquerda para a direita, como uma cortina */}
        <Reveal efeito="cortina" duration={1.4} delay={0.1} className="mt-8">
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
              <SatelliteMap
                cidades={data.cidades}
                ativa={ativa}
                onSelect={setAtiva}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
