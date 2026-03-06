"use client";

/**
 * Page — Admin / Médiathèque
 * Route: /admin/media
 * Fonctionnalités :
 * - Upload par drag & drop ou sélection fichier
 * - Galerie de médias (images, PDF, vidéos)
 * - Filtres par type, date, taille
 * - Recherche et tri
 * - Détails et métadonnées d'un média
 * - Copie du lien, suppression
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  Copy,
  X,
  CheckSquare,
  Square,
  File,
  FileText,
  Film,
  Eye,
  Calendar,
  HardDrive,
  Tag,
  Check,
  FolderOpen,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaType = "image" | "pdf" | "video" | "document";

interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  size: number; // bytes
  width?: number;
  height?: number;
  uploadedAt: string;
  alt?: string;
  tags: string[];
  folder: string;
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const DEMO_MEDIA: MediaFile[] = [
  {
    id: "1",
    name: "hero-accueil.jpg",
    type: "image",
    url: "/assets/images/hero-1.jpg",
    thumbnail: "/assets/images/hero-1.jpg",
    size: 482000,
    width: 1920,
    height: 1080,
    uploadedAt: "2024-06-10",
    alt: "Bannière principale du site",
    tags: ["hero", "accueil"],
    folder: "site",
  },
  {
    id: "2",
    name: "rapport-annuel-2023.pdf",
    type: "pdf",
    url: "/assets/docs/rapport-2023.pdf",
    size: 3240000,
    uploadedAt: "2024-05-15",
    tags: ["rapport", "annuel", "2023"],
    folder: "documents",
  },
  {
    id: "3",
    name: "team-firmin.jpg",
    type: "image",
    url: "/assets/images/team-1.jpg",
    thumbnail: "/assets/images/team-1.jpg",
    size: 156000,
    width: 800,
    height: 800,
    uploadedAt: "2024-04-20",
    alt: "Dr. Firmin Ahouansou",
    tags: ["équipe", "portrait"],
    folder: "equipe",
  },
  {
    id: "4",
    name: "formation-agriculteurs.jpg",
    type: "image",
    url: "/assets/images/project-1.jpg",
    thumbnail: "/assets/images/project-1.jpg",
    size: 842000,
    width: 1600,
    height: 900,
    uploadedAt: "2024-06-05",
    alt: "Formation agriculteurs Borgou",
    tags: ["projet", "formation", "agriculture"],
    folder: "projets",
  },
  {
    id: "5",
    name: "guide-technique-maraichage.pdf",
    type: "pdf",
    url: "/assets/docs/guide-maraichage.pdf",
    size: 1850000,
    uploadedAt: "2024-03-12",
    tags: ["guide", "maraîchage", "technique"],
    folder: "documents",
  },
  {
    id: "6",
    name: "sante-communautaire.jpg",
    type: "image",
    url: "/assets/images/domain-sante.jpg",
    thumbnail: "/assets/images/domain-sante.jpg",
    size: 625000,
    width: 1400,
    height: 900,
    uploadedAt: "2024-05-28",
    alt: "Santé communautaire",
    tags: ["santé", "nutrition"],
    folder: "domaines",
  },
  {
    id: "7",
    name: "logo-mrjc.png",
    type: "image",
    url: "/assets/images/logo.png",
    thumbnail: "/assets/images/logo.png",
    size: 48000,
    width: 300,
    height: 300,
    uploadedAt: "2020-01-10",
    alt: "Logo MRJC-BÉNIN",
    tags: ["logo", "marque"],
    folder: "site",
  },
  {
    id: "8",
    name: "rapport-bilan-2022.pdf",
    type: "pdf",
    url: "/assets/docs/rapport-2022.pdf",
    size: 2980000,
    uploadedAt: "2023-04-20",
    tags: ["rapport", "bilan", "2022"],
    folder: "documents",
  },
  {
    id: "9",
    name: "femmes-leaders.jpg",
    type: "image",
    url: "/assets/images/domain-femmes.jpg",
    thumbnail: "/assets/images/domain-femmes.jpg",
    size: 713000,
    width: 1600,
    height: 900,
    uploadedAt: "2024-06-01",
    alt: "Autonomisation des femmes",
    tags: ["femmes", "leadership"],
    folder: "domaines",
  },
  {
    id: "10",
    name: "newsletter-juin.pdf",
    type: "pdf",
    url: "/assets/docs/newsletter-juin.pdf",
    size: 890000,
    uploadedAt: "2024-06-15",
    tags: ["newsletter", "juin", "2024"],
    folder: "documents",
  },
  {
    id: "11",
    name: "partenaires-ue.jpg",
    type: "image",
    url: "/assets/images/partner-eu.jpg",
    thumbnail: "/assets/images/partner-eu.jpg",
    size: 92000,
    width: 400,
    height: 200,
    uploadedAt: "2024-01-15",
    alt: "Union Européenne - partenaire",
    tags: ["partenaire", "logo"],
    folder: "partenaires",
  },
  {
    id: "12",
    name: "alphabetisation-centre.jpg",
    type: "image",
    url: "/assets/images/domain-alpha.jpg",
    thumbnail: "/assets/images/domain-alpha.jpg",
    size: 580000,
    width: 1400,
    height: 900,
    uploadedAt: "2024-04-10",
    alt: "Centre d'alphabétisation",
    tags: ["alphabétisation", "éducation"],
    folder: "domaines",
  },
];

const FOLDERS = [
  "Tous",
  "site",
  "equipe",
  "projets",
  "domaines",
  "documents",
  "partenaires",
];

const TYPE_CONFIG: Record<
  MediaType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    ext: string[];
  }
> = {
  image: {
    label: "Image",
    icon: Image,
    color: "text-blue-600",
    bg: "bg-blue-100",
    ext: [".jpg", ".png", ".gif", ".webp", ".svg"],
  },
  pdf: {
    label: "PDF",
    icon: FileText,
    color: "text-red-600",
    bg: "bg-red-100",
    ext: [".pdf"],
  },
  video: {
    label: "Vidéo",
    icon: Film,
    color: "text-purple-600",
    bg: "bg-purple-100",
    ext: [".mp4", ".avi", ".mov"],
  },
  document: {
    label: "Document",
    icon: File,
    color: "text-gray-600",
    bg: "bg-gray-100",
    ext: [".docx", ".xlsx", ".pptx"],
  },
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${bytes} o`;
}

// ─── Composant Carte Média ────────────────────────────────────────────────────
function MediaCard({
  file,
  selected,
  onSelect,
  onPreview,
  view,
}: {
  file: MediaFile;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  view: "grid" | "list";
}) {
  const [copied, setCopied] = useState(false);
  const typeConfig = TYPE_CONFIG[file.type];
  const Icon = typeConfig.icon;

  function copyLink() {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group ${selected ? "bg-primary-50" : ""}`}
      >
        <button type="button" onClick={onSelect} className="shrink-0">
          {selected ? (
            <CheckSquare className="w-5 h-5 text-primary-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
          )}
        </button>
        <div className="w-10 h-10 shrink-0" onClick={onPreview}>
          {file.type === "image" && file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.alt || file.name}
              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
            />
          ) : (
            <div
              className={`w-10 h-10 ${typeConfig.bg} rounded-lg flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 ${typeConfig.color}`} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0" onClick={onPreview}>
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatSize(file.size)} • {file.uploadedAt}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.color} hidden sm:block`}
        >
          {typeConfig.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={copyLink}
            title="Copier le lien"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onPreview}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
        selected
          ? "border-primary-400 ring-2 ring-primary-200"
          : "border-gray-100 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center"
      >
        {selected ? (
          <CheckSquare className="w-5 h-5 text-primary-600 bg-white rounded" />
        ) : (
          <Square className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 drop-shadow transition-opacity" />
        )}
      </button>

      {/* Preview */}
      <div className="aspect-square bg-gray-50" onClick={onPreview}>
        {file.type === "image" && file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.alt || file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className={`w-12 h-12 ${typeConfig.bg} rounded-2xl flex items-center justify-center`}
            >
              <Icon className={`w-6 h-6 ${typeConfig.color}`} />
            </div>
            <span className={`text-xs font-medium ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyLink();
            }}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 bg-white">
        <p className="text-xs font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-2xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
      </div>
    </motion.div>
  );
}

// ─── Modal Prévisualisation ───────────────────────────────────────────────────
function PreviewModal({
  file,
  files,
  onClose,
  onNavigate,
}: {
  file: MediaFile;
  files: MediaFile[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const typeConfig = TYPE_CONFIG[file.type];
  const Icon = typeConfig.icon;
  const currentIndex = files.findIndex((f) => f.id === file.id);

  function copyLink() {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 ${typeConfig.bg} rounded-lg flex items-center justify-center`}
            >
              <Icon className={`w-4 h-4 ${typeConfig.color}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentIndex > 0 && (
              <button
                onClick={() => onNavigate(files[currentIndex - 1].id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentIndex < files.length - 1 && (
              <button
                onClick={() => onNavigate(files[currentIndex + 1].id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aperçu */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            {/* Media */}
            <div className="md:w-2/3 bg-gray-50 flex items-center justify-center p-6 min-h-[200px]">
              {file.type === "image" && file.thumbnail ? (
                <img
                  src={file.thumbnail}
                  alt={file.alt || file.name}
                  className="max-w-full max-h-[400px] rounded-xl shadow-md object-contain"
                />
              ) : (
                <div
                  className={`w-24 h-24 ${typeConfig.bg} rounded-3xl flex items-center justify-center`}
                >
                  <Icon className={`w-12 h-12 ${typeConfig.color}`} />
                </div>
              )}
            </div>
            {/* Métadonnées */}
            <div className="md:w-1/3 p-5 space-y-4 border-t md:border-t-0 md:border-l border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Informations
              </h3>
              <div className="space-y-3">
                <MetaItem icon={Tag} label="Type" value={typeConfig.label} />
                <MetaItem
                  icon={HardDrive}
                  label="Taille"
                  value={formatSize(file.size)}
                />
                {file.width && (
                  <MetaItem
                    icon={Image}
                    label="Dimensions"
                    value={`${file.width} × ${file.height}px`}
                  />
                )}
                <MetaItem
                  icon={Calendar}
                  label="Ajouté le"
                  value={file.uploadedAt}
                />
                <MetaItem
                  icon={FolderOpen}
                  label="Dossier"
                  value={file.folder}
                />
              </div>
              {file.alt && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Texte alternatif
                  </p>
                  <p className="text-sm text-gray-700 italic">{file.alt}</p>
                </div>
              )}
              {file.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* URL */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  URL
                </p>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <code className="text-xs text-gray-600 truncate flex-1">
                    {file.url}
                  </code>
                  <button
                    onClick={copyLink}
                    className={`shrink-0 text-xs px-2 py-1 rounded transition-colors ${copied ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                  >
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
      <div>
        <span className="text-xs text-gray-500">{label} : </span>
        <span className="text-xs font-medium text-gray-700">{value}</span>
      </div>
    </div>
  );
}

// ─── Page Principale ──────────────────────────────────────────────────────────
export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>(DEMO_MEDIA);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [folderFilter, setFolderFilter] = useState("Tous");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files
    .filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchType = typeFilter === "all" || f.type === typeFilter;
      const matchFolder = folderFilter === "Tous" || f.folder === folderFilter;
      return matchSearch && matchType && matchFolder;
    })
    .sort((a, b) => {
      if (sortBy === "date") return b.uploadedAt.localeCompare(a.uploadedAt);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "size") return b.size - a.size;
      return 0;
    });

  const previewFile = previewId ? files.find((f) => f.id === previewId) : null;

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function selectAll() {
    setSelected(
      filtered.length === selected.length ? [] : filtered.map((f) => f.id),
    );
  }

  function deleteSelected() {
    setFiles((prev) => prev.filter((f) => !selected.includes(f.id)));
    setSelected([]);
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate upload
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const newMedia: MediaFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: isImage
          ? "image"
          : file.type === "application/pdf"
            ? "pdf"
            : "document",
        url: URL.createObjectURL(file),
        thumbnail: isImage ? URL.createObjectURL(file) : undefined,
        size: file.size,
        uploadedAt: new Date().toISOString().split("T")[0],
        tags: [],
        folder: "site",
      };
      setFiles((prev) => [newMedia, ...prev]);
    });
  }, []);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-6 h-6 text-primary-600" />
            Médiathèque
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {files.length} fichiers • {formatSize(totalSize)} utilisés
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Ajouter des fichiers
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.mp4"
        />
      </div>

      {/* Zone de drop */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? "#2d6a2d" : "#e5e7eb",
          backgroundColor: isDragging ? "#f0f7f0" : "#fafafa",
        }}
        className="border-2 border-dashed rounded-2xl p-8 text-center transition-colors"
      >
        <Upload
          className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? "text-primary-600" : "text-gray-400"}`}
        />
        <p
          className={`font-medium text-sm ${isDragging ? "text-primary-700" : "text-gray-600"}`}
        >
          {isDragging
            ? "Relâchez pour uploader"
            : "Glissez-déposez vos fichiers ici"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Images (JPG, PNG, WebP), PDF, Vidéos MP4 — Max 10 Mo
        </p>
      </motion.div>

      {/* Filtres & Contrôles */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher fichiers ou tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          {/* Filtres */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MediaType | "all")}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="all">Tous types</option>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            {FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f === "Tous" ? "Tous les dossiers" : f}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "name" | "size")
            }
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
          >
            <option value="date">Plus récents</option>
            <option value="name">A → Z</option>
            <option value="size">Taille</option>
          </select>
          {/* Vue */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 ${view === "grid" ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 ${view === "list" ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre de sélection */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100"
          >
            <span className="text-sm font-medium text-primary-700">
              {selected.length} sélectionné(s)
            </span>
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </button>
            <button
              onClick={() => setSelected([])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Désélectionner
            </button>
          </motion.div>
        )}
      </div>

      {/* Stats types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          Object.entries(TYPE_CONFIG) as [
            MediaType,
            (typeof TYPE_CONFIG)[MediaType],
          ][]
        ).map(([type, cfg]) => {
          const count = files.filter((f) => f.type === type).length;
          const Icon = cfg.icon;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                typeFilter === type
                  ? `border-2 ${cfg.bg} border-opacity-70`
                  : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
              }`}
            >
              <div
                className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div>
                <div className="font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">{cfg.label}s</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grille / Liste */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        {/* Légende */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary-600 transition-colors"
            >
              {selected.length === filtered.length && filtered.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-primary-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Tout sélectionner
            </button>
            <span className="text-xs text-gray-400">
              ({filtered.length} fichier{filtered.length > 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                selected={selected.includes(file.id)}
                onSelect={() => toggleSelect(file.id)}
                onPreview={() => setPreviewId(file.id)}
                view="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                selected={selected.includes(file.id)}
                onSelect={() => toggleSelect(file.id)}
                onPreview={() => setPreviewId(file.id)}
                view="list"
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Image className="w-14 h-14 mx-auto mb-3 text-gray-200" />
            <p className="font-medium text-gray-500">Aucun fichier trouvé</p>
            <p className="text-sm mt-1">
              Essayez d'autres critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Modal prévisualisation */}
      <AnimatePresence>
        {previewFile && (
          <PreviewModal
            file={previewFile}
            files={filtered}
            onClose={() => setPreviewId(null)}
            onNavigate={setPreviewId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
