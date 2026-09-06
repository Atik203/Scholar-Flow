"use client";

import { Quote, Star, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Principal Investigator",
    institution: "MIT",
    quote: "ScholarFlow cut our literature review time by 70%. The semantic search finds papers we would have missed with keyword search.",
    rating: 5,
  },
  {
    name: "Prof. James Wilson",
    role: "Professor of Biology",
    institution: "Stanford University",
    quote: "The AI summaries are surprisingly accurate. Our grad students use them to quickly assess paper relevance before deep reading.",
    rating: 5,
  },
  {
    name: "Dr. Maria Rodriguez",
    role: "Research Scientist",
    institution: "University of Oxford",
    quote: "Collaborative collections transformed how our lab shares knowledge. No more scattered PDFs in email threads.",
    rating: 5,
  },
  {
    name: "Dr. Alex Kim",
    role: "Postdoctoral Researcher",
    institution: "Harvard University",
    quote: "The annotation system is game-changing. I can highlight, comment, and share insights with my advisor in real-time.",
    rating: 5,
  },
  {
    name: "Prof. Emily Watson",
    role: "Director of Research",
    institution: "Cambridge University",
    quote: "Enterprise workspace isolation and role-based access are exactly what we needed for our multi-lab collaboration.",
    rating: 5,
  },
  {
    name: "Dr. David Park",
    role: "PhD Candidate",
    institution: "UC Berkeley",
    quote: "I uploaded my entire reference library and had AI-generated summaries within an hour. Incredible time saver.",
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-chart-1/3 to-transparent" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-purple-500 bg-clip-text text-transparent">
              researchers
            </span>{" "}
            worldwide
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Join thousands of researchers who have transformed their workflow with ScholarFlow.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-8 rounded-2xl border border-border/50 bg-gradient-to-b from-card/80 via-card/60 to-background/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.institution}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mt-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
