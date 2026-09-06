import { redirect } from "next/navigation";

// Legacy duplicate of /dashboard/research/editor — keep the canonical path.
export default function TextEditorPage() {
  redirect("/dashboard/research/editor");
}
