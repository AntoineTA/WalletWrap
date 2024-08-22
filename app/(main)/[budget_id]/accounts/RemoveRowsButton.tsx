import { Button } from "@/components/ui/button";

const RemoveRowsButton = ({ table }: any) => {
  const meta = table.options.meta;

  const removeRows = () => {
    meta.removeSelectedRows(
      table.getSelectedRowModel().rows.map((row: any) => row.index),
    );
    table.resetRowSelection();
  };

  return (
    <Button onClick={removeRows} variant="destructive">
      Remove Selected
    </Button>
  );
};
export { RemoveRowsButton };
