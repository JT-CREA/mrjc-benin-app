"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    triggerOnce = true,
  } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
            observer.unobserve(el);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isVisible };
}

/* ── Hook pour animer plusieurs enfants avec stagger ── */
export function useRevealOnScroll(staggerDelay = 100) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => ({
      transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
    }),
    [isVisible, staggerDelay],
  );

  return { ref, isVisible, getItemStyle };
}
