import { type ColumnDef } from "@tanstack/react-table";
import { type Category } from "@/types/category.type";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import DeleteCategoryPopoer from "./modal/delete-category-popoer";
import EditCategoryModal from "./modal/edit-category-modal";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "parent",
    header: "Parent",
    cell: ({ row }) => {
      const category = row.original;
      return <div>{category.parent ? category.parent.name : "None"}</div>;
    },
  },
  {
    accessorKey: "children",
    header: () => <div className="text-center w-full">Children</div>,
    cell: ({ row }) => {
      const category = row.original;
      return <div className="text-center">{category.children.length}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <DeleteCategoryPopoer category={category} />
          <EditCategoryModal category={category} />
        </div>
      );
    },
  },
];
