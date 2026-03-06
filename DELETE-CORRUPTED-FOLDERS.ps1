# DELETE-CORRUPTED-FOLDERS.ps1 — MRJC-BÉNIN
# Supprime les dossiers corrompus (noms avec { ou ,) qui cassent le routeur Next.js
# Exécuter depuis : mrjc-benin-app\
# Méthode : -LiteralPath (traite le nom littéralement, sans interprétation)

Write-Host "`n=== MRJC-BÉNIN — Suppression dossiers corrompus ===" -ForegroundColor Cyan
Write-Host "Répertoire courant : $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# ── Fonction de suppression sécurisée ────────────────────────
function Remove-CorruptedFolder($path) {
    $fullPath = Join-Path (Get-Location) $path
    if (Test-Path -LiteralPath $fullPath) {
        Write-Host "  ❌ Suppression : $fullPath" -ForegroundColor Red
        Remove-Item -Recurse -Force -LiteralPath $fullPath -ErrorAction SilentlyContinue
        if (-not (Test-Path -LiteralPath $fullPath)) {
            Write-Host "     ✅ Supprimé" -ForegroundColor Green
        } else {
            Write-Host "     ⚠️  Échec — essayez manuellement dans l'Explorateur" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ℹ️  Absent (déjà supprimé) : $path" -ForegroundColor Gray
    }
}

# ── Liste des dossiers corrompus connus ───────────────────────
Write-Host "Dossiers à supprimer :" -ForegroundColor Yellow

# Dossier {newsletter et ses sous-dossiers (les plus récursifs d'abord)
Remove-CorruptedFolder "src\app\{newsletter\confirm,work-with-us\[job-slug]}"
Remove-CorruptedFolder "src\app\{newsletter\confirm,work-with-us"
Remove-CorruptedFolder "src\app\{newsletter"

# Dossier admin corrompu
Remove-CorruptedFolder "src\app\admin\{login,dashboard,projects,news,blog,resources,team,partners,domains,messages,newsletter,users,analytics,settings,media}"

# Dossiers api corrompus
Remove-CorruptedFolder "src\app\api\{blog,news,team,feedback,health,admin\stats,admin"
Remove-CorruptedFolder "src\app\api\{blog,news,team,feedback,health,admin"

# ── Recherche dynamique de tous les autres dossiers avec { ou , ──
Write-Host "`nRecherche de dossiers corrompus restants..." -ForegroundColor Yellow
$remaining = Get-ChildItem -Path "src" -Recurse -Directory -ErrorAction SilentlyContinue |
             Where-Object { $_.Name -match '[{,]' }

if ($remaining.Count -gt 0) {
    Write-Host "  Trouvés : $($remaining.Count) dossier(s) supplémentaire(s)" -ForegroundColor Red
    foreach ($dir in $remaining) {
        Write-Host "  ❌ $($dir.FullName)" -ForegroundColor Red
        Remove-Item -Recurse -Force -LiteralPath $dir.FullName -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "  ✅ Aucun dossier corrompu restant" -ForegroundColor Green
}

# ── Nettoyage cache Next.js ───────────────────────────────────
Write-Host "`n=== Nettoyage cache .next ===" -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "  ✅ Cache .next supprimé" -ForegroundColor Green
}

Write-Host "`n✅ Terminé ! Lancez maintenant : npm run dev" -ForegroundColor Green
Write-Host ""
