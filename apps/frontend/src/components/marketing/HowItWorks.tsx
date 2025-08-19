"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const steps = [
  {
    title: "1. Upload & Parse",
    desc: "Drag PDFs – we extract text, structure, and prep embeddings.",
    gif: "https://placehold.co/600x340/111/EEE?text=Upload+GIF",
  },
  {
    title: "2. Organize & Annotate",
    desc: "Group into collections & leave contextual highlights.",
    gif: "https://placehold.co/600x340/111/EEE?text=Annotate+GIF",
  },
  {
    title: "3. Search & Summarize",
    desc: "Vector similarity (coming) & AI summaries spotlight insights.",
    gif: "https://placehold.co/600x340/111/EEE?text=Search+GIF",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-28 bg-gradient-to-b from-background via-muted/40 to-background"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            How Scholar-Flow works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three focused steps to transform reading into collaborative insight.
          </p>
        </div>
        <div className="space-y-16">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid lg:grid-cols-2 gap-10 items-center"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <h3 className="font-semibold text-xl tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                  {s.desc}
                </p>
              </div>
              <div className="relative rounded-xl border bg-card/50 p-2 shadow-sm">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
                  <Image
                    src={s.gif}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-x-6 -bottom-4 h-8 blur-xl bg-primary/25 rounded-full -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
