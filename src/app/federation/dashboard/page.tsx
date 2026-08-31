import { redirect } from "next/navigation";

export default function FederationRedirect() {
  redirect("/admin/dashboard");
}
