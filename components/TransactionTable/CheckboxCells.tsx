import { Checkbox } from "@/components/ui/checkbox";
import type { Row, Table } from "@tanstack/react-table";
import type { Transaction } from "@/hooks/useTransactions";

export const HeaderCheckboxCell = ({
  table,
}: {
  table: Table<Transaction>;
}) => {
  return (
    <div className="flex justify-center w-4">
      <Checkbox
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
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
};
