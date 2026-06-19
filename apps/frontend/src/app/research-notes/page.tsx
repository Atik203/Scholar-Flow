"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function ResearchNotesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/notes");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-muted-foreground text-lg"
      >
        Redirecting...
      </motion.p>
    </div>
  );
}
