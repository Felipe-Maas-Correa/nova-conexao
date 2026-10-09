# Colocando o site da Nova Conexão no servidor da empresa

Tutorial passo a passo para publicar o novo site em um servidor próprio e,
depois de testar, trocar o site antigo por ele. Tudo o que é necessário está no
repositório do GitHub; basta ter o link dele.

**Repositório:** https://github.com/Felipe-Maas-Correa/nova-conexao

---

## Visão geral

```
Visitante ──► Nginx (porta 80/443)
                ├─ site (arquivos prontos)  /var/www/nova-conexao/site/atual
                ├─ fotos e vídeos HD        /var/www/nova-conexao/midias/img
                └─ /api/...  ──► API Node (porta 4000, só acessível de dentro)
```

- **Nginx** entrega o site e as mídias, e cuida do HTTPS.
- **API Node** recebe as mensagens do formulário de contato.
- **Sem Firebase.** O servidor passa a ser o dono de tudo.

**Este tutorial assume um servidor Linux Ubuntu 22.04 ou 24.04** (pode ser uma
máquina virtual). Se for outro sistema, avise antes de começar: os comandos
mudam.

### O que você precisa ter

| Item | Detalhe |
|---|---|
| Servidor | Ubuntu Server, 2 GB de RAM, 20 GB de disco livres (mais se for guardar muitos vídeos) |
| Acesso | Usuário com `sudo` (de preferência por SSH) |
| Internet | O servidor precisa acessar a internet (GitHub e instalação de pacotes) |
| Domínio | Acesso ao painel onde o DNS de `novaconexao.net.br` é gerenciado |
| Portas | 80 e 443 liberadas no firewall/roteador e apontando para o servidor |

---

## Parte 1 — Preparar o servidor

### 1. Atualizar o sistema e instalar os programas

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl ufw
```

Instale o **Node.js 20** (a versão que o site usa):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v      # deve mostrar v20.x
```

### 2. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. Criar o usuário e as pastas

```bash
sudo useradd --system --home /opt/nova-conexao --shell /usr/sbin/nologin novaconexao
sudo mkdir -p /opt/nova-conexao /var/www/nova-conexao/site /var/www/nova-conexao/midias/img
sudo chown -R $USER:$USER /opt/nova-conexao
```

---

## Parte 2 — Instalar o site

### 4. Baixar o código do GitHub

```bash
git clone https://github.com/Felipe-Maas-Correa/nova-conexao.git /opt/nova-conexao
cd /opt/nova-conexao
```

### 5. Configurar a API

```bash
cd /opt/nova-conexao/server
cp .env.example .env
nano .env
```

Deixe o arquivo assim (ajuste só o e-mail, se necessário):

```
PORT=4000
HOST=127.0.0.1
CLIENT_ORIGIN=https://novaconexao.net.br,https://www.novaconexao.net.br
WHATSAPP_NUMBER=5555996556467
CONTACT_EMAIL=contato@novaconexao.net.br
DATA_DIR=/var/lib/nova-conexao
```

Salve com `Ctrl+O`, `Enter` e saia com `Ctrl+X`.

> O arquivo `.env` guarda configurações do servidor e **nunca** vai para o
> GitHub (já está protegido pelo `.gitignore`).

### 6. Ativar a API como serviço

Assim ela liga sozinha quando o servidor reinicia e volta se cair.

```bash
sudo cp /opt/nova-conexao/deploy/nova-conexao-api.service /etc/systemd/system/
sudo chown -R novaconexao:novaconexao /opt/nova-conexao/server/.env
sudo systemctl daemon-reload
sudo systemctl enable nova-conexao-api
```

### 7. Gerar e publicar o site

O script abaixo baixa a versão mais nova, gera o site, publica e inicia a API.
**É o mesmo comando que você usará em toda atualização futura.**

```bash
sudo bash /opt/nova-conexao/deploy/atualizar.sh
```

Na primeira vez leva alguns minutos (instala as dependências). No final deve
aparecer `Pronto! Versão no ar: ...`.

> Se o `git pull` reclamar de "dubious ownership", rode
> `sudo git config --global --add safe.directory /opt/nova-conexao` e repita.

### 8. Configurar o Nginx

```bash
sudo cp /opt/nova-conexao/deploy/nginx-nova-conexao.conf /etc/nginx/sites-available/nova-conexao
sudo ln -s /etc/nginx/sites-available/nova-conexao /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` precisa responder `syntax is ok` e `test is successful`.

### 9. Testar antes de trocar o site antigo

No próprio servidor:

```bash
curl -I http://localhost/                 # deve responder 200 OK
curl http://localhost/api/health          # deve responder {"ok":true}
```

De outro computador da rede, abra `http://IP-DO-SERVIDOR` no navegador. O site
novo deve aparecer completo, com fotos, vídeos e mapa. Teste também o
formulário de contato (a mensagem fica guardada no servidor, veja a Parte 5).

> Neste ponto o site antigo **continua no ar**: nada foi trocado ainda.

---

## Parte 3 — Trocar o site antigo pelo novo

A troca é feita pelo DNS: o endereço `novaconexao.net.br` passa a apontar para o
servidor novo. O site antigo pode ficar intacto como plano B.

### 10. Preparar o DNS (um dia antes, se possível)

No painel do DNS do domínio:

1. Anote o IP atual do site antigo (registro **A** de `novaconexao.net.br`).
2. Reduza o **TTL** desse registro para `300` (5 minutos). Assim, se algo der
   errado, a volta é rápida.
3. Descubra o **IP público** do servidor novo. Se ele está atrás de roteador, o
   roteador precisa encaminhar as portas **80 e 443** para o servidor.

### 11. Fazer a troca

1. No painel do DNS, altere o registro **A** de `novaconexao.net.br` e o de
   `www` para o IP público do servidor novo.
2. Aguarde alguns minutos e confira:

```bash
nslookup novaconexao.net.br
```

O IP mostrado deve ser o do servidor novo. Pode levar de minutos a algumas
horas para todo mundo enxergar.

### 12. Ativar o HTTPS (cadeado)

Só depois que o DNS já apontar para o servidor novo:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d novaconexao.net.br -d www.novaconexao.net.br
```

Responda as perguntas (e-mail, aceitar termos) e escolha **redirecionar HTTP
para HTTPS** quando perguntar. A renovação do certificado é automática; para
conferir:

```bash
sudo certbot renew --dry-run
```

Abra `https://novaconexao.net.br` e confirme o cadeado.

### 13. Se algo der errado (voltar atrás)

Volte o registro **A** no DNS para o IP do site antigo. Como o TTL foi
reduzido, em poucos minutos tudo volta ao que era. Só desligue o servidor
antigo depois de alguns dias sem problemas.

---

## Parte 4 — Fotos e vídeos sem perder qualidade

Na hospedagem anterior era preciso comprimir bastante as mídias. No servidor
próprio isso deixa de ser necessário. Existem duas camadas:

| Camada | Onde fica | Para quê |
|---|---|---|
| Versões leves | Dentro do site (`client/public/img`, no GitHub) | Funcionam sempre; já vêm prontas |
| **Versões em alta qualidade** | `/var/www/nova-conexao/midias/img` (só no servidor) | Têm **prioridade**: se existir um arquivo com o mesmo nome aqui, o Nginx entrega ele no lugar |

Ou seja: para melhorar a qualidade de qualquer foto ou vídeo, basta colocar o
arquivo HD **com o mesmo nome** na pasta `midias/img`. Não precisa gerar o site
de novo.

### Gerar as versões em alta qualidade a partir dos originais

Os originais (fotos e vídeos direto do celular) **não ficam no GitHub** por
serem muito pesados (cerca de 200 MB). Guarde-os num lugar seguro e copie para o
servidor:

```bash
# Do computador onde estão os originais:
scp -r midias-originais/ SEU_USUARIO@IP-DO-SERVIDOR:/opt/nova-conexao/client/
```

No servidor, instale as dependências e gere as versões em alta qualidade:

```bash
cd /opt/nova-conexao/client
npm ci
NC_QUALIDADE=alta npm run otimizar-imagens
NC_QUALIDADE=alta npm run otimizar-videos
```

O modo `alta` gera fotos até 2560 px com qualidade 90 e vídeos Full HD com
compressão leve. Os arquivos saem em `client/public/img`. Copie-os para a pasta
de prioridade:

```bash
sudo cp -r /opt/nova-conexao/client/public/img/. /var/www/nova-conexao/midias/img/
sudo chown -R www-data:www-data /var/www/nova-conexao/midias
```

> Se o navegador continuar mostrando a versão antiga, force a atualização com
> `Ctrl+F5` (as mídias ficam em cache por até 7 dias).

> O comando de vídeos pode demorar vários minutos. Os vídeos de fundo/loop são
> cortados em 12 segundos e ficam sem áudio, por escolha de design.

### Backup das mídias

Os originais e a pasta `midias` **não estão no GitHub**. Faça cópia deles em
outro lugar (HD externo, outro servidor ou nuvem). Exemplo de cópia diária
automática para um disco montado em `/mnt/backup`:

```bash
sudo crontab -e
# adicione a linha:
0 3 * * * rsync -a /var/www/nova-conexao/midias/ /mnt/backup/nova-conexao-midias/
```

---

## Parte 5 — Dia a dia

### Atualizar o site depois de qualquer mudança

Quando houver uma versão nova no GitHub:

```bash
sudo bash /opt/nova-conexao/deploy/atualizar.sh
```

O script mantém as últimas 5 versões. Para voltar uma versão (exemplo):

```bash
ls /var/www/nova-conexao/site/
sudo ln -sfn /var/www/nova-conexao/site/20250101-120000 /var/www/nova-conexao/site/atual
```

### Ver as mensagens do formulário de contato

```bash
sudo cat /var/lib/nova-conexao/contatos.jsonl
```

Cada linha é uma mensagem (nome, e-mail, telefone, cidade, mensagem e data).
Importante: **o formulário apenas guarda as mensagens no servidor**; ele ainda
não envia e-mail nem avisa ninguém. Hoje o botão de WhatsApp é o canal que
chega direto à equipe. Enviar um e-mail a cada contato é um próximo passo
simples de implementar.

### Comandos úteis

| Para quê | Comando |
|---|---|
| Ver se a API está ligada | `sudo systemctl status nova-conexao-api` |
| Ver os registros (logs) da API | `sudo journalctl -u nova-conexao-api -f` |
| Reiniciar a API | `sudo systemctl restart nova-conexao-api` |
| Testar o Nginx | `sudo nginx -t` |
| Recarregar o Nginx | `sudo systemctl reload nginx` |
| Erros do Nginx | `sudo tail -f /var/log/nginx/error.log` |

### Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Página "502 Bad Gateway" em `/api` | API desligada | `sudo systemctl restart nova-conexao-api` e veja o `journalctl` |
| Site abre sem estilo (sem cores) | HTML antigo em cache | `Ctrl+F5`; confira que o `nginx-nova-conexao.conf` foi copiado inteiro |
| Fotos/vídeos não aparecem | Permissão da pasta | `sudo chown -R www-data:www-data /var/www/nova-conexao` |
| Certbot falha | DNS ainda não aponta para o servidor, ou porta 80 fechada | Confira `nslookup` e o firewall/roteador |
| `npm ci` dá erro de memória | Servidor com pouca RAM | Adicione memória swap ou use mais RAM |

---

## Resumo rápido (depois que tudo está instalado)

1. Mudança publicada no GitHub.
2. No servidor: `sudo bash /opt/nova-conexao/deploy/atualizar.sh`.
3. Conferir o site no navegador.

## Pendências conhecidas (não impedem a publicação)

- O formulário de contato só **guarda** as mensagens (não envia e-mail).
- O teste de velocidade abre a página da Ookla em nova aba. Para aparecer dentro
  da página é preciso liberar o domínio em *Embed URLs* no painel do Speedtest
  Custom (ver `README.md`).
- Coordenadas de Condor, Panambi e Ijuí no mapa ainda são aproximadas.
- As páginas legais (Política de Privacidade, LGPD) ainda não existem.
