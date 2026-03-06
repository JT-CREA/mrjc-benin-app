"use client";

/**
 * Page Admin — Messages
 * Route: /admin/messages
 * Gestion de la boîte de réception des messages de contact.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Phone,
  Archive,
  Star,
  StarOff,
  Eye,
  X,
  Send,
  Loader2,
  CheckCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: "partenariat" | "bénévolat" | "demande" | "autre";
  status: "unread" | "read" | "replied" | "archived";
  starred: boolean;
  receivedAt: string;
  organization?: string;
}

// ─── Données démo ─────────────────────────────────────────────────────────────
const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    name: "Alphonse Dossou",
    email: "a.dossou@gmail.com",
    phone: "+229 97 23 45 67",
    subject: "Demande de partenariat ONG locale",
    message:
      "Bonjour, je représente l'ONG AJED basée à Parakou. Nous travaillons sur des projets de développement agricole dans le nord Bénin et souhaiterions explorer des possibilités de partenariat avec MRJC-BÉNIN pour des actions conjointes en 2025.",
    type: "partenariat",
    status: "unread",
    starred: true,
    receivedAt: new Date(Date.now() - 1800000).toISOString(),
    organization: "AJED - Parakou",
  },
  {
    id: "2",
    name: "Marie-Claire Hounyè",
    email: "mc.hounye@yahoo.fr",
    phone: "+229 95 87 12 34",
    subject: "Candidature bénévolat nutrition",
    message:
      "Je suis nutritionniste diplômée et souhaite mettre mes compétences au service de votre programme de santé communautaire. Je suis disponible les week-ends et les vacances scolaires.",
    type: "bénévolat",
    status: "unread",
    starred: false,
    receivedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    name: "Jean-Baptiste Aïgbe",
    email: "jb.aigbe@institution.bj",
    subject: "Demande d'information sur vos formations",
    message:
      "Nous représentons la Direction Départementale Agriculture et souhaiterions obtenir des informations sur vos programmes de formation des producteurs pour une possible collaboration dans le cadre du PADA.",
    type: "demande",
    status: "read",
    starred: true,
    receivedAt: new Date(Date.now() - 7200000).toISOString(),
    organization: "DDA Atacora",
  },
  {
    id: "4",
    name: "Fatou Sow",
    email: "f.sow@eu-delegation.org",
    subject: "Appel à manifestation d'intérêt — UE",
    message:
      "Suite à notre échange lors de la conférence de Cotonou, nous vous transmettons un appel à manifestation d'intérêt pour le programme PAPAPE. MRJC-BÉNIN semble correspondre aux critères requis.",
    type: "partenariat",
    status: "replied",
    starred: true,
    receivedAt: new Date(Date.now() - 86400000).toISOString(),
    organization: "Délégation UE Bénin",
  },
  {
    id: "5",
    name: "Ibrahim Moussa",
    email: "i.moussa@gmail.com",
    subject: "Inscription programme alphabétisation",
    message:
      "Je voudrais savoir comment m'inscrire dans votre centre d'alphabétisation à Djougou. Quelles sont les conditions et les horaires de cours ?",
    type: "autre",
    status: "read",
    starred: false,
    receivedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// ─── Badge type ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: Message["type"] }) {
  const config = {
    partenariat: "bg-purple-100 text-purple-700",
    bénévolat: "bg-green-100 text-green-700",
    demande: "bg-blue-100 text-blue-700",
    autre: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${config[type]}`}
    >
      {type}
    </span>
  );
}

// ─── Message detail ───────────────────────────────────────────────────────────
function MessageDetail({
  message,
  onClose,
  onReply,
}: {
  message: Message;
  onClose: () => void;
  onReply: (id: string, reply: string) => void;
}) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    onReply(message.id, reply);
    setSent(true);
    setSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-800">{message.subject}</h2>
            <div className="mt-1 flex items-center gap-2">
              <TypeBadge type={message.type} />
              <span className="text-xs text-gray-400">
                {new Date(message.receivedAt).toLocaleString("fr-FR")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sender info */}
        <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
            {message.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{message.name}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Mail size={11} />
                {message.email}
              </span>
              {message.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={11} />
                  {message.phone}
                </span>
              )}
              {message.organization && <span>{message.organization}</span>}
            </div>
          </div>
        </div>

        {/* Message body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>
        </div>

        {/* Reply box */}
        <div className="border-t border-gray-100 px-6 py-4">
          {sent ? (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              <CheckCheck size={16} />
              Réponse envoyée avec succès !
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">
                Répondre à {message.email}
              </label>
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Tapez votre réponse..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-primary-300 focus:outline-none resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={handleSend}
                  disabled={!reply.trim() || sending}
                  className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Envoyer
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<
    "all" | "unread" | "starred" | "replied"
  >("all");

  const filtered = messages.filter((m) => {
    if (filter === "unread") return m.status === "unread";
    if (filter === "starred") return m.starred;
    if (filter === "replied") return m.status === "replied";
    return m.status !== "archived";
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const markRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "unread" ? "read" : m.status }
          : m,
      ),
    );
  };

  const toggleStar = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  };

  const archive = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "archived" } : m)),
    );
  };

  const handleReply = (id: string, _reply: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "replied" } : m)),
    );
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-400">
            {unreadCount > 0 && (
              <span className="font-medium text-orange-600">
                {unreadCount} non lu{unreadCount > 1 ? "s" : ""} ·{" "}
              </span>
            )}
            {messages.filter((m) => m.status !== "archived").length} messages au
            total
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          {
            key: "all",
            label: "Tous",
            count: messages.filter((m) => m.status !== "archived").length,
            color: "bg-gray-100 text-gray-700",
          },
          {
            key: "unread",
            label: "Non lus",
            count: unreadCount,
            color: "bg-orange-100 text-orange-700",
          },
          {
            key: "starred",
            label: "Étoilés",
            count: messages.filter((m) => m.starred).length,
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            key: "replied",
            label: "Répondus",
            count: messages.filter((m) => m.status === "replied").length,
            color: "bg-green-100 text-green-700",
          },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              filter === f.key
                ? "border-primary-300 bg-primary-50 shadow-sm"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <div
              className={`mb-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.color}`}
            >
              {f.count}
            </div>
            <p className="text-sm font-medium text-gray-700">{f.label}</p>
          </button>
        ))}
      </div>

      {/* Messages list */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">
              Aucun message dans cette catégorie
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map((message, i) => (
              <motion.li
                key={message.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/70 ${
                  message.status === "unread"
                    ? "border-l-2 border-primary-500 bg-primary-50/20"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    message.status === "unread"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.name.charAt(0)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-sm ${message.status === "unread" ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                      >
                        {message.name}
                      </span>
                      {message.organization && (
                        <span className="ml-2 text-xs text-gray-400">
                          · {message.organization}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <TypeBadge type={message.type} />
                      {message.status === "replied" && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCheck size={12} /> Répondu
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(message.receivedAt).toLocaleTimeString(
                          "fr-FR",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`mt-0.5 text-sm ${message.status === "unread" ? "font-medium text-gray-800" : "text-gray-600"}`}
                  >
                    {message.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {message.message.slice(0, 100)}…
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setSelected(message);
                      markRead(message.id);
                    }}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                    title="Lire / Répondre"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => toggleStar(message.id)}
                    className={`rounded-lg p-1.5 transition-colors ${message.starred ? "text-yellow-500 hover:bg-yellow-100" : "text-gray-400 hover:bg-yellow-100 hover:text-yellow-500"}`}
                    title="Étoiler"
                  >
                    {message.starred ? (
                      <Star size={15} />
                    ) : (
                      <StarOff size={15} />
                    )}
                  </button>
                  <button
                    onClick={() => archive(message.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Archiver"
                  >
                    <Archive size={15} />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Message detail modal */}
      <AnimatePresence>
        {selected && (
          <MessageDetail
            message={selected}
            onClose={() => setSelected(null)}
            onReply={handleReply}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
