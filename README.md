# Nova Conexão — Site institucional

Site da **Nova Conexão**, provedor de internet por fibra óptica e rádio em
Ajuricaba-RS e região. Página única com planos, mapa de cobertura, teste de
velocidade, história da empresa, dúvidas frequentes e contato.

**Stack:** React 18 + Vite · Tailwind CSS · Framer Motion · Leaflet ·
Node.js + Express (API) · Firebase Hosting.

## Estrutura

```
.
├── client/                 Site (React)
│   ├── public/img/         Fotos, vídeos e logos já otimizados
│   ├── scripts/            Otimização de imagens e vídeos
│   └── src/
│       ├── components/     Navbar, Footer, carrossel 3D, mapa, Reveal…
│       │   └── ui/         Design system: Container, Section, Button…
│       ├── sections/       Hero, Planos, Cobertura, Velocidade, Sobre, FAQ, Contato
│       ├── data/           Dados de reserva (planos, cobertura, torres)
│       └── lib/            links.js (links e contatos), api.js, whatsapp.js
├── server/                 API (Express)
│   └── src/                routes/, data/, lib/
├── firebase.json           Configuração de hospedagem
└── .firebaserc             Projeto Firebase
```

## Como rodar

São dois terminais (o site funciona sem a API, usando os dados de reserva em
`client/src/data`; só o formulário de contato precisa dela).

```bash
# Terminal 1 — site  (http://localhost:5173)
cd client
npm install
npm run dev
```

```bash
# Terminal 2 — API   (http://localhost:4000)
cd server
npm install
cp .env.example .env     # preencha WhatsApp e e-mail
npm run dev
```

## Onde mudar o conteúdo

| O que | Onde |
|---|---|
| Telefone, e-mail, redes sociais, link da Central do Cliente | `client/src/lib/links.js` |
| Planos e preços | `client/src/data/index.js` **e** `server/src/data/plans.js` |
| Cidades e torres do mapa | `client/src/data/index.js` **e** `server/src/data/coverage.js` |
| Perguntas frequentes | `client/src/sections/FAQ.jsx` |
| Cores, raios, tipografia (design system) | `client/tailwind.config.js` e `client/src/index.css` |
| Intensidade das animações de rolagem | `client/src/components/Reveal.jsx` |

Os dados de planos e cobertura existem em dois lugares (site e API) para o site
continuar funcionando se a API estiver fora do ar. Ao alterar, mude os dois.

## Fotos e vídeos

Os arquivos em `client/public/img` já estão otimizados (WebP/MP4 leves, sem
GPS nem metadados). **Os originais não ficam no repositório** — guarde-os em
`client/midias-originais/` (ignorada pelo Git) e gere as versões do site com:

```bash
cd client
npm run otimizar-imagens   # redimensiona, corrige rotação e converte para WebP
npm run otimizar-videos    # comprime, remove áudio e metadados (inclui GPS)
```

## Publicar em servidor próprio

Passo a passo completo (Ubuntu + Nginx + HTTPS, troca do site antigo, mídias em
alta qualidade e backup): **[docs/TUTORIAL-SERVIDOR.pdf](docs/TUTORIAL-SERVIDOR.pdf)**
(versão em texto: [docs/TUTORIAL-SERVIDOR.md](docs/TUTORIAL-SERVIDOR.md)).
Os arquivos de configuração estão em `deploy/`. Depois de instalado, atualizar
o site é um comando: `sudo bash /opt/nova-conexao/deploy/atualizar.sh`.

## Publicar (Firebase Hosting)

Alternativa, caso o site volte a ser hospedado no Firebase:

```bash
cd client && npm run build && cd ..
firebase deploy --only hosting --project novaconexaointernt
```

> Use sempre `--project` para ter certeza do destino. O HTML é servido sem
> cache (ver `firebase.json`); sem isso, quem visitou antes ficaria com uma
> página velha apontando para arquivos que não existem mais.

## Teste de velocidade

Usa o **Speedtest da Ookla** (conta Speedtest Custom da empresa). Hoje a seção
abre o teste em nova aba. Para exibi-lo dentro da página, adicione o domínio do
site em *Embed URLs* no painel do Speedtest Custom e mude
`testeVelocidadeIncorporado` para `true` em `client/src/lib/links.js`.

## Pendências conhecidas

- **API não está publicada.** No Firebase só vai o site estático; o formulário
  de contato chama `/api/support` e falha fora do ambiente local. Opções:
  hospedar a API ou trocar o envio por uma mensagem de WhatsApp.
- Coordenadas e número de torres de Condor, Panambi e Ijuí ainda são
  estimativas (só Ajuricaba e Nova Ramada vieram do arquivo oficial de torres).
- Textos legais (Política de Privacidade, LGPD, Contrato) são links vazios.
- Avaliações do Google: o código existe em `server/src/lib/googleReviews.js`
  (precisa de `GOOGLE_MAPS_API_KEY` e `GOOGLE_PLACE_ID`), mas a seção de
  depoimentos foi removida do site.
