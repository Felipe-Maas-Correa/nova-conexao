#!/usr/bin/env bash
# Atualiza o site no servidor com a versão mais recente do GitHub.
# Uso:  sudo bash /opt/nova-conexao/deploy/atualizar.sh
#
# O que faz: baixa o código, gera o site, publica numa pasta nova e só então
# troca o link "atual". Se algo falhar no meio, o site antigo continua no ar.
set -euo pipefail

REPO=/opt/nova-conexao
SITE=/var/www/nova-conexao/site
VERSAO="$(date +%Y%m%d-%H%M%S)"

cd "$REPO"
echo ">> Baixando atualizações do GitHub"
git pull --ff-only

echo ">> Gerando o site"
( cd client && npm ci && npm run build )

echo ">> Instalando dependências da API"
( cd server && npm ci --omit=dev )

echo ">> Publicando versão $VERSAO"
mkdir -p "$SITE"
cp -r client/dist "$SITE/$VERSAO"
ln -sfn "$SITE/$VERSAO" "$SITE/atual"
chown -R www-data:www-data "$SITE"

echo ">> Reiniciando a API"
systemctl restart nova-conexao-api

# Mantém só as 5 versões mais recentes (para poder voltar atrás)
ls -1dt "$SITE"/2* 2>/dev/null | tail -n +6 | xargs -r rm -rf

echo ">> Pronto! Versão no ar: $VERSAO"
