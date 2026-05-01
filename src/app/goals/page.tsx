import { redirect } from "next/navigation";

// Goals feature removed — redirect to dashboard
export default function GoalsPage() {
  redirect("/");
}
