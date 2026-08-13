import { redirect } from "next/navigation";

// Public TipTap template demo was a leftover scaffold — point at the
// real editor entry instead.
export default function Page() {
  redirect("/dashboard/research/editor");
}
