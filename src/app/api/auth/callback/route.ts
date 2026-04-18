import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isUniversityEmail } from "@/lib/validators/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing_code`);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  if (!isUniversityEmail(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/signup?error=not_edu_vn`);
  }

  await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name ?? null,
      is_verified: true,
    },
    { onConflict: "id" }
  );

  return NextResponse.redirect(`${origin}${next}`);
}
