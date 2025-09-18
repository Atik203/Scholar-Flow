"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Heart,
  MessageCircle,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CommunityPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                Research Community
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Connect with researchers worldwide
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Join thousands of researchers, share knowledge, get help, and
                collaborate on cutting-edge research projects.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="gradient"
                  className="btn-hover-glow btn-shine text-base"
                >
                  <Link
                    href="#join-community"
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Join Community
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base"
                >
                  <Link href="#discussions" className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Browse Discussions
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Discussion Forums
                      </h3>
                      <p className="text-muted-foreground">
                        Ask questions, share insights, and learn from experts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <Zap className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Research Collaboration
                      </h3>
                      <p className="text-muted-foreground">
                        Find collaborators and join research projects.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <Star className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Expert Recognition
                      </h3>
                      <p className="text-muted-foreground">
                        Earn reputation points and become a community leader.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join a thriving research community
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with researchers from top institutions around the world
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Researchers", icon: Users },
              { number: "2.5M+", label: "Papers Shared", icon: BookOpen },
              { number: "25K+", label: "Discussions", icon: MessageCircle },
              { number: "180+", label: "Countries", icon: Heart },
            ].map(({ number, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {number}
                </div>
                <div className="text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Features */}
        <section id="join-community" className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How our community helps you succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get support, share knowledge, and accelerate your research journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Q&A Forums",
                description:
                  "Get help from experts, troubleshoot issues, and share best practices with the community.",
                color: "primary",
              },
              {
                icon: Users,
                title: "Research Groups",
                description:
                  "Join discipline-specific groups, find collaborators, and participate in joint research projects.",
                color: "chart-1",
              },
              {
                icon: BookOpen,
                title: "Paper Discussions",
                description:
                  "Discuss recent papers, share insights, and get feedback on your research findings.",
                color: "chart-2",
              },
              {
                icon: Zap,
                title: "Feature Requests",
                description:
                  "Suggest new features, vote on roadmap items, and help shape ScholarFlow's future.",
                color: "chart-3",
              },
              {
                icon: Star,
                title: "Expert Recognition",
                description:
                  "Build your reputation, earn badges, and become a recognized expert in your field.",
                color: "chart-4",
              },
              {
                icon: Heart,
                title: "Mentorship Program",
                description:
                  "Connect with experienced researchers or mentor newcomers to the field.",
                color: "chart-5",
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="hover-lift group cursor-pointer">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                  >
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Discussions */}
        <section
          id="discussions"
          className="py-16 md:py-24 bg-muted/30 rounded-2xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recent community discussions
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the conversation on trending research topics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Best practices for literature review automation",
                author: "Dr. Sarah Chen",
                replies: 23,
                views: "1.2k",
                timeAgo: "2 hours ago",
                tags: ["AI", "Literature Review", "Automation"],
              },
              {
                title: "How to organize papers for meta-analysis studies?",
                author: "Prof. Michael Rodriguez",
                replies: 18,
                views: "856",
                timeAgo: "5 hours ago",
                tags: ["Meta-analysis", "Organization", "Statistics"],
              },
              {
                title: "Collaborative research workflows in remote teams",
                author: "Dr. Emily Johnson",
                replies: 31,
                views: "2.1k",
                timeAgo: "1 day ago",
                tags: ["Collaboration", "Remote Work", "Productivity"],
              },
              {
                title: "Citation management for large research projects",
                author: "Alex Kim",
                replies: 15,
                views: "742",
                timeAgo: "2 days ago",
                tags: ["Citations", "Project Management", "Tools"],
              },
            ].map(({ title, author, replies, views, timeAgo, tags }) => (
              <Card
                key={title}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                    {title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>By {author}</span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{replies} replies</span>
                    <span>{views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to join our research community?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with like-minded researchers and accelerate your
              discoveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="btn-hover-glow btn-shine text-base"
              >
                <Link
                  href={isAuthenticated ? "/community/join" : "/login"}
                  className="flex items-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  {isAuthenticated ? "Join Discussions" : "Sign Up to Join"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link
                  href="/resources/tutorials"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Community Guidelines
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
