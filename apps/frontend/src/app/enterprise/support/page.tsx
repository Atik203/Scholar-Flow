import { PageContainer, Section } from "@/components/layout/PageContainer";
import { ArrowRight, Headphones, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnterpriseSupportPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Headphones className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Enterprise</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Dedicated Support</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              24/7 priority support with dedicated success managers for enterprise customers.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                Contact Sales <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "24/7 Support", desc: "Round-the-clock support via chat, email, and phone." },
              { icon: Headphones, title: "Success Manager", desc: "Dedicated account manager for onboarding and optimization." },
              { icon: MessageSquare, title: "Custom Training", desc: "Live training sessions for your team and administrators." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
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
