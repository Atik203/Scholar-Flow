"use client";
import { motion } from "framer-motion";
import React from "react";

const quotes = [
  {
    quote:
      "We cut our literature review time in half while increasing coverage of related work.",
    author: "Research Lead, BioTech Startup",
  },
  {
    quote: "It feels like a multiplayer second brain for papers.",
    author: "AI Lab PhD Candidate",
  },
  {
    quote: "Annotation + upcoming semantic search will change our workflow.",
    author: "University Library Systems Analyst",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-28" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Early adopters love the focus
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Designed with researchers across academia & industry.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl border bg-card/60 p-6 backdrop-blur-sm"
            >
              <blockquote className="text-sm leading-relaxed">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-4 text-xs font-medium text-muted-foreground">
                {q.author}
              </figcaption>
              <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-lg">
                “
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
