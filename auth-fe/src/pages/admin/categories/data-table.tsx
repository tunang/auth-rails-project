import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationInfo, PerPageSelector } from "@/components/ui/pagination";
import CreateCategoryModal from "./modal/create-category-modal";
import type { Pagination as PaginationType } from "@/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  header: string;
  pagination: PaginationType;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  header,
  pagination,
  perPage,
  onPageChange,
  onPerPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-none border">
      <div className="flex justify-between items-center border-b border-gray-200 gap-4">
        <h1 className="text-2xl font-bold">{header}</h1>
        <div className="flex gap-2">
          <CreateCategoryModal />
          <Button>
            <Trash2 /> Recycle Bin
          </Button>
        </div>
      </div>

      <div className="p-4 flex justify-between">
        <div className="flex gap-2">
          <Input placeholder="Search" />
          <Button>
            <Search /> Search
          </Button>
        </div>

        <div className="flex gap-2">
          <Filter /> 
        </div>
      </div>

      <Table className="border-t-1">
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
                          header.getContext()
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination Section */}
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="flex items-center space-x-4">
          <PaginationInfo
            currentPage={pagination.current_page}
            totalCount={pagination.total_count}
            perPage={perPage}
          />
          <PerPageSelector
            perPage={perPage}
            onPerPageChange={onPerPageChange}
          />
        </div>
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
