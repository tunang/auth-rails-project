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
  bookSchema,
  type BookRequest,
} from "@/schemas/book.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, BookOpen, DollarSign, Package, Camera, Users, Tag } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { createBookRequest } from "@/store/slices/bookSlice";
import { authorApi } from "@/services/author.api";
import { categoryApi } from "@/services/category.api";
import type { Author } from "@/types/author.type";
import type { Category } from "@/types/category.type";
import type { PaginationParams } from "@/types";

const CreateBookModal = () => {
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [selectedSamplePages, setSelectedSamplePages] = useState<File[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [samplePagesPreview, setSamplePagesPreview] = useState<string[]>([]);
  
  const [searchedAuthors, setSearchedAuthors] = useState<Author[]>([]);
  const [searchedCategories, setSearchedCategories] = useState<Category[]>([]);
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isSearchingAuthors, setIsSearchingAuthors] = useState(false);
  const [isSearchingCategories, setIsSearchingCategories] = useState(false);
  
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const samplePagesInputRef = useRef<HTMLInputElement>(null);
  const { isLoading } = useAppSelector((state) => state.book);
  const dispatch = useAppDispatch();
  
  const form = useForm<BookRequest>({
    mode: "onTouched",
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      featured: false,
      sold_count: 0,
      cost_price: 0,
      discount_percentage: 0,
      author_ids: [],
      category_ids: [],
    },
  });

  // Function to search authors
  const searchAuthors = async (searchTerm: string) => {
    setIsSearchingAuthors(true);
    try {
      const params: PaginationParams = {
        page: 1,
        per_page: 50,
        search: searchTerm,
      };
      const response = await authorApi.admin.getAuthors(params);
      setSearchedAuthors(response.data);
    } catch (error) {
      console.error("Error searching authors:", error);
      setSearchedAuthors([]);
    } finally {
      setIsSearchingAuthors(false);
    }
  };

  // Function to search categories
  const searchCategories = async (searchTerm: string) => {
    setIsSearchingCategories(true);
    try {
      const params: PaginationParams = {
        page: 1,
        per_page: 50,
        search: searchTerm,
      };
      const response = await categoryApi.admin.getCategories(params);
      setSearchedCategories(response.data);
    } catch (error) {
      console.error("Error searching categories:", error);
      setSearchedCategories([]);
    } finally {
      setIsSearchingCategories(false);
    }
  };

  // Debounced search functions
  const debouncedAuthorSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchAuthors(searchTerm);
        }, 300);
      };
    })(),
    []
  );

  const debouncedCategorySearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchTerm: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchCategories(searchTerm);
        }, 300);
      };
    })(),
    []
  );

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [authorsResponse, categoriesResponse] = await Promise.all([
          authorApi.admin.getAuthors({ page: 1, per_page: 10, search: "" }),
          categoryApi.admin.getCategories({ page: 1, per_page: 10, search: "" })
        ]);
        setSearchedAuthors(authorsResponse.data);
        setSearchedCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCoverImage(file);
      const url = URL.createObjectURL(file);
      setCoverImagePreview(url);
    }
  };

  const handleSamplePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedSamplePages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setSamplePagesPreview(previews);
  };

  const onSubmit = async (data: BookRequest) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    formData.append('stock_quantity', data.stock_quantity.toString());
    formData.append('featured', data.featured.toString());
    formData.append('sold_count', (data.sold_count || 0).toString());
    formData.append('cost_price', (data.cost_price || 0).toString());
    formData.append('discount_percentage', (data.discount_percentage || 0).toString());
    
    // Append author IDs
    data.author_ids.forEach(authorId => {
      formData.append('author_ids[]', authorId.toString());
    });
    
    // Append category IDs
    data.category_ids.forEach(categoryId => {
      formData.append('category_ids[]', categoryId.toString());
    });
    
    if (selectedCoverImage) {
      formData.append('cover_image', selectedCoverImage);
    }

    selectedSamplePages.forEach((file, index) => {
      formData.append(`sample_pages[]`, file);
    });

    dispatch(createBookRequest(formData));
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        // Reset form when modal closes
        form.reset();
        setSelectedCoverImage(null);
        setSelectedSamplePages([]);
        setCoverImagePreview(null);
        setSamplePagesPreview([]);
      }
    }}>
      <DialogTrigger asChild>
        <div>
          <Button variant="outline">
            <Plus /> Thêm sách
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sách mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo sách mới
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề sách</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Nhập tiêu đề sách"
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
                          placeholder="Nhập mô tả sách"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              onChange={(e) => field.onChange(Number(e.target.value))}
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
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá vốn</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tồn kho</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sold_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đã bán</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giảm giá (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Sách nổi bật
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Authors Selection */}
                <FormField
                  control={form.control}
                  name="author_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác giả</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Tìm kiếm tác giả..."
                              className="pl-10"
                              value={authorSearchTerm}
                              onChange={(e) => {
                                const value = e.target.value;
                                setAuthorSearchTerm(value);
                                debouncedAuthorSearch(value);
                              }}
                            />
                          </div>
                          <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                            {isSearchingAuthors ? (
                              <div className="text-sm text-muted-foreground">Đang tìm kiếm...</div>
                            ) : (
                              searchedAuthors.map((author) => (
                                <label key={author.id} className="flex items-center space-x-2 cursor-pointer">
                                  <Checkbox
                                    checked={field.value.includes(author.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, author.id]);
                                      } else {
                                        field.onChange(field.value.filter((id) => id !== author.id));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{author.name}</span>
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categories Selection */}
                <FormField
                  control={form.control}
                  name="category_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thể loại</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Tìm kiếm thể loại..."
                              className="pl-10"
                              value={categorySearchTerm}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCategorySearchTerm(value);
                                debouncedCategorySearch(value);
                              }}
                            />
                          </div>
                          <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                            {isSearchingCategories ? (
                              <div className="text-sm text-muted-foreground">Đang tìm kiếm...</div>
                            ) : (
                              searchedCategories.map((category) => (
                                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                                  <Checkbox
                                    checked={field.value.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, category.id]);
                                      } else {
                                        field.onChange(field.value.filter((id) => id !== category.id));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{category.name}</span>
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ảnh bìa</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => coverImageInputRef.current?.click()}
                        >
                          Chọn ảnh bìa
                        </Button>
                      </div>
                      <input
                        ref={coverImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                    </div>
                    {coverImagePreview && (
                      <div className="mt-4">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="mx-auto h-32 w-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sample Pages Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trang mẫu</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => samplePagesInputRef.current?.click()}
                        >
                          Chọn trang mẫu
                        </Button>
                      </div>
                      <input
                        ref={samplePagesInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSamplePagesChange}
                        className="hidden"
                      />
                    </div>
                    {samplePagesPreview.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {samplePagesPreview.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Sample page ${index + 1}`}
                            className="h-20 w-full object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang thêm..." : "Thêm sách"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookModal;