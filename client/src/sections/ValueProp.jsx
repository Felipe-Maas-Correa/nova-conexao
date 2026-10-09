import { Gauge, ShieldCheck, MapPinned, Headset } from "lucide-react";
import Reveal from "../components/Reveal";
import { Container, Section } from "../components/ui";

const items = [
  {
    icon: Gauge,
    titulo: "Velocidade real",
    desc: "Fibra 100% óptica até dentro da sua casa. A velocidade contratada é a que chega."
  },
  {
    icon: ShieldCheck,
    titulo: "Rede monitorada 24h",
    desc: "Estrutura própria e acompanhamento constante para você não ficar sem conexão."
  },
  {
    icon: MapPinned,
    titulo: "Cobertura regional",
    desc: "Presença em cinco cidades da região noroeste, com expansão contínua da rede."
  },
  {
    icon: Headset,
    titulo: "Suporte de quem é daqui",
    desc: "Atendimento local e técnicos da região. Sem call center, sem espera interminável."
  }
];

export default function ValueProp() {
  return (
    <Section id="valor" size="md">
      <Container>
        {/* Composição assimétrica: título à esquerda, conteúdo à direita —
            quebra o padrão repetido de cabeçalho centralizado. */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <Reveal direction="up">
            <p className="eyebrow">Por que Nova Conexão</p>
            <h2 className="h2 mt-2.5">
              Uma internet feita para quem vive aqui
            </h2>
            <p className="lead mt-4">
              Tecnologia de ponta com o cuidado de um provedor regional.
            </p>
          </Reveal>

          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {items.map((item, i) => (
              <Reveal key={item.titulo} direction="up" delay={i * 0.04}>
                <div className="flex gap-4">
                  <item.icon
                    size={20}
                    className="mt-0.5 shrink-0 text-brand-500"
                    strokeWidth={1.75}
                  />
                  <div>
                    <h3 className="h3 text-[1.0625rem]">{item.titulo}</h3>
                    <p className="muted mt-1.5">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
