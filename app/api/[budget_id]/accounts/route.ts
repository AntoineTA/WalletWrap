import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { budget_id: number } },
) {
  const supabase = createClient();

  const { data: accounts, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("budget_id", params.budget_id);

  return NextResponse.json({ accounts, error });
}

export async function POST(
  request: Request,
  { params }: { params: { budget_id: number } },
) {
  const supabase = createClient();
  const body = await request.json();

  const { error } = await supabase
    .from("accounts")
    .insert({ ...body, budget_id: params.budget_id });

  return NextResponse.json({ error });
}
