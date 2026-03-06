"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(html: string): TOCItem[] {
  if (typeof window === "undefined") return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = Array.from(doc.querySelectorAll("h2, h3, h4"));
  return headings
    .map((h) => ({
      id:
        h.id ||
        h.textContent
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") ||
        "",
      text: h.textContent || "",
      level: parseInt(h.tagName.replace("H", ""), 10),
    }))
    .filter((h) => h.text.trim());
}

export default function ArticleTOC({ content }: { content: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setItems(extractHeadings(content));
  }, [content]);

  const handleScroll = useCallback(() => {
    const headingEls = document.querySelectorAll(
      "article h2, article h3, article h4",
    );
    let current = "";
    headingEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 120) current = el.id;
    });
    setActiveId(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Table des matières"
      className="bg-white rounded-2xl border border-neutral-100 p-5"
    >
      <h3 className="font-bold text-sm text-neutral-800 mb-4 flex items-center gap-2">
        <List className="w-4 h-4 text-primary-500" />
        Table des matières
      </h3>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-xs leading-snug transition-all duration-200",
                "hover:text-primary-600",
                item.level === 2
                  ? "pl-0 font-semibold"
                  : item.level === 3
                    ? "pl-3"
                    : "pl-5",
                activeId === item.id
                  ? "text-primary-600 font-semibold"
                  : "text-neutral-500",
              )}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
