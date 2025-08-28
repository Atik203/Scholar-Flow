"use client";
import {
  Container,
  PageContainer,
  Section,
} from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography, TypographyComponents } from "@/lib/typography";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
  Layout,
  Palette,
  Shield,
  Star,
  TrendingUp,
  Type,
  Zap,
} from "lucide-react";
import React from "react";

export const DesignSystemDemo: React.FC = () => {
  return (
    <Section className="py-18 bg-gradient-to-b from-background to-muted/30">
      <PageContainer>
        <div className="text-center mb-88">
          <TypographyComponents.H1 className="mb-6">
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Phase 1 Design System
            </span>
          </TypographyComponents.H1>
          <Typography variant="lead" className="mx-auto max-w-3xl">
            Showcase of our comprehensive design tokens, typography scale, and
            layout components built for Scholar-Flow.
          </Typography>
        </div>

        {/* Color System Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-128"
        >
          <Container.Small>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <Palette className="h-6 w-6 text-primary" />
                <TypographyComponents.H2>
                  Extended Color System
                </TypographyComponents.H2>
              </div>
              <Typography variant="muted">
                OKLCH-based color scales with semantic meaning and perfect
                contrast ratios
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Success Colors */}
              <Card className="border-success/20 hover:border-success/40 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-success flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Success
                  </CardTitle>
                  <CardDescription>
                    Positive actions & confirmations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 border border-success/20" />
                    <Typography variant="small">success/10</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 border border-success/30" />
                    <Typography variant="small">success/20</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success border border-success" />
                    <Typography variant="small">success</Typography>
                  </div>
                </CardContent>
              </Card>

              {/* Warning Colors */}
              <Card className="border-warning/20 hover:border-warning/40 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-warning flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Warning
                  </CardTitle>
                  <CardDescription>Caution & important notices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning/10 border border-warning/20" />
                    <Typography variant="small">warning/10</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning/20 border border-warning/30" />
                    <Typography variant="small">warning/20</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning border border-warning" />
                    <Typography variant="small">warning</Typography>
                  </div>
                </CardContent>
              </Card>

              {/* Info Colors */}
              <Card className="border-info/20 hover:border-info/40 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-info flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Info
                  </CardTitle>
                  <CardDescription>Neutral information & tips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-info/10 border border-info/20" />
                    <Typography variant="small">info/10</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-info/20 border border-info/30" />
                    <Typography variant="small">info/20</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-info border border-info" />
                    <Typography variant="small">info</Typography>
                  </div>
                </CardContent>
              </Card>

              {/* Gray Scale */}
              <Card className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gray-700 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Gray Scale
                  </CardTitle>
                  <CardDescription>Neutral tones & backgrounds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
                    <Typography variant="small">gray-100</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border border-gray-400" />
                    <Typography variant="small">gray-300</Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 border border-gray-700" />
                    <Typography variant="small">gray-600</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container.Small>
        </motion.div>

        {/* Typography Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-128"
        >
          <Container.Small>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <Type className="h-6 w-6 text-primary" />
                <TypographyComponents.H2>
                  Typography Scale System
                </TypographyComponents.H2>
              </div>
              <Typography variant="muted">
                Consistent typography with semantic variants and responsive
                scaling
              </Typography>
            </div>

            <Card className="p-8">
              <div className="space-y-8">
                <div>
                  <TypographyComponents.H1>
                    Heading 1 - Main Headlines
                  </TypographyComponents.H1>
                  <Typography variant="muted" className="mt-2">
                    Used for primary page titles and hero headings
                  </Typography>
                </div>

                <div>
                  <TypographyComponents.H2>
                    Heading 2 - Section Titles
                  </TypographyComponents.H2>
                  <Typography variant="muted" className="mt-2">
                    Perfect for major sections and feature headings
                  </Typography>
                </div>

                <div>
                  <TypographyComponents.H3>
                    Heading 3 - Subsections
                  </TypographyComponents.H3>
                  <Typography variant="muted" className="mt-2">
                    Ideal for card titles and content groupings
                  </Typography>
                </div>

                <div>
                  <Typography variant="lead">
                    Lead text provides emphasis for important introductory
                    content.
                  </Typography>
                  <Typography variant="muted" className="mt-2">
                    Lead variant - larger and more prominent than body text
                  </Typography>
                </div>

                <div>
                  <Typography variant="p">
                    Regular paragraph text for body content. This is the
                    standard reading text that maintains good readability and
                    comfortable line height.
                  </Typography>
                  <Typography variant="muted" className="mt-2">
                    Standard paragraph variant
                  </Typography>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <Typography variant="large">Large Text</Typography>
                  <Typography variant="small">Small Text</Typography>
                  <Typography variant="muted">Muted Text</Typography>
                  <TypographyComponents.Code>
                    inline code
                  </TypographyComponents.Code>
                </div>
              </div>
            </Card>
          </Container.Small>
        </motion.div>

        {/* Layout & Spacing Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-88"
        >
          <Container.Small>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <Layout className="h-6 w-6 text-primary" />
                <TypographyComponents.H2>
                  Consistent Spacing Scale
                </TypographyComponents.H2>
              </div>
              <Typography variant="muted">
                Custom spacing values for consistent layouts and perfect visual
                hierarchy
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Custom Spacing Values</CardTitle>
                  <CardDescription>
                    Extended Tailwind spacing scale
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-18 h-4 bg-primary/20 rounded" />
                    <TypographyComponents.Code>
                      w-18 (4.5rem/72px)
                    </TypographyComponents.Code>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-88 h-4 bg-success/20 rounded" />
                    <TypographyComponents.Code>
                      w-88 (22rem/352px)
                    </TypographyComponents.Code>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Also available: 128 (32rem) and 144 (36rem)
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Container Components</CardTitle>
                  <CardDescription>Reusable layout components</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-info/50 rounded" />
                    <Typography variant="small">
                      PageContainer - max-w-[1440px]
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-warning/50 rounded" />
                    <Typography variant="small">
                      Container.Small - max-w-4xl
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-success/50 rounded" />
                    <Typography variant="small">
                      Container.Large - max-w-7xl
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-primary/50 rounded" />
                    <Typography variant="small">
                      Section - py-16 md:py-24 lg:py-32
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container.Small>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Container.Small>
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-muted/20 border-primary/20">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 mb-6">
                  <Award className="h-8 w-8 text-primary" />
                  <TypographyComponents.H2>
                    Phase 1 Complete
                  </TypographyComponents.H2>
                </div>

                <Typography variant="lead" className="max-w-2xl mx-auto">
                  Our design system now includes comprehensive color tokens,
                  typography scales, consistent spacing, and reusable layout
                  components.
                </Typography>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                  <Button variant="default" className="gap-2">
                    <Star className="h-4 w-4" />
                    Explore Components
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Heart className="h-4 w-4" />
                    View Documentation
                  </Button>
                  <Button variant="ghost" className="gap-2">
                    Next Phase
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Extended Color System
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Typography Scale
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Spacing System
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Layout Components
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          </Container.Small>
        </motion.div>
      </PageContainer>
    </Section>
  );
};
