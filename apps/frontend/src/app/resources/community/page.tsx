import { PageContainer, Section } from "@/components/layout/PageContainer";
import { Users, ArrowRight, MessageSquare, Github, Calendar } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResourcesCommunityPage() {
  return (
    <>
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5" />
        <PageContainer className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Resources</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Community</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Connect with other researchers, share insights, and get help from the community.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                Join Community <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </PageContainer>
      </Section>

      <Section className="bg-muted/30">
        <PageContainer>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: "Forum", desc: "Ask questions, share tips, and discuss research workflows.", color: "from-blue-500 to-cyan-500" },
              { icon: Github, title: "GitHub", desc: "Open source contributions, issue tracking, and feature requests.", color: "from-slate-500 to-slate-700" },
              { icon: Calendar, title: "Events", desc: "Monthly webinars, office hours, and research workshops.", color: "from-amber-500 to-orange-500" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
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
