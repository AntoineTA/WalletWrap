import { DataTable } from "@/components/ui/data-table";
import { columns, type TableRow } from "./columns";
import { ErrorAlert, type Error } from "@/components/ui/error-alert";

import { createClient } from "@/utils/supabase/server";

const getData = async (
  budget_id: number,
): Promise<{ data?: TableRow[]; error?: Error }> => {
  const supabase = createClient();

  // fetch all transactions for all accounts in the given budget
  const { data: rawData, error } = await supabase
    .from("Accounts")
    .select("name, Transactions (date, amount, is_inflow, note)")
    .eq("budget_id", budget_id);

  if (error) {
    return {
      error: {
        title: "Something went wrong",
        message: error.message,
      },
    };
  }

  const data = rawData.flatMap((account) => {
    return account.Transactions.map((transaction) => ({
      date: transaction.date,
      account: account.name,
      outflow: transaction.is_inflow ? null : transaction.amount,
      inflow: transaction.is_inflow ? transaction.amount : null,
      note: transaction.note,
    }));
  });

  return { data };
};

const AllAccounts = async ({ params }: { params: { budget_id: number } }) => {
  const { data, error } = await getData(params.budget_id);

  return (
    <div className="container mx-auto py-10">
      {data && <DataTable columns={columns} data={data} />}
      {error && <ErrorAlert {...error} />}
    </div>
  );
};
export default AllAccounts;
