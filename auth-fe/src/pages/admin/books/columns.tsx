import { type ColumnDef } from "@tanstack/react-table";
import { type Book } from "@/types/book.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import DeleteBookPopover from "./modal/delete-book-popover";
import EditBookModal from "./modal/edit-book-modal";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="max-w-xs">
          <div className="font-medium truncate">{book.title}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "authors",
    header: "Tác giả",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="max-w-xs">
          {book.authors && book.authors.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {book.authors.slice(0, 2).map((author) => (
                <Badge key={author.id} variant="secondary" className="text-xs">
                  {author.name}
                </Badge>
              ))}
              {book.authors.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{book.authors.length - 2}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Chưa có tác giả</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "categories",
    header: "Thể loại",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="max-w-xs">
          {book.categories && book.categories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category) => (
                <Badge key={category.id} variant="outline" className="text-xs">
                  {category.name}
                </Badge>
              ))}
              {book.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{book.categories.length - 2}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Chưa có thể loại</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(book.price)}
        </div>
      );
    },
  },
  {
    accessorKey: "stock_quantity",
    header: () => <div className="text-center w-full">Tồn kho</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="text-center">
          <Badge variant={book.stock_quantity > 0 ? "default" : "destructive"}>
            {book.stock_quantity}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "featured",
    header: () => <div className="text-center w-full">Nổi bật</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="text-center">
          <Badge variant={book.featured ? "default" : "secondary"}>
            {book.featured ? "Có" : "Không"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "cover_image_url",
    header: () => <div className="text-center w-full">Ảnh bìa</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="flex justify-center">
          {book.cover_image_url ? (
            <img 
              src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${book.cover_image_url}`} 
              alt={book.title}
              className="w-10 h-12 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-12 rounded bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">N/A</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <DeleteBookPopover book={book} />
          <EditBookModal book={book} />
        </div>
      );
    },
  },
];