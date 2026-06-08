import { PageContainer, Section } from "@/components/layout/PageContainer";
import { ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompanyCareersPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Company</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Careers</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Join our mission to accelerate research. We're hiring across engineering, design, and research.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-primary to-chart-1 text-white shadow-lg">
                View Openings <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Senior Full-Stack Engineer", location: "Remote", type: "Full-time" },
              { title: "AI/ML Engineer", location: "Remote", type: "Full-time" },
              { title: "Product Designer", location: "Remote", type: "Full-time" },
              { title: "Developer Advocate", location: "Remote", type: "Full-time" },
            ].map((job, i) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold">{job.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{job.location}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{job.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
