import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "@/types/user.type";
import { Badge } from "@/components/ui/badge";
import { UserRoleLabels, UserRoleColors } from "@/types/user.type";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Tên người dùng",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const user = row.original;
      const roleKey = user.role.toLowerCase();
      const label = UserRoleLabels[roleKey as keyof typeof UserRoleLabels] || user.role;
      const colorClass = UserRoleColors[roleKey as keyof typeof UserRoleColors] || "bg-gray-100 text-gray-800";
      
      return (
        <Badge className={`${colorClass} border-0`}>{label}</Badge>
      );
    },
  },
];
