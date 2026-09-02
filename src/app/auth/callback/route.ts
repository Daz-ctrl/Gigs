import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      console.error("Auth callback exchange error:", e);
    }
  }

  // After authenticating with Google, route to persona selection
  return NextResponse.redirect(new URL("/auth/select-role", request.url));
}
