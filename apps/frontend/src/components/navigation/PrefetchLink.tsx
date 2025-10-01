"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnchorHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface PrefetchLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  prefetch?: boolean;
  prefetchOnHover?: boolean;
  prefetchOnVisible?: boolean;
  children: React.ReactNode;
}

/**
 * Enhanced Link component with smart prefetching strategies
 * - Hover prefetching: Prefetch when user hovers over link
 * - Visible prefetching: Prefetch when link enters viewport
 * - Touch prefetching: Prefetch on touchstart for mobile
 */
export const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  (
    {
      href,
      prefetch = true,
      prefetchOnHover = true,
      prefetchOnVisible = false,
      children,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const [isPrefetched, setIsPrefetched] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const prefetchTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const doPrefetch = useCallback(() => {
      if (!isPrefetched && href) {
        router.prefetch(href);
        setIsPrefetched(true);
      }
    }, [href, isPrefetched, router]);

    // Hover prefetching with delay
    const handleMouseEnter = useCallback(() => {
      if (prefetchOnHover && !isPrefetched) {
        // Add small delay to avoid prefetching on quick mouse movements
        prefetchTimerRef.current = setTimeout(() => {
          doPrefetch();
        }, 100);
      }
    }, [prefetchOnHover, isPrefetched, doPrefetch]);

    const handleMouseLeave = useCallback(() => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    }, []);

    // Touch prefetching for mobile
    const handleTouchStart = useCallback(() => {
      if (prefetchOnHover && !isPrefetched) {
        doPrefetch();
      }
    }, [prefetchOnHover, isPrefetched, doPrefetch]);

    // Intersection Observer for visible prefetching
    useEffect(() => {
      if (!prefetchOnVisible || isPrefetched) return;

      const element = linkRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              doPrefetch();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: "50px", // Prefetch 50px before entering viewport
        }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [prefetchOnVisible, isPrefetched, doPrefetch]);

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (prefetchTimerRef.current) {
          clearTimeout(prefetchTimerRef.current);
        }
      };
    }, []);

    return (
      <Link
        ref={(node) => {
          // Handle both refs
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          (linkRef as any).current = node;
        }}
        href={href}
        prefetch={prefetch}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

PrefetchLink.displayName = "PrefetchLink";

/**
 * Hook for prefetching routes programmatically
 */
export function usePrefetch() {
  const router = useRouter();
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  const prefetch = useCallback(
    (href: string) => {
      if (!prefetchedRoutes.current.has(href)) {
        router.prefetch(href);
        prefetchedRoutes.current.add(href);
      }
    },
    [router]
  );

  const prefetchMultiple = useCallback(
    (hrefs: string[]) => {
      hrefs.forEach((href) => prefetch(href));
    },
    [prefetch]
  );

  return { prefetch, prefetchMultiple };
}

/**
 * Hook for prefetching based on user behavior patterns
 */
export function useSmartPrefetch(routes: string[], delay: number = 2000) {
  const { prefetchMultiple } = usePrefetch();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Track user interactions
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener("mousemove", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted) return;

    // Prefetch after user has interacted and delay has passed
    const timer = setTimeout(() => {
      prefetchMultiple(routes);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasInteracted, routes, delay, prefetchMultiple]);
}

/**
 * Prefetch navigation routes based on current route
 */
export function usePrefetchNavigation(currentPath: string) {
  const { prefetchMultiple } = usePrefetch();

  useEffect(() => {
    // Define likely next routes based on current path
    const getLikelyRoutes = (path: string): string[] => {
      if (path.includes("/dashboard")) {
        return [
          "/dashboard/papers",
          "/dashboard/collections",
          "/dashboard/papers/upload",
        ];
      }
      if (path.includes("/papers")) {
        return ["/dashboard/papers/search", "/dashboard/collections"];
      }
      if (path === "/") {
        return ["/login", "/register", "/features"];
      }
      return [];
    };

    const routes = getLikelyRoutes(currentPath);
    if (routes.length > 0) {
      // Prefetch after a short delay
      const timer = setTimeout(() => {
        prefetchMultiple(routes);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPath, prefetchMultiple]);
}
