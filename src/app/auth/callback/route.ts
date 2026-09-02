import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      const { data } = await supabase.auth.exchangeCodeForSession(code);
      const user = data?.session?.user;
      
      // If user has already chosen their role in a previous session, do NOT ask again!
      const existingRole = user?.user_metadata?.role;
      if (existingRole) {
        const dest = existingRole === "WORKER" ? "/worker/dashboard" : "/customer/book";
        const redirectUrl = new URL(dest, request.url);
        redirectUrl.searchParams.set("login", "success");
        return NextResponse.redirect(redirectUrl);
      }
    } catch (e) {
      console.error("Auth callback exchange error:", e);
    }
  }

  // Only brand new users who have never picked a role are asked once to choose
  return NextResponse.redirect(new URL("/auth/select-role", request.url));
}
