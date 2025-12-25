"use client";

import { useState, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@mep/ui";
import { ChevronsLeftRight } from "lucide-react";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pinnedColumns?: {
    left?: string[];
    right?: string[];
  };
}

export function Table<T>({ data, columns, pinnedColumns }: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="min-h-[400px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-md w-full">
      <table className="w-full table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="h-10">
              {headerGroup.headers.map((header) => {
                const isPinnedLeft = pinnedColumns?.left?.includes(header.id);
                const isPinnedRight = pinnedColumns?.right?.includes(header.id);

                let leftOffset = 0;
                if (isPinnedLeft && pinnedColumns?.left) {
                  const pinnedIndex = pinnedColumns.left.indexOf(header.id);
                  for (let i = 0; i < pinnedIndex; i++) {
                    const prevColumn = table.getColumn(pinnedColumns.left[i]);
                    if (prevColumn) {
                      leftOffset += prevColumn.getSize();
                    }
                  }
                }

                let rightOffset = 0;
                if (isPinnedRight && pinnedColumns?.right) {
                  const pinnedIndex = pinnedColumns.right.indexOf(header.id);
                  for (
                    let i = pinnedIndex + 1;
                    i < pinnedColumns.right.length;
                    i++
                  ) {
                    const nextColumn = table.getColumn(pinnedColumns.right[i]);
                    if (nextColumn) {
                      rightOffset += nextColumn.getSize();
                    }
                  }
                }

                return (
                  <th
                    key={header.id}
                    className={`
                      border border-gray-200 dark:border-gray-700 px-2 py-1 text-left
                      ${isPinnedLeft ? "sticky bg-gray-50 dark:bg-gray-800 z-20" : ""}
                      ${isPinnedRight ? "sticky bg-gray-50 dark:bg-gray-800 z-20" : ""}
                      overflow-hidden whitespace-nowrap
                    `}
                    style={{
                      width: header.getSize(),
                      ...(isPinnedLeft && { left: `${leftOffset}px` }),
                      ...(isPinnedRight && { right: `${rightOffset}px` }),
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.getCanResize() && (
                        <Button
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="w-1 h-full cursor-col-resize z-10 bg-transparent hover:bg-gray-500"
                          size="icon"
                          variant="ghost"
                        >
                          <ChevronsLeftRight
                            size={16}
                            className="text-gray-500"
                          />
                        </Button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-accent/20 h-10 bg-white dark:bg-gray-900"
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as
                  | { className?: string }
                  | undefined;
                const metaClass = meta?.className ?? "";

                const isPinnedLeft = pinnedColumns?.left?.includes(
                  cell.column.id,
                );
                const isPinnedRight = pinnedColumns?.right?.includes(
                  cell.column.id,
                );

                let leftOffset = 0;
                if (isPinnedLeft && pinnedColumns?.left) {
                  const pinnedIndex = pinnedColumns.left.indexOf(
                    cell.column.id,
                  );
                  for (let i = 0; i < pinnedIndex; i++) {
                    const prevColumn = table.getColumn(pinnedColumns.left[i]);
                    if (prevColumn) {
                      leftOffset += prevColumn.getSize();
                    }
                  }
                }

                let rightOffset = 0;
                if (isPinnedRight && pinnedColumns?.right) {
                  const pinnedIndex = pinnedColumns.right.indexOf(
                    cell.column.id,
                  );
                  for (
                    let i = pinnedIndex + 1;
                    i < pinnedColumns.right.length;
                    i++
                  ) {
                    const nextColumn = table.getColumn(pinnedColumns.right[i]);
                    if (nextColumn) {
                      rightOffset += nextColumn.getSize();
                    }
                  }
                }

                return (
                  <td
                    key={cell.id}
                    className={`
                      border border-gray-200 dark:border-gray-700 px-2 py-1 overflow-hidden text-ellipsis
                      ${isPinnedLeft ? "sticky bg-white dark:bg-gray-900 z-10" : ""}
                      ${isPinnedRight ? "sticky bg-white dark:bg-gray-900 z-10" : ""}
                      ${metaClass}
                    `}
                    style={{
                      ...(isPinnedLeft && { left: `${leftOffset}px` }),
                      ...(isPinnedRight && { right: `${rightOffset}px` }),
                    }}
                  >
                    {
                      flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      ) as ReactNode
                    }
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
