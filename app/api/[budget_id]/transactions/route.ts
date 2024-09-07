import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { budget_id: number } },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("id, transactions (*)")
    .eq("budget_id", params.budget_id);

  // extract the transaction property from the array of items
  const transactions = data
    ? data.map((item) => item.transactions).flat()
    : null;

  return NextResponse.json({ transactions, error });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  const { data: upserted, error } = await supabase
    .from("transactions")
    .upsert({ ...body }, { onConflict: "id", ignoreDuplicates: false })
    .select();

  return NextResponse.json({ upserted, error });
}

export async function DELETE(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", body.id);

  return NextResponse.json({ error });
}
