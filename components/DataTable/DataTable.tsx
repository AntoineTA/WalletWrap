// Adapted from https://ui.shadcn.com/docs/components/data-table

"use client";

import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { AddRowButton, RemoveRowsButton } from "./ControlButtons";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    metadata: Record<string, any[]>;
    editedRows: EditedRows;
    setEditedRows: (editedRows: EditedRows) => void;
    updateCell: <K extends keyof TData>(
      rowIndex: number,
      columnId: K,
      value: TData[K],
    ) => void;
    saveRow: (rowIndex: number) => void;
    revertRow: (rowIndex: number) => void;
    addRow: () => void;
    removeRow: (rowIndex: number) => void;
    removeRows: (rowsIndices: number[]) => void;
  }
}

type EditedRows = { [key: string]: boolean };

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  metadata: Record<string, any[]>;
  onRowSave: (data: TData) => void;
  onRowDelete: (data: TData[]) => void;
  emptyDataMessage: string;
};

export function DataTable<TData>({
  columns,
  data: _data,
  metadata,
  onRowSave,
  onRowDelete,
  emptyDataMessage = "No data to display",
}: DataTableProps<TData>) {
  const [data, setData] = useState(_data); // store the data currently contained by the table
  const [savedData, setSavedData] = useState(_data); // store the data from before an edit
  const [editedRows, setEditedRows] = useState<EditedRows>({}); // indicates which rows are in edit mode
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    state: {
      columnFilters,
    },
    meta: {
      metadata,
      editedRows,
      setEditedRows,
      updateCell: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      saveRow: async (rowIndex) => {
        const setFunc = (old: TData[]) =>
          old.map((row, index) => (index === rowIndex ? data[rowIndex] : row));
        setData(setFunc);
        setSavedData(setFunc);
        onRowSave(data[rowIndex]);
      },
      revertRow: (rowIndex) => {
        setData(
          (old) =>
            old
              .map((row, index) =>
                index === rowIndex ? savedData[rowIndex] : row,
              )
              .filter((row) => row !== undefined), // remove the undefined values, in case the creation of a row was cancelled.
        );
      },
      addRow: () => {
        setData((old) => {
          setEditedRows({
            ...editedRows, // keep the current editing state
            [data.length]: true, // set the new row to be in edit mode
          });
          return [...old, {} as TData];
        });
      },
      removeRow: (rowIndex) => {
        const setFilterFunc = (old: TData[]) =>
          old.filter((_row: TData, index: number) => index !== rowIndex); // remove the row by applying a filter
        setData(setFilterFunc);
        setSavedData(setFilterFunc);
        onRowDelete([data[rowIndex]]);
      },
      removeRows: (rowsIndices) => {
        const setFilterFunc = (old: TData[]) =>
          old.filter((_row, index) => !rowsIndices.includes(index));
        setData(setFilterFunc);
        setSavedData(setFilterFunc);
        onRowDelete(rowsIndices.map((index) => data[index]));
      },
    },
  });

  const filters = table
    .getAllColumns()
    .map((column) => {
      const filter = column.columnDef.meta?.filter;
      if (filter?.enabled) {
        return {
          name: filter.name,
          columnID: column.id,
        };
      }
    })
    .filter((filter) => filter !== undefined); // remove the undefined values
  const [currentFilter, setCurrentFilter] = useState(filters[0]);

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center py-4">
        {/* Filter Input */}
        {filters.length > 0 && (
          <div className="relative">
            <Input
              value={
                (table
                  .getColumn(currentFilter.columnID)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(currentFilter.columnID)
                  ?.setFilterValue(event.target.value)
              }
              placeholder={
                filters.length == 1
                  ? `Filter ${currentFilter.name.toLowerCase()}`
                  : ""
              }
              className="w-80"
            />
            {filters.length > 1 && (
              <div className="absolute right-0 top-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <span className="mr-2 opacity-60">
                        {currentFilter.name}
                      </span>
                      <Filter
                        className="h-4 w-4 opacity-50"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    {filters.map((filter) => {
                      return (
                        <DropdownMenuItem
                          key={filter.columnID}
                          onClick={() => {
                            console.log(filter);
                            table
                              .getColumn(currentFilter.columnID)
                              ?.setFilterValue(""); //clear the current filter
                            setCurrentFilter(filter);
                          }}
                        >
                          {filter.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
        <AddRowButton table={table} />
        {table.getSelectedRowModel().rows.length > 0 ? (
          <RemoveRowsButton table={table} />
        ) : null}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <pre className="text-xs">{JSON.stringify(data, null, "\t")}</pre> */}
    </div>
  );
}
