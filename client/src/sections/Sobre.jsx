import { Users, Radio, Cable } from "lucide-react";
import Reveal from "../components/Reveal";
import MediaStrip from "../components/MediaStrip";
import Palavras from "../components/Palavras";
import { Container, Section } from "../components/ui";

const marcos = [
  {
    icon: Users,
    valor: "15",
    titulo: "pessoas no começo",
    desc: "O grupo que quis internet melhor e ergueu a primeira torre."
  },
  {
    icon: Radio,
    valor: "100%",
    titulo: "do meio rural",
    desc: "Cobertura via rádio nas propriedades da região."
  },
  {
    icon: Cable,
    valor: "100%",
    titulo: "da cidade",
    desc: "Área urbana atendida por conexão de fibra óptica."
  }
];

export default function Sobre() {
  // overflow-hidden: os cartões laterais do carrossel 3D passam da coluna;
  // sem isso eles esticam a página e criam rolagem horizontal no celular.
  return (
    <Section id="sobre" size="md" divider className="overflow-hidden">
      <Container>
        {/* Coluna única: o texto segue de cima para baixo, sem obrigar
            o leitor a voltar ao topo para continuar. A largura limitada
            mantém a linha curta e confortável de ler. */}
        <Palavras as="h2" className="h2">
          Nossa história
        </Palavras>
        <div className="mt-5 max-w-2xl space-y-4">
          <Reveal efeito="subir" delay={0.15}>
            <p className="lead">
              A Nova Conexão nasceu da vontade de um pequeno grupo de 15 pessoas
              de ter uma qualidade melhor de navegação na internet. Deste desejo,
              conseguiu-se a implantação da nossa primeira torre de captação de
              internet via rádio.
            </p>
          </Reveal>
          <Reveal efeito="subir" delay={0.3}>
            <p className="lead">
              Com o passar do tempo, melhoramos e conquistamos muitos clientes
              sempre com o desejo de fazer mais. Hoje contamos com várias torres
              de transmissão, cobrindo 100% do meio rural com internet via rádio
              e 100% da cidade através de uma conexão com fibra óptica.
            </p>
          </Reveal>
        </div>

        {/* Bastidores: fotos e vídeos reais da operação, em largura total.
            Entra crescendo (zoom) — diferente dos textos, que sobem. */}
        <Reveal efeito="zoom" duration={1.1} className="mt-12">
          <MediaStrip />
        </Reveal>

        {/* Marcos da trajetória: a linha aparece e cada marco sobe em seguida */}
        <Reveal
          efeito="fade"
          className="mt-14 border-t border-line pt-10"
        >
          <div className="grid gap-8 sm:grid-cols-3">
            {marcos.map((m, i) => (
              <Reveal key={m.titulo} efeito="subir" delay={0.1 + i * 0.16}>
                <div
                  className={i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}
                >
                  <m.icon
                    size={18}
                    className="text-brand-500"
                    strokeWidth={1.75}
                  />
                  <p className="mt-3">
                    <span className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-content">
                      {m.valor}
                    </span>{" "}
                    <span className="text-small font-medium text-content-muted">
                      {m.titulo}
                    </span>
                  </p>
                  <p className="muted mt-2">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
