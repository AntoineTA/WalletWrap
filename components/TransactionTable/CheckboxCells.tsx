import { Checkbox } from "@/components/ui/checkbox";
import type { Transaction } from "./TransactionTable";
import type { Row, Table } from "@tanstack/react-table";

export const HeaderCheckboxCell = ({
  table,
}: {
  table: Table<Transaction>;
}) => {
  return (
    <div className="flex justify-center w-4">
      <Checkbox
        // className="align-middle justify-self-center"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
};

export const CheckboxCell = ({ row }: { row: Row<Transaction> }) => {
  return (
    <div className="flex justify-center w-4">
      <Checkbox
        // className="align-middle justify-center"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
};
