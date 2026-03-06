@echo off
:: ============================================================
::  MRJC-BÉNIN — Script de nettoyage cache webpack (Windows)
::  Résout l'erreur ENOENT vendor-chunks/next.js
:: ============================================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     MRJC-BENIN — Nettoyage cache Next.js + Webpack      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:: Arrêter tout processus Node en cours (optionnel)
echo [1/4] Arrêt des processus Node.js en cours...
taskkill /f /im node.exe 2>nul
echo      OK (ou aucun processus à arrêter)

:: Supprimer le dossier .next COMPLET
echo.
echo [2/4] Suppression du dossier .next...
if exist ".next" (
    rd /s /q ".next"
    echo      .next supprimé avec succès
) else (
    echo      .next non trouvé (déjà propre)
)

:: Supprimer le cache webpack de node_modules si existant
echo.
echo [3/4] Nettoyage cache node_modules/.cache...
if exist "node_modules\.cache" (
    rd /s /q "node_modules\.cache"
    echo      Cache node_modules supprimé
) else (
    echo      Pas de cache node_modules à supprimer
)

:: Relancer le serveur de développement
echo.
echo [4/4] Démarrage du serveur Next.js...
echo.
echo ═══════════════════════════════════════════════════════════
echo  Serveur accessible sur : http://localhost:3000
echo ═══════════════════════════════════════════════════════════
echo.
npm run dev

