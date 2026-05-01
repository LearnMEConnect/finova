import { redirect } from "next/navigation";

// Portfolio is now inline on the dashboard — redirect
export default function PortfolioPage() {
  redirect("/");
}
