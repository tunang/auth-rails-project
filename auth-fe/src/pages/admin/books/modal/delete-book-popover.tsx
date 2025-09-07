import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Trash, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { deleteBookRequest } from "@/store/slices/bookSlice";
import type { Book } from "@/types/book.type";

const DeleteBookPopover = ({ book }: { book: Book }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.book);

  const handleDelete = () => {
    dispatch(deleteBookRequest(book.id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Trash />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Xác nhận xóa sách</h4>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa sách "{book.title}" không? 
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" />
                Hủy
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash className="w-4 h-4 mr-1" />
                {isLoading ? "Đang xóa..." : "Xóa"}
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteBookPopover;