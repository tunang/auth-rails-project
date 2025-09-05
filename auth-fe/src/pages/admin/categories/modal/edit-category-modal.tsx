import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  categorySchema,
  type CategoryRequest,
} from "@/schemas/category.schema";
import { updateCategoryRequest } from "@/store/slices/categorySlice";
import type { Category } from "@/types/category.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Pencil, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const EditCategoryModal = ({ category }: { category: Category }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.category);
  const form = useForm<CategoryRequest>({
    mode: "onTouched",
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      description: category.description as string,
      parent_id: category.parent?.id,
    },
  });

  // Cập nhật form values khi prop category thay đổi
  useEffect(() => {
    form.reset({
      name: category.name,
      description: category.description as string,
      parent_id: category.parent?.id,
    });
  }, [category, form]);

  const onSubmit = async (data: CategoryRequest) => {
    dispatch(updateCategoryRequest({ ...data, id: category.id }));
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
      <div>
          <Button variant="outline">
            <Pencil />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Nhập tên danh mục"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục cha</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục cha" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Danh mục 1</SelectItem>
                          <SelectItem value="2">Danh mục 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 text-white font-medium"
              >
                {!isLoading ? "Sửa danh mục" : "Đang sửa danh mục..."}
              </Button>
            </form>
          </Form>
        </DialogContent>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
