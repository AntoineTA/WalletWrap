import {
  SelectCell,
  type SelectCellProps,
} from "@/components/DataTable/SelectCell";
import {
  TableCell,
  type TableCellProps,
} from "@/components/DataTable/TableCell";
import type { Transaction } from "./page";

type AccountCellProps = Omit<SelectCellProps<Transaction>, "options">;
const AccountCell = ({ table, ...props }: AccountCellProps) => {
  const options: { id: number; label: string }[] =
    table.options.meta!.metadata.accounts;
  return <SelectCell table={table} options={options} {...props} />;
};
export { AccountCell };

type DateCellProps = Omit<TableCellProps<Transaction>, "formatter">;
const DateCell = (props: DateCellProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return <TableCell {...props} formatter={formatDate} />;
};
export { DateCell };
