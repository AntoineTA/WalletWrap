import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  const supabase = createClient();

  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .single();

  return NextResponse.json({ settings, error });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  const { error } = await supabase
    .from("settings")
    .update(body)
    .eq("id", body.id);

  return NextResponse.json({ error });
}
