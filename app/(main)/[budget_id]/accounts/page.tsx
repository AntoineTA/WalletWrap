import { columns } from "./columns";
import { TransactionTable } from "./TransactionTable";

const Accounts = async ({ params }: { params: { budget_id: number } }) => {
  return (
    <div className="container mx-auto py-10">
      <TransactionTable budget_id={params.budget_id} columns={columns} />
    </div>
  );
};
export default Accounts;
