import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Building2, ArrowRight, Target, Users, Globe, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompanyAboutPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Company</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">About Us</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We're building the future of research collaboration. Our mission is to make academic research more accessible, organized, and collaborative.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-chart-1 text-white shadow-lg">
                Join Us <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Our Mission", desc: "Democratize research tools for every researcher worldwide." },
              { icon: Users, title: "Our Team", desc: "Researchers, engineers, and designers passionate about science." },
              { icon: Globe, title: "Our Impact", desc: "Serving 12,000+ researchers across 50+ countries." },
              { icon: Lightbulb, title: "Our Vision", desc: "AI-powered research that accelerates human discovery." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
