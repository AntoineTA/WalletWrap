import { Button } from "@/components/ui/button";
import { X, Check, Pencil } from "lucide-react";
import type { MouseEvent } from "react";

const EditCell = ({ row, table }: any) => {
  const meta = table.options.meta;

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== "edit") {
      meta?.revertData(row.index, elName === "cancel");
    }
  };

  // "Cancel" and "Save" actions only shows for rows whose id is map to true in editedRows
  return meta?.editedRows[row.id] ? (
    <>
      <Button onClick={setEditedRows} variant="ghost" size="icon" name="cancel">
        <X className="h-4 w-4" />
      </Button>
      <Button onClick={setEditedRows} variant="ghost" size="icon" name="done">
        <Check className="h-4 w-4" />
      </Button>
    </>
  ) : (
    <Button onClick={setEditedRows} variant="ghost" size="icon" name="edit">
      <Pencil className="h-4 w-4" />
    </Button>
  );
};
export { EditCell };
