import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  categorySchema,
  type CategoryRequest,
} from "@/schemas/category.schema";
import type { Category } from "@/types/category.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Tag, Search } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { createCategoryRequest } from "@/store/slices/categorySlice";
import { categoryApi } from "@/services/category.api";
import type { PaginationParams } from "@/types";

const CreateCategoryModal = () => {
  const [searchedCategories, setSearchedCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useState<PaginationParams>({
    page: 1,
    per_page: 50,
    search: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isLoading } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
  const form = useForm<CategoryRequest>({
    mode: "onTouched",
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parent_id: undefined,
    },
  });

  // Function to search categories
  const searchCategories = async (searchTerm: string) => {
    setIsSearching(true);
    try {
      const updatedParams = { ...searchParams, search: searchTerm };
      setSearchParams(updatedParams);
      const response = await categoryApi.admin.getCategories(updatedParams);
      setSearchedCategories(response.data);
    } catch (error) {
      console.error("Error searching categories:", error);
      setSearchedCategories([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchCategories(searchTerm);
        }, 300);
      };
    })(),
    [searchParams]
  );

  // Load initial categories on component mount
  useEffect(() => {
    const loadInitialCategories = async () => {
      try {
        const response = await categoryApi.admin.getCategories({
          page: 1,
          per_page: 10,
          search: "",
        });
        setSearchedCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadInitialCategories();
  }, []);

  // Focus input after search results update
  useEffect(() => {
    if (!isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching, searchedCategories]);

  const onSubmit = async (data: CategoryRequest) => {
    dispatch(createCategoryRequest(data));
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button variant="outline">
            <Plus /> Add
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
                        disabled={isSearching}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isSearching
                                ? "Đang tìm kiếm..."
                                : "Chọn danh mục cha"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="sticky top-0 bg-white z-10 mb-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Tìm kiếm danh mục cha..."
                                className="pl-10 h-8"
                                value={searchTerm}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSearchTerm(value);
                                  debouncedSearch(value);
                                }}
                                onKeyDown={(e) => {
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onFocus={(e) => {
                                  e.stopPropagation();
                                }}
                                onBlur={(e) => {
                                  e.stopPropagation();
                                }}
                                disabled={isSearching}
                                autoFocus
                              />
                            </div>
                          </div>
                          {searchedCategories.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              Không có danh mục nào
                            </div>
                          ) : (
                            searchedCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          )}
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
                {!isLoading ? "Thêm danh mục" : "Đang thêm danh mục..."}
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

export default CreateCategoryModal;
