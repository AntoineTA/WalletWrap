import { ErrorAlert, type Error } from "@/components/ui/error-alert";
import { columns } from "./columns";
import {
  getAccounts,
  getTransactions,
  upsertTransaction,
  deleteTransactions,
} from "./actions";
import { DataTable } from "@/components/DataTable/DataTable";

export type Transaction = {
  id: number;
  account_id: number;
  date: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
};

const AllAccounts = async ({ params }: { params: { budget_id: number } }) => {
  const { transactions, error: transactionError } = await getTransactions(
    params.budget_id,
  );
  const { accounts, error: accountError } = await getAccounts(params.budget_id);

  if (transactionError || accountError) {
    return (
      <ErrorAlert
        title="Something went wrong"
        message="We could not load your data."
      />
    );
  }

  const metadata = {
    accounts: accounts.map((account) => ({
      id: account.id,
      name: account.name,
    })),
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable<Transaction>
        columns={columns}
        data={transactions}
        metadata={metadata}
        onRowSave={upsertTransaction}
        onRowDelete={deleteTransactions}
        emptyDataMessage="No transactions found"
      />
    </div>
  );
};
export default AllAccounts;
