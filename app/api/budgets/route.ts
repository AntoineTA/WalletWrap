import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  const supabase = createClient();

  const { data: budget, error } = await supabase
    .from("budgets")
    .select("*")
    .single(); //we assume a single budget by user for now

  return NextResponse.json({ budget, error });
}
