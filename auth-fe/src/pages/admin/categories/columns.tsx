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
    header: "Children",
    cell: ({ row }) => {
      const category = row.original;
      return <div>{category.children.length}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="icon" onClick={() => {}}>
            <Pencil className="h-4 w-4" />
          </Button>
            <Popover>
              <PopoverTrigger>
                <Button variant="destructive" size="icon">
                    <Trash className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div>
                    <h1>Are you sure you want to delete this category?</h1>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="destructive" size="icon" className="w-max px-2 py-1" onClick={() => {}}>
                            Delete
                        </Button>
                        <PopoverClose className="PopoverClose">
                            <Button variant="outline" size="icon" className="w-max px-2 py-1">
                                Cancel
                            </Button>
                        </PopoverClose>
                    </div>
                </div>
              </PopoverContent>
            </Popover>
        </div>
      );
    },
  },
];
