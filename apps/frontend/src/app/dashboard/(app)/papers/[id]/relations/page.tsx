"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPaperQuery, useListPapersQuery } from "@/redux/api/paperApi";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  GitBranch,
  LinkIcon,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { use } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function HeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function LinkSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export default function PaperRelationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: paper, isLoading } = useGetPaperQuery(id);
  const { data: workspacePapers } = useListPapersQuery(
    { workspaceId: paper?.workspaceId, limit: 10 },
    { skip: !paper?.workspaceId }
  );

  const relatedPapers = (workspacePapers?.items ?? []).filter(
    (p) => p.id !== id
  );
  const sharedTags = paper?.tags?.length
    ? relatedPapers.filter((p) =>
        p.tags?.some((t) => paper.tags?.includes(t))
      )
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12 max-w-4xl">
      {/* Back link */}
      <Link
        href={`/dashboard/papers/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to paper
      </Link>

      {/* Paper Header */}
      <motion.div {...fadeUp}>
        {isLoading ? (
          <HeaderSkeleton />
        ) : (
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{paper?.title}</h1>
            {paper?.abstract && (
              <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {paper?.metadata?.authors?.map((a) => (
                <span key={a} className="text-xs text-muted-foreground">{a}</span>
              ))}
              {paper?.metadata?.year && (
                <span className="text-xs text-muted-foreground">· {paper.metadata.year}</span>
              )}
              {paper?.doi && (
                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-primary hover:underline flex items-center gap-0.5">
                  <ExternalLink className="h-3 w-3" /> DOI
                </a>
              )}
            </div>
            {paper?.tags?.length ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {paper.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Citations */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch className="h-4 w-4" /> Citations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-3">
                  <GitBranch className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">Citation Network</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Visual citation graph coming soon.
                </p>
                {paper?.citationCount ? (
                  <Badge variant="outline" className="mt-2">
                    {paper.citationCount} citations
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Papers */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LinkIcon className="h-4 w-4" /> Related Papers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatedPapers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No related papers in this workspace yet.
                </p>
              ) : (
                <div className="space-y-1">
                  {sharedTags.length > 0 && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pb-2">
                      <Tag className="h-3 w-3" /> Shared tags
                    </p>
                  )}
                  {sharedTags.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/dashboard/papers/${p.id}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group"
                    >
                      <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {p.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(p.metadata?.authors ?? []).slice(0, 2).join(", ") || "Unknown"}{" "}
                          {p.metadata?.year && `· ${p.metadata.year}`}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {relatedPapers.length > sharedTags.length && (
                    <>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 pt-2 pb-2">
                        <BookOpen className="h-3 w-3" /> Same workspace
                      </p>
                      {relatedPapers
                        .filter((p) => !sharedTags.some((st) => st.id === p.id))
                        .slice(0, 4)
                        .map((p) => (
                          <Link
                            key={p.id}
                            href={`/dashboard/papers/${p.id}`}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                {p.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(p.metadata?.authors ?? []).slice(0, 2).join(", ") || "Unknown"}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
