"use client";
import { motion } from "framer-motion";
import React from "react";

const reviews = [
  {
    name: "A. Patel",
    role: "PI, HCI Lab",
    rating: 5,
    text: "Clean UX and helpful summaries.",
  },
  {
    name: "J. Kim",
    role: "PhD, NLP",
    rating: 5,
    text: "Annotation flow feels intuitive already.",
  },
  {
    name: "S. Alvarez",
    role: "Research Analyst",
    rating: 4,
    text: "Looking forward to vector search.",
  },
];

export const Reviews: React.FC = () => {
  return (
    <section className="py-20" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="reviews-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            Reviews
          </h2>
          <p className="mt-2 text-muted-foreground">What users say today.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card/60 p-5"
            >
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
              <div className="mt-4 text-xs font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
