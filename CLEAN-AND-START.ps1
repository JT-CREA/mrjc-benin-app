# ============================================================
#  MRJC-BÉNIN — Script PowerShell nettoyage cache webpack
#  Résout : ENOENT vendor-chunks/next.js
# ============================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     MRJC-BENIN — Nettoyage cache Next.js + Webpack      ║" -ForegroundColor Cyan  
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Tuer les process node
Write-Host "[1/4] Arrêt des processus Node.js..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "      OK" -ForegroundColor Green

# 2. Supprimer .next
Write-Host ""
Write-Host "[2/4] Suppression du dossier .next..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "      .next supprimé" -ForegroundColor Green
} else {
    Write-Host "      .next non trouvé" -ForegroundColor Gray
}

# 3. Supprimer cache node_modules
Write-Host ""
Write-Host "[3/4] Nettoyage node_modules\.cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "      Cache supprimé" -ForegroundColor Green
} else {
    Write-Host "      Pas de cache à supprimer" -ForegroundColor Gray
}

# 4. Relancer
Write-Host ""
Write-Host "[4/4] Démarrage npm run dev..." -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  → http://localhost:3000" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

npm run dev
