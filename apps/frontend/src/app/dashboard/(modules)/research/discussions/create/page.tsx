import { redirect } from "next/navigation";

export default function CreateDiscussionPage() {
  redirect("/dashboard/discussions/new");
}
