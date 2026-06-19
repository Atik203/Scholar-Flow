"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  BookOpen,
  GraduationCap,
  Code2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides covering setup, features, and best practices for ScholarFlow.",
    href: "/resources/docs",
    icon: BookOpen,
    color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Tutorials",
    description: "Step-by-step tutorials to help you master research workflows and collaboration.",
    href: "/resources/tutorials",
    icon: GraduationCap,
    color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "API Reference",
    description: "Full REST API reference with endpoints, request schemas, and authentication details.",
    href: "/resources/api",
    icon: Code2,
    color: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Community",
    description: "Join the ScholarFlow community to share insights, ask questions, and collaborate.",
    href: "/resources/community",
    icon: MessageCircle,
    color: "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ResourcesPage() {
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Everything you need to get the most out of ScholarFlow.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 max-w-4xl"
      >
        {resources.map((r) => (
          <motion.div key={r.title} variants={item}>
            <Link href={r.href}>
              <Card className="group h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-muted/60 cursor-pointer">
                <CardHeader>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${r.color}`}
                  >
                    <r.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {r.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageContainer>
  );
}
