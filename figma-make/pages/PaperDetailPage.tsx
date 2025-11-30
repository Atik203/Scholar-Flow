"use client";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Folder,
  Heart,
  Highlighter,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Share2,
  Shield,
  Sparkles,
  Sun,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface PaperDetailPageProps {
  onNavigate?: (path: string) => void;
  onShowToast?: (message: string, type: "error" | "success" | "info") => void;
}

export function PaperDetailPage({
  onNavigate,
  onShowToast,
}: PaperDetailPageProps) {
  const [isDark, setIsDark] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const paper = {
    title: "Attention Is All You Need",
    authors: [
      "Ashish Vaswani",
      "Noam Shazeer",
      "Niki Parmar",
      "Jakob Uszkoreit",
      "Llion Jones",
      "Aidan N. Gomez",
      "Łukasz Kaiser",
      "Illia Polosukhin",
    ],
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
    year: 2017,
    venue: "NeurIPS",
    citations: 98245,
    doi: "10.48550/arXiv.1706.03762",
    collection: "Transformers",
    addedAt: "2 hours ago",
    status: "Ready",
    pageCount: 15,
    readTime: "45 min",
  };

  const aiSummary = {
    keyFindings: [
      "Introduced the Transformer architecture, eliminating the need for recurrence",
      "Self-attention mechanism allows modeling dependencies regardless of distance",
      "Achieved state-of-the-art results on English-to-German and English-to-French translation",
      "Training time significantly reduced compared to recurrent models",
    ],
    methodology:
      "The paper proposes a novel architecture based entirely on attention mechanisms. The model uses multi-head self-attention in both encoder and decoder, with positional encodings to inject sequence order information.",
    implications:
      "This work fundamentally changed the landscape of NLP and has led to the development of models like BERT, GPT, and other transformer-based architectures that now dominate the field.",
  };

  const relatedPapers = [
    {
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      authors: "Devlin et al.",
      year: 2018,
    },
    {
      title: "GPT-3: Language Models are Few-Shot Learners",
      authors: "Brown et al.",
      year: 2020,
    },
    {
      title: "Vision Transformer (ViT)",
      authors: "Dosovitskiy et al.",
      year: 2020,
    },
  ];

  const annotations = [
    {
      text: "Key insight about attention mechanism",
      page: 3,
      user: "You",
      time: "1 hour ago",
    },
    {
      text: "Compare with LSTM performance",
      page: 7,
      user: "John D.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate?.("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-[var(--chart-1)] bg-clip-text text-transparent">
                ScholarFlow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paper Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-[var(--chart-1)]/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-500/10 text-green-600">
                          {paper.status}
                        </Badge>
                        <Badge variant="outline">
                          {paper.venue} {paper.year}
                        </Badge>
                      </div>
                      <h1 className="text-2xl font-bold mb-2">{paper.title}</h1>
                      <p className="text-muted-foreground text-sm">
                        {paper.authors.slice(0, 3).join(", ")}
                        {paper.authors.length > 3 &&
                          ` +${paper.authors.length - 3} more`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{paper.pageCount} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{paper.readTime} read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>{paper.citations.toLocaleString()} citations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      <span>{paper.collection}</span>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-base font-semibold mb-2">Abstract</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {paper.abstract}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
                    <Button className="bg-gradient-to-r from-primary to-[var(--chart-1)] text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                    <Button variant="outline">
                      <Highlighter className="h-4 w-4 mr-2" />
                      Add Annotation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-border/50 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-[var(--chart-1)]/20 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg">AI Summary</CardTitle>
                    <Badge className="bg-primary/10 text-primary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Powered by AI
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[var(--chart-1)]" />
                      Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {aiSummary.keyFindings.map((finding, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Methodology</h4>
                    <p className="text-sm text-muted-foreground">
                      {aiSummary.methodology}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Implications</h4>
                    <p className="text-sm text-muted-foreground">
                      {aiSummary.implications}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Annotations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Annotations
                    </CardTitle>
                    <Badge variant="outline">{annotations.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {annotations.map((annotation, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary"
                      >
                        <p className="text-sm font-medium mb-1">
                          {annotation.text}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Page {annotation.page}</span>
                          <span>•</span>
                          <span>{annotation.user}</span>
                          <span>•</span>
                          <span>{annotation.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Papers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Related Papers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedPapers.map((related, index) => (
                      <button
                        key={index}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {related.authors} • {related.year}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Transformer</Badge>
                    <Badge variant="secondary">Attention</Badge>
                    <Badge variant="secondary">NLP</Badge>
                    <Badge variant="secondary">Machine Translation</Badge>
                    <Badge variant="secondary">Deep Learning</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Collaborators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Shared With
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[var(--chart-1)] flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <button className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                      +
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
