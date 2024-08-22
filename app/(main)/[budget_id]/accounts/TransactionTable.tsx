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
import AddRowButton from "./AddRowButton";
import { RemoveRowsButton } from "./RemoveRowsButton";
import { createClient } from "@/utils/supabase/client";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editedRows: EditedRows;
    setEditedRows: (editedRows: EditedRows) => void;
    updateCell: (rowIndex: number, columnId: string, value: string) => void;
    saveRow: (rowIndex: number) => void;
    revertRow: (rowIndex: number) => void;
    addRow: () => void;
    removeRow: (rowIndex: number) => void;
    removeSelectedRows: (selectedRows: number[]) => void;
  }
}

type EditedRows = { [key: string]: boolean };

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
};

export function TransactionTable<TData>({
  columns,
  data: _data,
}: DataTableProps<TData>) {
  const [data, setData] = useState(_data); // store the data currently contained by the table
  const [editedRows, setEditedRows] = useState<EditedRows>({}); // indicates which rows are in edit mode
  const [savedData, setSavedData] = useState(_data); // store the data from before an edit
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
      saveRow: (rowIndex) => {
        const setFunc = (old: TData[]) =>
          old.map((row, index) => (index === rowIndex ? data[rowIndex] : row));
        setData(setFunc);
        setSavedData(setFunc);
        // TODO: dispatch the row to supabase
      },
      revertRow: (rowIndex) => {
        setData(
          (old) =>
            old
              .map((row, index) =>
                index === rowIndex ? savedData[rowIndex] : row,
              )
              .filter((row) => row !== undefined), // remove the undefined values (in case the creation of a row was cancelled)
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
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: TData[]) =>
          old.filter((_row: TData, index: number) => index !== rowIndex); // remove the row by applying a filter
        setData(setFilterFunc);
        setSavedData(setFilterFunc);
        //TODO: remove row from database
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: TData[]) =>
          old.filter((_row, index) => !selectedRows.includes(index));
        setData(setFilterFunc);
        setSavedData(setFilterFunc);
        //TODO: remove selected rows from database
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
                  No transactions found
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
