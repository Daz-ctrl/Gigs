import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Determine client-accessible origin (never 0.0.0.0, which browsers reject)
  let host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost:3000";

  if (host.includes("0.0.0.0")) {
    host = host.replace("0.0.0.0", "localhost");
  }

  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  if (code) {
    try {
      const { data } = await supabase.auth.exchangeCodeForSession(code);
      const user = data?.session?.user;

      // If user has already chosen their role in a previous session, route immediately
      const existingRole = user?.user_metadata?.role;
      if (existingRole) {
        const dest = existingRole === "WORKER" ? "/worker/dashboard" : "/customer/book";
        return NextResponse.redirect(`${baseUrl}${dest}?login=success`);
      }
    } catch (e) {
      console.error("Auth callback exchange error:", e);
    }
  }

  // Route brand new accounts to select-role with normalized localhost baseUrl
  return NextResponse.redirect(`${baseUrl}/auth/select-role`);
}
