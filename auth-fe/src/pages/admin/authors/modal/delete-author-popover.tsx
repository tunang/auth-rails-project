import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Trash, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { deleteAuthorRequest } from "@/store/slices/authorSlice";
import type { Author } from "@/types/author.type";

const DeleteAuthorPopover = ({ author }: { author: Author }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.author);

  const handleDelete = () => {
    dispatch(deleteAuthorRequest(author.id));
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
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">Xác nhận xóa</h4>
              <PopoverClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </PopoverClose>
            </div>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn xóa tác giả <strong>{author.name}</strong>? 
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex gap-2">
            <PopoverClose asChild>
              <Button variant="outline" size="sm" className="flex-1">
                Hủy
              </Button>
            </PopoverClose>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteAuthorPopover;