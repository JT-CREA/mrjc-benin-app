#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# deploy.sh — Script de déploiement MRJC-BÉNIN sur Plesk / 001.Africa
# ══════════════════════════════════════════════════════════════════════
# Usage :
#   chmod +x deploy.sh
#   ./deploy.sh
#
# Ce script :
#   1. Met à jour le code depuis GitHub
#   2. Installe les dépendances
#   3. Compile Next.js en production
#   4. Redémarre l'application via PM2
# ══════════════════════════════════════════════════════════════════════

set -e  # Arrêter si une commande échoue

# ── Couleurs terminal ──────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠️  $1${NC}"; }
error()   { echo -e "${RED}🚨 $1${NC}"; exit 1; }

# ── Configuration ──────────────────────────────────────────────────
APP_NAME="mrjc-benin"
APP_DIR="/var/www/vhosts/jt-crea.com/mrjc.jt-crea.com/httpdocs"
BRANCH="main"

# ══════════════════════════════════════════════════════════════════
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   DÉPLOIEMENT MRJC-BÉNIN — Plesk        ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Aller dans le dossier de l'app ────────────────────────────
info "Répertoire : $APP_DIR"
cd "$APP_DIR" || error "Répertoire introuvable : $APP_DIR"

# ── 2. Mise à jour Git ───────────────────────────────────────────
info "Mise à jour du code depuis GitHub (branche $BRANCH)..."
git fetch origin
git reset --hard "origin/$BRANCH"
git pull origin "$BRANCH"
success "Code mis à jour"

# ── 3. Vérifier .env.production ──────────────────────────────────
if [ ! -f ".env.production" ]; then
  warn ".env.production introuvable ! Copier .env.production.example et le remplir."
  error "Déploiement annulé — fichier .env.production manquant"
fi
success "Variables d'environnement trouvées"

# ── 4. Installer les dépendances ─────────────────────────────────
info "Installation des dépendances npm..."
npm ci --prefer-offline --omit=dev 2>/dev/null || npm install --production
success "Dépendances installées"

# ── 5. Build Next.js ─────────────────────────────────────────────
info "Compilation Next.js (peut prendre 2-5 minutes)..."
NODE_ENV=production npm run build
success "Build Next.js terminé"

# ── 6. Redémarrer avec PM2 ───────────────────────────────────────
info "Redémarrage de l'application PM2..."

if pm2 show "$APP_NAME" > /dev/null 2>&1; then
  # App déjà enregistrée → redémarrer
  pm2 restart "$APP_NAME" --update-env
  success "Application redémarrée"
else
  # Première fois → démarrer et enregistrer
  pm2 start server.js \
    --name "$APP_NAME" \
    --interpreter node \
    --max-memory-restart 512M \
    --env production
  pm2 save
  success "Application démarrée et enregistrée dans PM2"
fi

# ── 7. Afficher le statut ─────────────────────────────────────────
echo ""
pm2 show "$APP_NAME" 2>/dev/null | grep -E "status|pid|uptime|restarts|memory" || true
echo ""
success "Déploiement terminé ! Site : https://mrjc.jt-crea.com"
echo ""
