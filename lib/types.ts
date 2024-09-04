import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editingIndex: number | null;
    setEditingIndex: (index: number | null) => void;
    addRow: () => void;
    updateCell: (
      rowIndex: number,
      columnId: string,
      value: string | number,
    ) => void;
    revertChanges: () => void;
    saveRow: (rowIndex: number) => void;
    removeRow: (rowIndex: number) => void;
    removeRows?: (rowIndices: number[]) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    type?: string;
  }
}
