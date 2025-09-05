import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { Trash } from "lucide-react";
import { PopoverContent } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import type { Category } from "@/types/category.type";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createCategoryRequest, deleteCategoryRequest, updateCategoryRequest } from "@/store/slices/categorySlice";
import type { CategoryRequest } from "@/schemas/category.schema";

const DeleteCategoryPopoer = ({ category }: { category: Category }) => {
  const dispatch = useAppDispatch();
  const onDelete = () => {
    dispatch(deleteCategoryRequest(category.id));
  };

  const onSubmit = async (data: CategoryRequest) => {
    dispatch(updateCategoryRequest(data));
  };
  return (
    <div className="flex gap-2 justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="destructive" size="icon" className="w-max px-2 py-1">
            <Trash className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <h1>Are you sure you want to delete this category?</h1>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="destructive"
                size="icon"
                className="w-max px-2 py-1"
                onClick={onDelete}
              >
                Delete
              </Button>
              <PopoverClose className="PopoverClose">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-max px-2 py-1"
                >
                  Cancel
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DeleteCategoryPopoer;
