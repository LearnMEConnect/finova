import { redirect } from "next/navigation";

// Transactions are now inline on the dashboard — redirect
export default function TransactionsPage() {
  redirect("/");
}
