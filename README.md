# 🌿 MRJC-BÉNIN — Site Web Officiel

**Mouvement Rural de Jeunesse Chrétienne du Bénin**  
Application web Next.js 14 — Vitrine institutionnelle + Espace ressources + Tableau de bord admin

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Démarrage rapide](#démarrage-rapide)
4. [Structure du projet](#structure-du-projet)
5. [Variables d'environnement](#variables-denvironnement)
6. [Pages & Routes](#pages--routes)
7. [APIs](#apis)
8. [Tableau de bord admin](#tableau-de-bord-admin)
9. [Déploiement Vercel](#déploiement-vercel)
10. [Tests](#tests)
11. [Contribution](#contribution)

---

## Vue d'ensemble

Site institutionnel de l'ONG **MRJC-BÉNIN**, organisation fondée en 1985 et active dans les domaines du développement rural, de la santé communautaire, de l'alphabétisation et de l'autonomisation des femmes au Bénin.

### Fonctionnalités principales

| Fonctionnalité | Statut |
|---|---|
| Site vitrine 27 pages publiques | ✅ |
| Centre de ressources avec téléchargements tracés | ✅ |
| Blog & Actualités avec TOC | ✅ |
| Formulaire de contact + emails Resend | ✅ |
| Newsletter Brevo avec double opt-in | ✅ |
| Tableau de bord admin 16 modules | ✅ |
| Analytics avec graphiques | ✅ |
| PWA offline + Service Worker | ✅ |
| i18n FR / EN / ES | ✅ |
| SEO complet (sitemap, robots, OG) | ✅ |
| Carte interactive Leaflet | ✅ |
| Rate limiting & sécurité | ✅ |

---

## Architecture technique

```
Stack : Next.js 14 (App Router) + TypeScript 5 + Tailwind CSS 3.4
État  : Server Components par défaut / Client Components ciblés
Emails : Resend + React Email
Newsletter : Brevo (ex-Sendinblue)
DB (optionnel) : MongoDB Atlas
Déploiement : Vercel (régions cdg1 + fra1)
Tests : Jest 29 + React Testing Library + Playwright
```

---

## Démarrage rapide

### Prérequis

- Node.js ≥ 18.17.0
- npm ≥ 9.0.0 (ou pnpm ≥ 8)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/mrjc-benin/website.git
cd website

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditez .env.local avec vos valeurs

# 4. Démarrer en développement
npm run dev
# → http://localhost:3000
```

### Scripts disponibles

```bash
npm run dev          # Serveur de développement avec Turbopack
npm run build        # Build de production
npm run start        # Démarrer le build de production
npm run lint         # ESLint
npm run lint:fix     # ESLint avec corrections automatiques
npm run type-check   # Vérification TypeScript sans build
npm run test         # Tests Jest
npm run test:watch   # Tests en mode watch
npm run test:coverage # Coverage des tests
npm run test:e2e     # Tests Playwright (nécessite le serveur)
```

---

## Structure du projet

```
mrjc-benin/
├── public/
│   ├── sw.js              # Service Worker PWA
│   ├── manifest.webmanifest
│   └── assets/            # Images & icônes statiques
│
├── src/
│   ├── app/               # Routes Next.js 14 (App Router)
│   │   ├── (public)/      # Pages publiques
│   │   ├── admin/         # Tableau de bord (protégé JWT)
│   │   └── api/           # Routes API
│   │
│   ├── components/
│   │   ├── layout/        # Navbar, Footer, Breadcrumb…
│   │   ├── sections/      # Composants par section
│   │   └── ui/            # Composants UI réutilisables
│   │
│   ├── config/            # Configurations (site, navigation)
│   ├── data/              # Données JSON statiques
│   ├── emails/            # Templates React Email
│   ├── hooks/             # Hooks React personnalisés
│   ├── lib/               # Utilitaires (MongoDB, Resend, Brevo…)
│   ├── types/             # Types TypeScript globaux
│   └── middleware.ts      # Middleware Next.js (auth, sécurité)
│
├── __tests__/             # Tests Jest
├── .env.example           # Template variables d'environnement
├── vercel.json            # Configuration Vercel
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Variables d'environnement

Copiez `.env.example` vers `.env.local` et renseignez les valeurs :

```bash
# Obligatoires
NEXT_PUBLIC_SITE_URL=https://mrjc-benin.org
REVALIDATE_SECRET=votre-secret-aleatoire-fort

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@mrjc-benin.org
CONTACT_EMAIL_TO=contact@mrjc-benin.org

# Newsletter (Brevo)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxx
BREVO_LIST_ID=1

# Base de données (optionnel)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mrjc-benin

# Analytics (optionnel)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **Sécurité :** Ne commitez jamais `.env.local`. Le fichier est déjà dans `.gitignore`.

---

## Pages & Routes

### Pages publiques (27)

| Route | Description |
|---|---|
| `/` | Accueil |
| `/about` | Présentation générale |
| `/about/history` | Histoire & Genèse |
| `/about/vision-mission` | Vision & Mission |
| `/about/values` | Valeurs & Principes |
| `/about/organization` | Notre Organisation |
| `/domains` | Domaines d'intervention |
| `/domains/[slug]` | Détail d'un domaine |
| `/projects` | Tous les projets |
| `/projects/ongoing` | Projets en cours |
| `/projects/completed` | Projets achevés |
| `/projects/[slug]` | Détail d'un projet |
| `/news` | Actualités |
| `/news/[slug]` | Article d'actualité |
| `/blog` | Blog & Analyses |
| `/blog/[slug]` | Article de blog |
| `/resources` | Centre de ressources |
| `/resources/publications` | Publications |
| `/resources/technical-guides` | Guides techniques |
| `/resources/annual-reports` | Rapports annuels |
| `/resources/photo-albums` | Albums photos |
| `/impact` | Notre Impact |
| `/partners` | Partenaires |
| `/work-with-us` | Travailler avec nous |
| `/work-with-us/volunteer` | Bénévolat |
| `/work-with-us/internship` | Stages |
| `/work-with-us/jobs` | Offres d'emploi |
| `/work-with-us/collaboration` | Partenariats |
| `/contact` | Contact |
| `/search` | Recherche |

### Pages admin (protégées)

| Route | Description |
|---|---|
| `/admin` | Dashboard principal |
| `/admin/analytics` | Analytics & statistiques |
| `/admin/projects` | Gestion projets |
| `/admin/news` | Gestion actualités |
| `/admin/blog` | Gestion blog |
| `/admin/resources` | Gestion ressources |
| `/admin/domains` | Gestion domaines |
| `/admin/team` | Gestion équipe |
| `/admin/partners` | Gestion partenaires |
| `/admin/newsletter` | Gestion newsletter |
| `/admin/messages` | Messages de contact |
| `/admin/media` | Médiathèque |
| `/admin/users` | Utilisateurs admin |
| `/admin/settings` | Paramètres |

---

## APIs

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/contact` | POST | Formulaire de contact |
| `/api/newsletter` | POST | Inscription newsletter |
| `/api/newsletter/unsubscribe` | GET/POST | Désabonnement |
| `/api/visitors` | POST | Tracking visites |
| `/api/downloads` | POST | Tracking téléchargements |
| `/api/revalidate` | POST | Revalidation ISR |

Toutes les routes API sont protégées par :
- ✅ **Validation Zod** — Schémas stricts sur les entrées
- ✅ **Rate limiting** — Limites par IP et endpoint
- ✅ **Honeypot** — Protection anti-spam sur le formulaire contact

---

## Tableau de bord admin

### Accès

```
URL      : https://mrjc-benin.org/admin
Email    : admin@mrjc-benin.org
Mot de passe : Configuré via ADMIN_PASSWORD_HASH
```

### Sécurité

- Authentification JWT avec cookie httpOnly
- Sessions expirantes (24h)
- Protection CSRF
- Middleware de vérification sur toutes les routes `/admin/*`

---

## Déploiement Vercel

### Première mise en production

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Connexion
vercel login

# 3. Déploiement (prompts automatiques)
vercel

# 4. Configurer les variables d'environnement
vercel env add RESEND_API_KEY
vercel env add BREVO_API_KEY
vercel env add REVALIDATE_SECRET
# ... (voir liste complète dans vercel.json)

# 5. Déploiement production
vercel --prod
```

### Déploiements automatiques (CI/CD)

Connectez votre dépôt GitHub à Vercel :
- Push sur `main` → déploiement automatique production
- Pull Requests → déploiements preview

### Revalidation ISR post-déploiement

```bash
curl -X POST https://mrjc-benin.org/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "VOTRE_REVALIDATE_SECRET", "path": "*"}'
```

---

## Tests

```bash
# Tests unitaires
npm run test

# Avec coverage
npm run test:coverage

# Tests E2E (Playwright)
npm run dev &
npm run test:e2e

# Test spécifique
npm run test -- --testPathPattern=contact
```

### Couverture cible

| Scope | Cible |
|---|---|
| `src/lib/**` | ≥ 80% |
| `src/app/api/**` | ≥ 70% |
| `src/components/**` | ≥ 60% |

---

## Contribution

### Workflow Git

```bash
# Créer une branche feature
git checkout -b feature/ma-fonctionnalite

# Commits conventionnels
git commit -m "feat(blog): ajouter pagination infinie"
git commit -m "fix(contact): corriger validation email"
git commit -m "docs(readme): mettre à jour les routes API"

# Push & Pull Request
git push origin feature/ma-fonctionnalite
```

### Convention de commits

| Préfixe | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage CSS |
| `refactor` | Refactoring |
| `test` | Tests |
| `chore` | Maintenance |

---

## Licence & Contact

**MRJC-BÉNIN** — Mouvement Rural de Jeunesse Chrétienne du Bénin  
01 BP 2017, Cotonou — Bénin  
📧 contact@mrjc-benin.org  
🌐 [mrjc-benin.org](https://mrjc-benin.org)

© 2025 MRJC-BÉNIN — Tous droits réservés
