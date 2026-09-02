import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role") || "CUSTOMER";

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (data?.session?.user) {
        // Persist the chosen persona in Supabase user metadata
        await supabase.auth.updateUser({
          data: {
            role: role,
            persona: role,
          },
        });
      }
    } catch (e) {
      console.error("Auth callback exchange error:", e);
    }
  }

  // Redirect to the appropriate portal according to the chosen persona
  const targetPath = role === "WORKER" ? "/worker/dashboard" : "/customer/book";
  const redirectUrl = new URL(targetPath, request.url);
  redirectUrl.searchParams.set("login", "success");
  redirectUrl.searchParams.set("role", role);

  return NextResponse.redirect(redirectUrl);
}
