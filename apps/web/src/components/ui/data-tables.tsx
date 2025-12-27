"use client";

import {
  type ColumnDef,
  type ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button, cn } from "@mep/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mep/ui";
import { useState } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pinnedColumns?: {
    left?: string[];
    right?: string[];
  };
  enableSorting?: boolean;
  enableResizing?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  pinnedColumns,
  enableSorting = true,
  enableResizing = true,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinnedColumns?.left ?? [],
    right: pinnedColumns?.right ?? [],
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnPinning,
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    columnResizeMode: enableResizing ? "onChange" : undefined,
  });

  return (
    <div className="relative overflow-auto border rounded-md min-h-[400px]">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const isPinned = header.column.getIsPinned();
                const style = {
                  width: header.getSize(),
                  left:
                    isPinned === "left" ? header.getStart("left") : undefined,
                  right:
                    isPinned === "right"
                      ? header.column.getAfter("right")
                      : undefined,
                };

                return (
                  <TableHead
                    key={header.id}
                    style={style}
                    className={cn(
                      isPinned && "sticky bg-background z-20 shadow-sm",
                    )}
                    onClick={
                      enableSorting
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    {enableResizing && header.column.getCanResize() && (
                      <Button
                        onMouseDown={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const isPinned = cell.column.getIsPinned();
                const style = {
                  width: cell.column.getSize(),
                  left:
                    isPinned === "left"
                      ? cell.column.getStart("left")
                      : undefined,
                  right:
                    isPinned === "right"
                      ? cell.column.getAfter("right")
                      : undefined,
                };

                return (
                  <TableCell
                    key={cell.id}
                    style={style}
                    className={cn(
                      isPinned && "sticky bg-background z-10 shadow-sm",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
