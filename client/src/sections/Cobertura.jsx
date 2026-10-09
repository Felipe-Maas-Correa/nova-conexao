import { useEffect, useState } from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import Reveal from "../components/Reveal";
import SatelliteMap from "../components/SatelliteMap";
import { Container, Section, SectionHeader } from "../components/ui";
import { api } from "../lib/api";
import { coverageFallback } from "../data";

const statusMap = {
  ativo: { txt: "Disponível", icon: CheckCircle2, cor: "text-emerald-400" },
  expansao: { txt: "Em expansão", icon: Wrench, cor: "text-amber-400" }
};

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

        {/* Seletor de cidades — texto e sublinhado, sem excesso de pills */}
        <Reveal efeito="fade" className="mt-10 border-y border-line py-4">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {data.cidades.map((c, i) => {
              const s = statusMap[c.status];
              const active = c.id === ativa;
              return (
                // cada cidade desliza para o lugar, uma depois da outra
                <Reveal key={c.id} efeito="deslizar" delay={0.15 + i * 0.09}>
                  <button
                    onClick={() => setAtiva(c.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2 text-small font-medium transition-colors duration-200 ${
                      active
                        ? "text-content"
                        : "text-content-muted hover:text-content"
                    }`}
                  >
                    <s.icon size={14} className={s.cor} />
                    {c.nome}
                  </button>
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        {/* O mapa se "abre" da esquerda para a direita, como uma cortina */}
        <Reveal efeito="cortina" duration={1.4} delay={0.1} className="mt-8">
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
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
