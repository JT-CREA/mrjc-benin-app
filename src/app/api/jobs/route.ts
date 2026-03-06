/**
 * API Route — GET /api/jobs
 * Liste les offres d'emploi ouvertes de MRJC-BÉNIN.
 * Filtrables par : type, department, status, domain
 *
 * POST /api/jobs  — Soumettre une candidature (envoie un email via Resend)
 */

import { NextRequest, NextResponse } from "next/server";

/* ── Types ──────────────────────────────────────────────────────────── */
export interface JobPosting {
  id: string;
  title: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "volunteer";
  department: string;
  domain: string;
  location: string;
  salary?: string;
  deadline: string; // ISO date
  publishedAt: string; // ISO date
  status: "open" | "closed" | "draft";
  featured: boolean;
  description: string;
  missions: string[];
  profile: string[];
  benefits?: string[];
  contact: string;
}

/* ── Données des offres (statiques — remplacer par DB en production) ── */
const JOB_POSTINGS: JobPosting[] = [
  {
    id: "job-001",
    title: "Responsable Programme Agriculture & Changements Climatiques",
    type: "full-time",
    department: "Programmes",
    domain: "Conseil Agricole",
    location: "Natitingou, Atacora",
    salary: "450 000 – 580 000 FCFA/mois",
    deadline: "2025-03-31",
    publishedAt: "2025-01-15",
    status: "open",
    featured: true,
    description:
      "MRJC-BÉNIN recherche un(e) Responsable Programme expérimenté(e) pour piloter le projet de résilience agricole face aux changements climatiques dans l'Atacora. Sous la supervision de la Directrice Exécutive, vous assurerez la coordination technique et opérationnelle du projet GCF.",
    missions: [
      "Coordonner les activités de terrain dans les 4 communes d'intervention",
      "Superviser et encadrer une équipe de 4 coordinateurs locaux et 12 agents de terrain",
      "Assurer la qualité technique des formations agroécologiques",
      "Garantir la collecte et l'analyse des données de suivi-évaluation",
      "Préparer les rapports techniques trimestriels pour le bailleur GCF",
      "Représenter MRJC-BÉNIN dans les réunions de coordination sectorielles",
    ],
    profile: [
      "Ingénieur(e) Agronome ou équivalent, idéalement avec spécialisation en agroécologie",
      "Au moins 5 ans d'expérience dans la gestion de projets agricoles en ONG",
      "Maîtrise des approches participatives et du Conseil Agricole aux adultes",
      "Expérience dans la gestion de projets financés par des bailleurs internationaux (UE, GCF, BM)",
      "Capacité à communiquer en Ditamari ou Natimba (atout majeur)",
      "Permis de conduire et capacité à se déplacer sur le terrain",
    ],
    benefits: [
      "Salaire compétitif + indemnités de déplacement",
      "Assurance maladie couvrant la famille",
      "Voiture de service pour les déplacements",
      "Formation continue et participation aux conférences sectorielles",
      "Environnement de travail inclusif et stimulant",
    ],
    contact: "rh@mrjc-benin.org",
  },
  {
    id: "job-002",
    title: "Chargé(e) de Suivi-Évaluation & Apprentissage",
    type: "full-time",
    department: "Suivi-Évaluation",
    domain: "S&E Transversal",
    location: "Cotonou (avec déplacements)",
    salary: "380 000 – 480 000 FCFA/mois",
    deadline: "2025-04-15",
    publishedAt: "2025-01-20",
    status: "open",
    featured: true,
    description:
      "Dans le cadre du renforcement de notre dispositif de suivi-évaluation, MRJC-BÉNIN recrute un(e) Chargé(e) de S&E pour coordonner les systèmes de collecte, d'analyse et de valorisation des données d'impact à l'échelle organisationnelle.",
    missions: [
      "Développer et mettre à jour les outils de collecte de données pour l'ensemble des projets",
      "Former et accompagner les équipes de terrain dans l'utilisation des outils S&E",
      "Analyser les données et produire des tableaux de bord d'impact mensuels",
      "Coordonner les évaluations internes et faciliter les évaluations externes",
      "Développer et maintenir la base de données organisationnelle de résultats",
      "Produire des rapports d'apprentissage et capitaliser les bonnes pratiques",
    ],
    profile: [
      "Master en Gestion de projets, Statistiques, Économie du développement ou équivalent",
      "Minimum 3 ans d'expérience en S&E dans le secteur ONG ou développement",
      "Maîtrise d'outils de collecte mobile (KoBoToolbox, ODK, CommCare)",
      "Compétences en analyse de données (Excel avancé, Power BI ou Stata est un atout)",
      "Capacité d'animation de formations et de facilitation",
      "Excellent sens de la rédaction en français",
    ],
    benefits: [
      "Poste à Cotonou avec missions de terrain mensuelles",
      "Assurance maladie",
      "Budget de formation individuel annuel",
    ],
    contact: "rh@mrjc-benin.org",
  },
  {
    id: "job-003",
    title: "Comptable Contrôleur(euse) de Gestion",
    type: "full-time",
    department: "Finance & Administration",
    domain: "Gestion financière",
    location: "Cotonou",
    salary: "320 000 – 420 000 FCFA/mois",
    deadline: "2025-03-20",
    publishedAt: "2025-01-10",
    status: "open",
    featured: false,
    description:
      "Sous la supervision directe du Directeur Financier & Administratif, le/la Comptable Contrôleur(euse) assurera la tenue de la comptabilité analytique par projet et le contrôle interne des dépenses selon les exigences des bailleurs.",
    missions: [
      "Tenir la comptabilité analytique multi-bailleurs selon SYSCOHADA révisé",
      "Préparer les demandes de décaissement et justifications financières",
      "Contrôler et archiver les pièces justificatives de toutes les dépenses",
      "Préparer les états financiers mensuels, trimestriels et annuels",
      "Faciliter les audits financiers externes annuels",
      "Gérer la trésorerie et les états de rapprochement bancaire",
    ],
    profile: [
      "Diplôme en Comptabilité / Finance (BTS, Licence ou DESCF)",
      "Minimum 2 ans d'expérience en comptabilité ONG ou cabinet d'audit",
      "Maîtrise du logiciel SAARI / SAGE ou équivalent",
      "Connaissance des procédures comptables des bailleurs (UE, BM, UNICEF)",
      "Rigueur, discrétion et sens du détail",
    ],
    contact: "rh@mrjc-benin.org",
  },
  {
    id: "job-004",
    title: "Stagiaire Communication Digitale (6 mois)",
    type: "internship",
    department: "Communication",
    domain: "Communication & Plaidoyer",
    location: "Cotonou",
    salary: "80 000 FCFA/mois (indemnité)",
    deadline: "2025-02-28",
    publishedAt: "2025-01-05",
    status: "open",
    featured: false,
    description:
      "MRJC-BÉNIN offre un stage professionnel en Communication Digitale à un(e) étudiant(e) motivé(e) pour appuyer la présence en ligne de l'organisation et la production de contenus éditoriaux.",
    missions: [
      "Gérer les comptes de réseaux sociaux (Facebook, Instagram, LinkedIn)",
      "Produire des contenus visuels (Canva, Adobe) pour les campagnes de sensibilisation",
      "Rédiger des articles de blog et succès stories",
      "Photographier et documenter les activités de terrain lors des missions",
      "Mettre à jour le site web et les newsletters",
    ],
    profile: [
      "En cours de Licence ou Master en Communication, Journalisme ou Marketing Digital",
      "Maîtrise de Canva et/ou outils Adobe",
      "Sens de la narration et capacité rédactionnelle en français",
      "Intérêt sincère pour le développement rural et les questions sociales",
    ],
    contact: "communication@mrjc-benin.org",
  },
  {
    id: "job-005",
    title: "Coordinateur(trice) Terrain Programme Alphabétisation",
    type: "contract",
    department: "Programmes",
    domain: "Alphabétisation & Éducation",
    location: "Bohicon, Zou",
    salary: "280 000 – 350 000 FCFA/mois",
    deadline: "2025-05-01",
    publishedAt: "2025-02-01",
    status: "open",
    featured: false,
    description:
      "Dans le cadre d'un nouveau programme d'alphabétisation dans le département du Zou, MRJC-BÉNIN recrute un(e) Coordinateur(trice) Terrain pour superviser les 24 centres d'alphabétisation et encadrer les alphabétiseurs locaux.",
    missions: [
      "Recruter et former 24 alphabétiseurs communautaires en Fon et Yoruba",
      "Superviser les activités des 24 centres d'alphabétisation",
      "Assurer le suivi pédagogique et la qualité des apprentissages",
      "Gérer les kits pédagogiques et l'approvisionnement en matériel",
      "Produire les rapports mensuels d'activités et de progrès",
    ],
    profile: [
      "Diplôme en Sciences de l'Éducation, Pédagogie ou équivalent",
      "Expérience en alphabétisation des adultes ou éducation non formelle",
      "Locuteur natif de Fon ou Yoruba (indispensable)",
      "Bonne connaissance de la zone du Zou et Collines",
      "Autonomie et sens de l'organisation",
    ],
    contact: "alphabetisation@mrjc-benin.org",
  },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

/* ── GET — Liste des offres ──────────────────────────────────────────── */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const department = searchParams.get("department");
  const domain = searchParams.get("domain");
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  let jobs = JOB_POSTINGS.filter((j) => j.status !== "draft");

  // Filtre automatique : exclure les offres expirées si status=open demandé
  if (status === "open" || !status) {
    jobs = jobs.filter(
      (j) => j.status === "open" && !isDeadlinePassed(j.deadline),
    );
  }

  if (type) jobs = jobs.filter((j) => j.type === type);
  if (department) jobs = jobs.filter((j) => j.department === department);
  if (domain) jobs = jobs.filter((j) => j.domain === domain);
  if (featured === "true") jobs = jobs.filter((j) => j.featured);

  // Trier : mis en avant d'abord, puis par date de publication
  jobs.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  const total = jobs.length;
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const offset = (pageParam - 1) * limit;
  const paged = jobs.slice(offset, offset + limit);

  return NextResponse.json(
    {
      jobs: paged,
      total,
      page: pageParam,
      limit,
      totalPages: Math.ceil(total / limit),
      departments: [...new Set(JOB_POSTINGS.map((j) => j.department))],
      domains: [...new Set(JOB_POSTINGS.map((j) => j.domain))],
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}

/* ── POST — Candidature spontanée ───────────────────────────────────── */
export async function POST(request: NextRequest) {
  let body: {
    jobId?: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    cvUrl?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const { jobId, name, email, phone, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nom, email et message de motivation sont requis." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Format email invalide." },
      { status: 400 },
    );
  }

  const job = jobId ? JOB_POSTINGS.find((j) => j.id === jobId) : null;

  // En production : envoyer via Resend
  // const { data, error } = await resend.emails.send({ ... })

  console.log("[API/jobs POST] Candidature reçue :", {
    job: job?.title ?? "Candidature spontanée",
    name,
    email,
    phone,
    message: message.substring(0, 100),
  });

  return NextResponse.json({
    success: true,
    message: `Votre candidature${job ? ` pour le poste "${job.title}"` : ""} a bien été reçue. Nous vous contacterons dans un délai de 5 jours ouvrés.`,
  });
}
