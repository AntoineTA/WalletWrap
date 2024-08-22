import { Button } from "@/components/ui/button";

const AddRowButton = ({ table }: any) => {
  const meta = table.options.meta;

  return (
    <Button onClick={meta?.addRow} variant="secondary">
      Add Row
    </Button>
  );
};
export default AddRowButton;
