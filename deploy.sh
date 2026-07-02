#!/usr/bin/env bash
# Deploy-script för nissevik.com — körs på servern.
# Drar ner senaste koden, installerar, bygger och startar om appen.

set -euo pipefail

# Gå till repots mapp (där skriptet ligger), oavsett varifrån det körs
cd "$(dirname "$0")"

echo "==> Hämtar senaste koden..."
git pull

echo "==> Installerar beroenden..."
npm install

echo "==> Bygger produktionsversionen..."
npm run build

echo "==> Startar om appen i PM2..."
pm2 restart nissevik

echo "==> Klart. Sidan är uppdaterad."
