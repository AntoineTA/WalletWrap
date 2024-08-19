import { createClient } from "@/utils/supabase/server";
import { columns, Transaction } from "./columns";
import { DataTable } from "./DataTable";

const getData = async (): Promise<Transaction[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("Transactions").select();

  if (error) {
    throw error;
  }

  const transactions = data.map((row) => ({
    date: row.date,
    amount: row.amount,
    note: row.note,
    isInflow: row.is_inflow,
  }));

  return transactions;
};

const Accounts = async () => {
  const transactions = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};
export default Accounts;
