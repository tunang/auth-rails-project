import { type ColumnDef } from "@tanstack/react-table";
import { type Author } from "@/types/author.type";
import DeleteAuthorPopover from "./modal/delete-author-popover";
import EditAuthorModal from "./modal/edit-author-modal";

export const columns: ColumnDef<Author>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Tên tác giả",
  },
  {
    accessorKey: "nationality",
    header: "Quốc tịch",
  },
  {
    accessorKey: "birth_date",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const author = row.original;
      return <div>{new Date(author.birth_date).toLocaleDateString('vi-VN')}</div>;
    },
  },
  {
    accessorKey: "biography",
    header: "Tiểu sử",
    cell: ({ row }) => {
      const author = row.original;
      return (
        <div className="max-w-xs truncate">
          {author.biography || "Chưa có thông tin"}
        </div>
      );
    },
  },
  {
    accessorKey: "photo",
    header: () => <div className="text-center w-full">Ảnh</div>,  
    cell: ({ row }) => {
      const author = row.original;
      return (
        <div className="flex justify-center">
          {author.photo ? (
            <img 
              src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${author.photo}`} 
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
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
      const author = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <DeleteAuthorPopover author={author} />
          <EditAuthorModal author={author} />
        </div>
      );
    },
  },
];