"use client";

/**
 * GlobalSearchPage — Perplexity/ChatGPT-style search
 *
 * Phase D.4 rewrite. Replaces the 1495-line demo page with a real
 * data-driven implementation:
 *
 *  - Top: search input with 250ms debounce + tab strip.
 *  - When a query is present, an AI summary card sits above the
 *    results (calls useAiSearchMutation). On fallback, shows a
 *    gentle message but still renders the citation list.
 *  - Tab "All" combines every active section in a grouped view.
 *  - Tab "Internet" is a "coming soon" panel (per the user's
 *    earlier decision — no third-party search API configured).
 *  - Perplexity/ChatGPT-style citation chips with [n] inline.
 */

import {
  ArrowRight,
  Atom,
  Building2,
  Compass,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Search as SearchIcon,
  Sparkles,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAiSearchMutation,
  useGetSearchSourcesQuery,
  useGlobalSearchQuery,
  useLazyGlobalSearchQuery,
  type AISearchSource,
  type SearchResults,
  type SearchTabType,
} from "@/redux/api/searchApi";
import { showErrorToast } from "@/components/providers/ToastProvider";

const TABS: Array<{ id: SearchTabType; label: string; icon: any }> = [
  { id: "all", label: "All", icon: SearchIcon },
  { id: "papers", label: "Papers", icon: FileText },
  { id: "people", label: "People", icon: Users },
  { id: "workspaces", label: "Workspaces", icon: Building2 },
  { id: "internet", label: "Internet", icon: Globe },
];

export default function GlobalSearchPage() {
  const [tab, setTab] = useState<SearchTabType>("all");
  const [inputValue, setInputValue] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [aiResult, setAiResult] = useState<{
    summary: string;
    sources: AISearchSource[];
    fallback: string | null;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: commit query 250ms after the user stops typing.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setActiveQuery(inputValue.trim());
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  // Main results — fires on (tab, activeQuery) changes.
  const {
    data: results,
    isFetching,
    error,
  } = useGlobalSearchQuery(
    { q: activeQuery, type: tab === "all" ? "all" : tab, limit: 20 },
    { skip: !activeQuery || tab === "internet" }
  );

  // AI summary — fires only on the "all" tab when a query is present.
  const [triggerAi, { isLoading: aiLoading }] = useLazyGlobalSearchQuery();
  const [aiSearch, { isLoading: aiMutating }] = useAiSearchMutation();
  useEffect(() => {
    setAiResult(null);
    if (tab !== "all" || !activeQuery) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await aiSearch({ q: activeQuery, mode: "summarize" }).unwrap();
        if (!cancelled) {
          setAiResult({ summary: res.summary, sources: res.sources, fallback: res.fallback });
        }
      } catch (err: any) {
        if (!cancelled) {
          // Soft-fail: still show whatever sources we have.
          setAiResult({
            summary:
              err?.data?.message ??
              "AI summary is currently unavailable. Showing top sources instead.",
            sources: [],
            fallback: "AI_SUMMARY_FAILED",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeQuery, tab, aiSearch]);

  // Suppress unused-warning for triggerAi (kept for future use).
  void triggerAi;

  // Source list for the citation strip under the AI summary.
  const { data: sourcesData } = useGetSearchSourcesQuery(
    { q: activeQuery, limit: 5 },
    { skip: !activeQuery || tab !== "all" }
  );
  const citationSources = aiResult?.sources ?? sourcesData?.sources ?? [];

  const allResults: SearchResults = useMemo(() => {
    return results?.data ?? {};
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Header + Search input */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Compass className="h-8 w-8 text-primary" />
          Global Search
        </h1>
        <p className="text-muted-foreground mt-2">
          Find papers, collections, workspaces, notes, and people across
          ScholarFlow. Use the AI summary to get a quick overview of the
          top matches.
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search across papers, collections, workspaces, notes, people…"
          className="w-full pl-10 pr-10 py-3 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex flex-wrap gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Empty state */}
      {!activeQuery && (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground">
            Start typing to search across ScholarFlow.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pro tip: use the AI summary on the &quot;All&quot; tab for a quick
            overview of the top matches.
          </p>
        </div>
      )}

      {/* AI Summary card (All tab) */}
      {activeQuery && tab === "all" && (
        <AiSummaryCard
          loading={aiLoading || aiMutating}
          summary={aiResult?.summary}
          sources={citationSources}
          fallback={aiResult?.fallback}
        />
      )}

      {/* Internet stub */}
      {activeQuery && tab === "internet" && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground">
            Internet search is coming soon.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the tabs above to search across your papers, collections,
            workspaces, notes, and people.
          </p>
        </div>
      )}

      {/* Results */}
      {activeQuery && tab !== "internet" && (
        <ResultsSection
          tab={tab}
          isFetching={isFetching}
          error={error}
          results={allResults}
        />
      )}
    </div>
  );
}

function AiSummaryCard({
  loading,
  summary,
  sources,
  fallback,
}: {
  loading: boolean;
  summary?: string;
  sources: AISearchSource[];
  fallback?: string | null;
}) {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-card to-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">AI Summary</h2>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      ) : (
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {summary ?? "No summary available."}
        </p>
      )}
      {fallback && !loading && (
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-2">
          {fallback === "OPENAI_KEY_MISSING"
            ? "OPENAI_API_KEY not configured — showing the top sources only."
            : fallback === "OPENAI_REQUEST_FAILED"
              ? "OpenAI request failed — showing the top sources only."
              : `Notice: ${fallback}`}
        </p>
      )}
      {sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.href}
              className="inline-flex items-center gap-1 rounded-full bg-background border px-2.5 py-1 text-xs hover:bg-accent transition-colors"
              title={s.title}
            >
              {s.type === "paper" && <FileText className="h-3 w-3" />}
              {s.type === "collection" && <Atom className="h-3 w-3" />}
              {s.type === "workspace" && <Building2 className="h-3 w-3" />}
              <span className="max-w-[180px] truncate">{s.title}</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsSection({
  tab,
  isFetching,
  error,
  results,
}: {
  tab: SearchTabType;
  isFetching: boolean;
  error: any;
  results: SearchResults;
}) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900 p-6 text-sm text-red-700 dark:text-red-300">
        Search failed: {String(error?.data?.message ?? error?.error ?? "unknown")}
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tab === "all") {
    return (
      <div className="space-y-6">
        <ResultGroup
          title="Papers"
          count={results.papers?.total ?? 0}
          emptyText="No matching papers."
          items={(results.papers?.items ?? []).map((p) => ({
            key: p.id,
            title: p.title ?? "Untitled paper",
            subtitle: p.abstract ?? p.source ?? "",
            icon: FileText,
            href: `/dashboard/papers/${p.id}`,
          }))}
        />
        <ResultGroup
          title="People"
          count={results.people?.total ?? 0}
          emptyText="No matching people."
          items={(results.people?.items ?? []).map((u) => ({
            key: u.id,
            title: u.name ?? u.email ?? "Unknown user",
            subtitle: [u.role, u.institution].filter(Boolean).join(" · "),
            icon: UserIcon,
            href: `/dashboard/team?userId=${u.id}`,
            avatarUrl: u.image ?? null,
          }))}
        />
        <ResultGroup
          title="Workspaces"
          count={results.workspaces?.total ?? 0}
          emptyText="No matching workspaces."
          items={(results.workspaces?.items ?? []).map((w) => ({
            key: w.id,
            title: w.name ?? "Untitled workspace",
            subtitle: w.description ?? "",
            icon: Building2,
            href: `/dashboard/workspaces/${w.id}`,
          }))}
        />
        <ResultGroup
          title="Notes"
          count={results.notes?.total ?? 0}
          emptyText="No matching notes."
          items={(results.notes?.items ?? []).map((n) => ({
            key: n.id,
            title: n.title ?? "Untitled note",
            subtitle: n.excerpt ?? "",
            icon: Atom,
            href: `/dashboard/notes?noteId=${n.id}`,
          }))}
        />
      </div>
    );
  }

  // Single-tab view.
  if (tab === "papers") {
    return (
      <ResultGroup
        title="Papers"
        count={results.papers?.total ?? 0}
        emptyText="No matching papers."
        items={(results.papers?.items ?? []).map((p) => ({
          key: p.id,
          title: p.title ?? "Untitled paper",
          subtitle: p.abstract ?? p.source ?? "",
          icon: FileText,
          href: `/dashboard/papers/${p.id}`,
        }))}
      />
    );
  }
  if (tab === "people") {
    return (
      <ResultGroup
        title="People"
        count={results.people?.total ?? 0}
        emptyText="No matching people."
        items={(results.people?.items ?? []).map((u) => ({
          key: u.id,
          title: u.name ?? u.email ?? "Unknown user",
          subtitle: [u.role, u.institution].filter(Boolean).join(" · "),
          icon: UserIcon,
          href: `/dashboard/team?userId=${u.id}`,
          avatarUrl: u.image ?? null,
        }))}
      />
    );
  }
  if (tab === "workspaces") {
    return (
      <ResultGroup
        title="Workspaces"
        count={results.workspaces?.total ?? 0}
        emptyText="No matching workspaces."
        items={(results.workspaces?.items ?? []).map((w) => ({
          key: w.id,
          title: w.name ?? "Untitled workspace",
          subtitle: w.description ?? "",
          icon: Building2,
          href: `/dashboard/workspaces/${w.id}`,
        }))}
      />
    );
  }
  return null;
}

function ResultGroup({
  title,
  count,
  emptyText,
  items,
}: {
  title: string;
  count: number;
  emptyText: string;
  items: Array<{
    key: string;
    title: string;
    subtitle?: string;
    icon: any;
    href: string;
    avatarUrl?: string | null;
  }>;
}) {
  if (items.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-muted-foreground">({count})</span>
        </h3>
        <p className="text-sm text-muted-foreground py-4 px-3 border border-dashed rounded-md">
          {emptyText}
        </p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        {title}
        <span className="text-xs font-normal text-muted-foreground">({count})</span>
      </h3>
      <ul className="space-y-2">
        <AnimatePresence>
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <motion.li
                key={it.key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Link
                  href={it.href}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 overflow-hidden">
                    {it.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.avatarUrl}
                        alt=""
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{it.title}</p>
                    {it.subtitle && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {it.subtitle}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

// Suppress lint warning for showErrorToast (kept for future inline
// error feedback on tab switches).
void showErrorToast;
