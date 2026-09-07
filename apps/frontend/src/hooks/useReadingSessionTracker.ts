"use client";

/**
 * Tracks time spent on a paper page as a reading session.
 *
 * Starts a reading_session UsageEvent when `paperId` becomes available and
 * closes it on unmount or tab-switch-away with minutes read as units; a
 * tab switch back starts a fresh session so elapsed time accumulates
 * correctly per active interval.
 */

import { useEffect, useRef } from "react";
import {
  useStartReadingSessionMutation,
  useStopReadingSessionMutation,
} from "@/redux/api/analyticsApi";

const MAX_SESSION_MINUTES = 180;

export function useReadingSessionTracker(paperId?: string | null) {
  const [startSession] = useStartReadingSessionMutation();
  const [stopSession] = useStopReadingSessionMutation();
  const sessionRef = useRef<{ eventId: string; startedAt: number } | null>(null);
  const paperRef = useRef<string | null>(null);

  useEffect(() => {
    if (!paperId) return;

    // Same paper re-mount (tab switch back) continues the session; a
    // different paper ends the previous one first.
    const endCurrent = () => {
      const session = sessionRef.current;
      sessionRef.current = null;
      if (!session) return;
      const minutes = Math.min(
        MAX_SESSION_MINUTES,
        Math.max(1, Math.round((Date.now() - session.startedAt) / 60000))
      );
      stopSession({ eventId: session.eventId, units: minutes }).catch(() => undefined);
    };

    if (paperRef.current && paperRef.current !== paperId) endCurrent();
    paperRef.current = paperId;

    let sessionStarted = false;
    const maybeStart = () => {
      if (sessionStarted || document.visibilityState === "hidden") return;
      sessionStarted = true;
      startSession({ paperId }).unwrap().then((res) => {
        const eventId = (res as { data?: { id?: string } })?.data?.id;
        if (eventId) sessionRef.current = { eventId, startedAt: Date.now() };
      }).catch(() => undefined);
    };

    maybeStart();

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        endCurrent();
        sessionStarted = false;
      } else {
        maybeStart();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (sessionStarted) endCurrent();
      sessionStarted = false;
    };
  }, [paperId, startSession, stopSession]);
}