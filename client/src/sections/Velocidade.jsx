import { Gauge, Timer, Activity, Download, Upload } from "lucide-react";
import Reveal from "../components/Reveal";
import Palavras from "../components/Palavras";
import { Container, Section, Button } from "../components/ui";
import { links } from "../lib/links";

// O que o teste oficial mede (conforme a configuração da conta Speedtest).
const medidas = [
  { icon: Timer, label: "Ping" },
  { icon: Activity, label: "Jitter" },
  { icon: Download, label: "Download" },
  { icon: Upload, label: "Upload" }
];

/**
 * Teste de velocidade oficial: Speedtest da Ookla (conta da Nova Conexão).
 *
 * Dois modos, escolhidos em lib/links.js (`testeVelocidadeIncorporado`):
 *  - false: cartão com botão que abre o teste em nova aba (funciona sempre);
 *  - true:  o teste aparece dentro da página (iframe). Exige que o domínio do
 *           site esteja autorizado no painel do Speedtest Custom.
 */
export default function Velocidade() {
  const incorporado = links.testeVelocidadeIncorporado;

  return (
    <Section id="velocidade" size="md" tone="soft" divider>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal efeito="deslizar">
              <p className="eyebrow">Teste de velocidade</p>
            </Reveal>
            <Palavras as="h2" className="h2 mt-2.5" delay={0.1}>
              Meça sua conexão agora
            </Palavras>
            <Reveal efeito="esquerda" delay={0.3}>
              <p className="lead mt-4">
                Teste feito pelo Speedtest da Ookla, referência mundial em
                medição de internet. Sem instalar nada e em poucos segundos.
              </p>
            </Reveal>
            <Reveal efeito="esquerda" delay={0.45}>
              <p className="muted mt-4 text-small">
                Para um resultado mais preciso, conecte-se por cabo ou fique
                perto do roteador e feche downloads e streamings abertos.
              </p>
            </Reveal>
          </div>

          <Reveal efeito="zoom" delay={0.25} duration={1}>
            {incorporado ? (
              <div className="overflow-hidden rounded-xl border border-line bg-white">
                <iframe
                  src={links.testeVelocidadeUrl}
                  title="Teste de velocidade Nova Conexão"
                  loading="lazy"
                  allow="geolocation"
                  className="block h-[460px] w-full border-0"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-surface p-6 text-center sm:p-8">
                <Gauge
                  size={44}
                  strokeWidth={1.5}
                  className="mx-auto text-brand-400"
                  aria-hidden
                />
                <h3 className="h3 mt-4">Speedtest oficial</h3>
                <p className="muted mx-auto mt-2 max-w-sm">
                  O teste abre em uma nova aba e mede a sua conexão de verdade.
                  Quando terminar, é só voltar para cá.
                </p>

                <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-small text-content-muted">
                  {medidas.map((m) => (
                    <li key={m.label} className="flex items-center gap-1.5">
                      <m.icon size={15} className="text-brand-400" aria-hidden />
                      {m.label}
                    </li>
                  ))}
                </ul>

                <Button
                  href={links.testeVelocidadeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  seta="diagonal"
                  className="mt-7 w-full sm:w-auto"
                >
                  Iniciar teste de velocidade
                </Button>
              </div>
            )}

            {incorporado && (
              <p className="mt-3 text-center text-small text-content-faint">
                O teste não carregou?{" "}
                <a
                  href={links.testeVelocidadeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sublinha text-brand-400"
                >
                  Abrir em nova aba
                </a>
              </p>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
