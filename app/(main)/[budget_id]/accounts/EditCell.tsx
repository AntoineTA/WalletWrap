import { Button } from "@/components/ui/button";
import { Minus, Check, Pencil, Trash2 } from "lucide-react";

const EditCell = ({ row, table }: any) => {
  const meta = table.options.meta;

  const changeEditStatus = () => {
    meta.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
  };

  // "Cancel" and "Save" actions only shows for rows whose id is map to true in editedRows
  return (
    <div>
      {meta.editedRows[row.id] ? (
        <div>
          <Button
            onClick={() => {
              meta.revertRow(row.index);
              changeEditStatus();
            }}
            variant="ghost"
            size="icon"
            name="cancel"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              meta.saveRow(row.index);
              changeEditStatus();
            }}
            variant="ghost"
            size="icon"
            name="save"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <Button
            onClick={changeEditStatus}
            variant="ghost"
            size="icon"
            name="edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => meta?.removeRow(row.index)}
            variant="ghost"
            size="icon"
            name="remove"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  );
};
export { EditCell };
