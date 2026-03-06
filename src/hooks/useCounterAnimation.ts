"use client";

import { useEffect, useState, useRef } from "react";

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  easing?: "linear" | "easeOut" | "easeInOut";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useCounterAnimation({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  easing = "easeOut",
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(start);
  const [isTriggered, setIsTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTriggered) {
          setIsTriggered(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTriggered]);

  useEffect(() => {
    if (!isTriggered) return;

    const startTime = performance.now();
    const range = end - start;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let easedProgress: number;
      switch (easing) {
        case "easeInOut":
          easedProgress = easeInOutCubic(progress);
          break;
        case "linear":
          easedProgress = progress;
          break;
        default:
          easedProgress = easeOutCubic(progress);
      }

      const currentValue = start + range * easedProgress;
      setCount(parseFloat(currentValue.toFixed(decimals)));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isTriggered, end, start, duration, decimals, easing]);

  return { count, ref };
}
