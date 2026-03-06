"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import testimonials from "@/data/testimonials.json";
import { cn } from "@/lib/utils/cn";

const domainLabels: Record<string, string> = {
  "agricultural-council": "Conseil Agricole",
  "community-health": "Santé Communautaire",
  "literacy-education": "Alphabétisation",
  "women-empowerment": "Autonomisation Femmes",
  "social-intermediation": "Intermédiation Sociale",
};

const domainColors: Record<string, string> = {
  "agricultural-council": "bg-primary-500",
  "community-health": "bg-accent-500",
  "literacy-education": "bg-secondary-500",
  "women-empowerment": "bg-purple-600",
  "social-intermediation": "bg-neutral-600",
};

export default function TestimonialsSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 bg-primary-900 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-24 top-0 w-80 h-80 border border-primary-700 rounded-full opacity-30" />
        <div className="absolute -right-16 bottom-0 w-64 h-64 border border-primary-700 rounded-full opacity-30" />
        <div className="absolute right-32 top-16 w-40 h-40 border border-primary-700 rounded-full opacity-20" />
      </div>

      <div className="container-mrjc relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <div className="section-tag text-secondary-400">
            <span className="text-secondary-400 before:bg-secondary-600 after:bg-secondary-600">
              Témoignages
            </span>
          </div>
          <h2 id="testimonials-heading" className="section-title !text-white">
            Ce que disent nos bénéficiaires
          </h2>
          <p className="section-subtitle !text-primary-300">
            La parole appartient à ceux qui vivent les transformations au
            quotidien.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 -ml-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]
                             pl-4"
                >
                  <div
                    className="bg-white/10 backdrop-blur-sm border border-white/10
                                  rounded-3xl p-7 h-full flex flex-col
                                  hover:bg-white/15 transition-colors duration-300"
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-secondary-400 text-secondary-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <Quote className="w-8 h-8 text-secondary-400/50 mb-3 flex-shrink-0" />
                    <blockquote className="text-white/90 text-base leading-relaxed flex-1 italic">
                      "{t.quote}"
                    </blockquote>

                    {/* Auteur */}
                    <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/10">
                      <div
                        className="relative w-12 h-12 rounded-2xl overflow-hidden
                                      flex-shrink-0 bg-primary-700"
                      >
                        {t.photo ? (
                          <Image
                            src={t.photo}
                            alt={t.author}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center
                                          text-white font-bold text-lg"
                          >
                            {t.author.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm leading-snug truncate">
                          {t.author}
                        </p>
                        <p className="text-primary-300 text-xs truncate mt-0.5">
                          {t.role}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full flex-shrink-0",
                              domainColors[t.domain] || "bg-neutral-400",
                            )}
                          />
                          <span className="text-2xs text-primary-400 truncate">
                            {domainLabels[t.domain] || t.domain}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Témoignage ${i + 1}`}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    i === selectedIndex
                      ? "w-6 h-2 bg-secondary-500"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60",
                  )}
                />
              ))}
            </div>

            {/* Flèches */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Précédent"
                className="w-10 h-10 rounded-xl bg-white/10 border border-white/20
                           flex items-center justify-center text-white
                           hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Suivant"
                className="w-10 h-10 rounded-xl bg-white/10 border border-white/20
                           flex items-center justify-center text-white
                           hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
