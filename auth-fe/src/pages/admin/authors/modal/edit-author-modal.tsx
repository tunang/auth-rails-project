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
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  authorSchema,
  type AuthorRequest,
} from "@/schemas/author.schema";
import { updateAuthorRequest } from "@/store/slices/authorSlice";
import type { Author } from "@/types/author.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Pencil, User, Calendar, Globe, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";

const EditAuthorModal = ({ author }: { author: Author }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.author);

  const form = useForm<AuthorRequest>({
    mode: "onTouched",
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: author.name,
      biography: author.biography || "",
      nationality: author.nationality,
      birth_date: author.birth_date,
    },
  });

  // Cập nhật form values khi prop author thay đổi
  useEffect(() => {
    form.reset({
      name: author.name,
      biography: author.biography || "",
      nationality: author.nationality,
      birth_date: author.birth_date,
    });
    setPreviewUrl(author.photo || null);
    setSelectedFile(null);
  }, [author, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: AuthorRequest) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('biography', data.biography || '');
    formData.append('nationality', data.nationality);
    formData.append('birth_date', data.birth_date);
    
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    dispatch(updateAuthorRequest({ id: author.id, data: formData }));
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        // Reset when modal closes
        setSelectedFile(null);
        setPreviewUrl(author.photo || null);
      }
    }}>
      <DialogTrigger asChild>
        <div>
          <Button variant="outline">
            <Pencil />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tác giả</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin tác giả
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
                    <FormLabel>Tên tác giả</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Nhập tên tác giả"
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
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc tịch</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Nhập quốc tịch"
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
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="date"
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
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiểu sử</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập tiểu sử tác giả"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ảnh tác giả</label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Chọn ảnh mới</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && (
                    <span className="text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 text-white font-medium"
              >
                {!isLoading ? "Cập nhật tác giả" : "Đang cập nhật..."}
              </Button>
            </form>
          </Form>
        </DialogContent>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAuthorModal;