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

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editedRows: EditedRows;
    setEditedRows: (editedRows: EditedRows) => void;
    revertData: (rowIndex: number, revert: boolean) => void;
    updateData: (rowIndex: number, columnId: string, value: string) => void;
  }
}

type EditedRows = { [key: string]: boolean };

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function TransactionTable<TData, TValue>({
  columns,
  data: _data,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(_data); // initialize the table with the data passed in the prop
  const [editedRows, setEditedRows] = useState<EditedRows>({}); // indicates which rows are in edit mode
  const [originalData, setOriginalData] = useState(_data); // store the data from before an edit
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row,
            ),
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) =>
              index === rowIndex ? data[rowIndex] : row,
            ),
          );
        }
      },
      updateData: (rowIndex, columnId, value) => {
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
