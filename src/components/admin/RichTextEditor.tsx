"use client";

/**
 * Composant — RichTextEditor
 * Éditeur de contenu riche pour le panel Admin.
 * Fonctionnalités :
 * - Barre d'outils formatage (gras, italique, listes, titres, liens)
 * - Aperçu HTML en temps réel
 * - Mode plein écran
 * - Insertion image / lien / code
 * - Compteur de mots
 * - Auto-save (callback debounced)
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Save,
  X,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  onSave?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

interface ToolbarButton {
  id: string;
  icon: React.ElementType;
  label: string;
  command?: string;
  value?: string;
  action?: () => void;
  active?: boolean;
  separator?: boolean;
}

// ─── Groupes de la barre d'outils ─────────────────────────────────────────────
function createToolbarGroups(
  editorRef: React.RefObject<HTMLDivElement>,
  fullscreen: boolean,
  setFullscreen: (v: boolean) => void,
  preview: boolean,
  setPreview: (v: boolean) => void,
): ToolbarButton[][] {
  function exec(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }

  return [
    // Titres
    [
      {
        id: "h1",
        icon: Heading1,
        label: "Titre 1",
        command: "formatBlock",
        value: "H1",
      },
      {
        id: "h2",
        icon: Heading2,
        label: "Titre 2",
        command: "formatBlock",
        value: "H2",
      },
      {
        id: "h3",
        icon: Heading3,
        label: "Titre 3",
        command: "formatBlock",
        value: "H3",
      },
    ],
    // Formatage
    [
      { id: "bold", icon: Bold, label: "Gras", command: "bold" },
      { id: "italic", icon: Italic, label: "Italique", command: "italic" },
      {
        id: "underline",
        icon: Underline,
        label: "Souligné",
        command: "underline",
      },
      {
        id: "strike",
        icon: Strikethrough,
        label: "Barré",
        command: "strikeThrough",
      },
    ],
    // Alignement
    [
      {
        id: "alignLeft",
        icon: AlignLeft,
        label: "Gauche",
        command: "justifyLeft",
      },
      {
        id: "alignCenter",
        icon: AlignCenter,
        label: "Centré",
        command: "justifyCenter",
      },
      {
        id: "alignRight",
        icon: AlignRight,
        label: "Droite",
        command: "justifyRight",
      },
    ],
    // Listes
    [
      {
        id: "ulList",
        icon: List,
        label: "Liste à puces",
        command: "insertUnorderedList",
      },
      {
        id: "olList",
        icon: ListOrdered,
        label: "Liste numérotée",
        command: "insertOrderedList",
      },
      {
        id: "quote",
        icon: Quote,
        label: "Citation",
        command: "formatBlock",
        value: "BLOCKQUOTE",
      },
      {
        id: "code",
        icon: Code,
        label: "Code",
        command: "formatBlock",
        value: "PRE",
      },
    ],
    // Media
    [
      {
        id: "link",
        icon: Link2,
        label: "Insérer un lien",
        action: () => {
          const url = window.prompt("URL du lien :");
          if (url) exec("createLink", url);
        },
      },
      {
        id: "image",
        icon: Image,
        label: "Insérer une image",
        action: () => {
          const url = window.prompt("URL de l'image :");
          if (url) exec("insertImage", url);
        },
      },
      {
        id: "hr",
        icon: Minus,
        label: "Séparateur horizontal",
        action: () => exec("insertHorizontalRule"),
      },
    ],
    // Actions
    [
      {
        id: "preview",
        icon: preview ? EyeOff : Eye,
        label: preview ? "Éditer" : "Aperçu",
        action: () => setPreview(!preview),
      },
      {
        id: "fullscreen",
        icon: fullscreen ? Minimize2 : Maximize2,
        label: fullscreen ? "Réduire" : "Plein écran",
        action: () => setFullscreen(!fullscreen),
      },
    ],
  ];
}

// ─── Composant Bouton Barre d'Outils ─────────────────────────────────────────
function ToolbarBtn({
  btn,
  onClick,
}: {
  btn: ToolbarButton;
  onClick: () => void;
}) {
  const Icon = btn.icon;
  return (
    <button
      type="button"
      title={btn.label}
      onClick={onClick}
      className="p-1.5 rounded-md hover:bg-gray-200 text-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-400"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

// ─── Éditeur Principal ────────────────────────────────────────────────────────
export default function RichTextEditor({
  value = "",
  onChange,
  onSave,
  placeholder = "Commencez à rédiger votre contenu...",
  minHeight = 300,
  className,
  label,
  required,
  error,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Initialisation du contenu
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      updateCounts(editorRef.current.textContent || "");
    }
  }, []);

  function updateCounts(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(text.length);
  }

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.textContent || "";
    updateCounts(text);
    onChange?.(html);

    // Auto-save debounced
    if (onSave) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        setSaving(true);
        onSave(html);
        setTimeout(() => setSaving(false), 1500);
      }, 2000);
    }
  }, [onChange, onSave]);

  const toolbarGroups = createToolbarGroups(
    editorRef,
    fullscreen,
    setFullscreen,
    preview,
    setPreview,
  );

  function execCommand(btn: ToolbarButton) {
    if (btn.action) {
      btn.action();
    } else if (btn.command) {
      editorRef.current?.focus();
      document.execCommand(btn.command, false, btn.value);
    }
    handleInput();
  }

  const editorContainerClass = cn(
    "border border-gray-200 rounded-xl overflow-hidden transition-all",
    fullscreen && "fixed inset-4 z-50 shadow-2xl",
    error && "border-red-400",
    className,
  );

  return (
    <div>
      {label && (
        <label className="label-field mb-1.5 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={editorContainerClass}>
        {/* Barre d'outils */}
        <div className="flex items-center flex-wrap gap-0.5 p-2 bg-gray-50 border-b border-gray-200">
          {toolbarGroups.map((group, gi) => (
            <div key={gi} className="flex items-center">
              {gi > 0 && <span className="w-px h-5 bg-gray-300 mx-1" />}
              {group.map((btn) => (
                <ToolbarBtn
                  key={btn.id}
                  btn={btn}
                  onClick={() => execCommand(btn)}
                />
              ))}
            </div>
          ))}

          {/* Indicateur auto-save */}
          <div className="ml-auto flex items-center gap-2">
            <AnimatePresence>
              {saving && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-green-600 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" /> Sauvegardé
                </motion.span>
              )}
            </AnimatePresence>
            {fullscreen && (
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Zone édition / aperçu */}
        <div className="bg-white" style={{ minHeight }}>
          {preview ? (
            /* Aperçu HTML */
            <div
              className="p-4 prose prose-sm max-w-none text-gray-800"
              style={{ minHeight }}
              dangerouslySetInnerHTML={{
                __html:
                  editorRef.current?.innerHTML ||
                  '<p class="text-gray-400 italic">Aucun contenu</p>',
              }}
            />
          ) : (
            /* Éditeur contentEditable */
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              data-placeholder={placeholder}
              className={cn(
                "p-4 outline-none text-gray-800 text-sm leading-relaxed",
                "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none",
                "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-3",
                "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2",
                "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2",
                "[&_p]:mb-3 [&_p]:leading-relaxed",
                "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3",
                "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:mb-3",
                "[&_pre]:bg-gray-900 [&_pre]:text-green-300 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:mb-3",
                "[&_a]:text-primary-600 [&_a]:underline",
                "[&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-2",
                "[&_strong]:font-bold [&_em]:italic",
              )}
              style={{
                minHeight,
                maxHeight: fullscreen ? "calc(100vh - 160px)" : undefined,
                overflowY: "auto",
              }}
            />
          )}
        </div>

        {/* Footer compteurs */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{wordCount} mots</span>
            <span>•</span>
            <span>{charCount} caractères</span>
          </div>
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(editorRef.current?.innerHTML || "")}
              className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
            >
              <Save className="w-3 h-3" /> Sauvegarder
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Overlay plein écran */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
