"use client";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

const reviews = [
  {
    name: "Dr. Anika Patel",
    role: "Principal Investigator, HCI Lab",
    rating: 5,
    text: "ScholarFlow transformed our literature review process. The clean UX and AI-powered summaries save us hours every week.",
    avatar: "https://i.pravatar.cc/80?img=1",
    university: "Stanford University",
  },
  {
    name: "Dr. James Kim",
    role: "PhD Candidate, NLP Research",
    rating: 5,
    text: "The annotation flow feels incredibly intuitive. Finally, a tool that understands how researchers actually work.",
    avatar: "https://i.pravatar.cc/80?img=3",
    university: "MIT",
  },
  {
    name: "Dr. Sofia Alvarez",
    role: "Senior Research Analyst",
    rating: 4,
    text: "Looking forward to the vector search feature. The current collaboration tools are already game-changing.",
    avatar: "https://i.pravatar.cc/80?img=9",
    university: "Berkeley Lab",
  },
  {
    name: "Dr. Michael Chen",
    role: "Postdoc Researcher",
    rating: 5,
    text: "The semantic search capabilities are incredible. It finds connections I would have missed completely.",
    avatar: "https://i.pravatar.cc/80?img=7",
    university: "Harvard Medical",
  },
  {
    name: "Dr. Sarah Johnson",
    role: "Library Sciences Director",
    rating: 5,
    text: "Our students love the collaborative features. It's like having a research assistant that never sleeps.",
    avatar: "https://i.pravatar.cc/80?img=5",
    university: "Yale University",
  },
];

export const Reviews: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section
      className="py-32 relative overflow-hidden"
      aria-labelledby="reviews-heading"
    >
      {/* Enhanced background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-muted/15 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/4),transparent_60%)]" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="reviews-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            What researchers are saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by leading researchers and institutions worldwide
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex-none w-[340px] md:w-[380px]"
                >
                  <div className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/20">
                    {/* Quote mark */}
                    <div className="absolute -top-3 -left-3 h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30 flex items-center justify-center text-primary text-2xl font-serif">
                      "
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-5 w-5 text-muted-foreground/30"
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <blockquote className="text-foreground/90 leading-relaxed mb-8 text-base">
                      "{review.text}"
                    </blockquote>

                    {/* User info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={review.avatar}
                          alt={`${review.name} avatar`}
                          width={56}
                          height={56}
                          className="rounded-full border-2 border-primary/20 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm">
                          {review.name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {review.role}
                        </div>
                        <div className="text-primary/80 text-xs font-medium mt-1">
                          {review.university}
                        </div>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="h-12 w-12 rounded-full border border-border bg-background/80 backdrop-blur hover:bg-primary/10 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="h-12 w-12 rounded-full border border-border bg-background/80 backdrop-blur hover:bg-primary/10 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
