import { TransactionTable } from "../TransactionTable";
import { columns, type Transaction } from "../columns";
import { ErrorAlert, type Error } from "@/components/ui/error-alert";

import { createClient } from "@/utils/supabase/server";

const getData = async (
  account_id: number,
): Promise<{ data?: Transaction[]; error?: Error }> => {
  const supabase = createClient();

  // fetch all transactions for the given account
  const { data: rawData, error } = await supabase
    .from("Accounts")
    .select("Transactions (date, amount, is_inflow, note)")
    .eq("Transactions.account_id", account_id);

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
      outflow: transaction.is_inflow ? null : transaction.amount,
      inflow: transaction.is_inflow ? transaction.amount : null,
      note: transaction.note,
    }));
  });

  return { data };
};

const Account = async ({
  params,
}: {
  params: { budget_id: number; account_id: number };
}) => {
  const { data, error } = await getData(params.account_id);

  return (
    <div className="container mx-auto py-10">
      {data && <TransactionTable columns={columns} data={data} />}
      {error && <ErrorAlert {...error} />}
    </div>
  );
};
export default Account;
