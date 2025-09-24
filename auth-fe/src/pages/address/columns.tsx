import { type ColumnDef } from "@tanstack/react-table";
import { type Address } from "@/types/address.type";
import { Badge } from "@/components/ui/badge";
import DeleteAddressPopover from "./modal/delete-address-popover";
import EditAddressModal from "./modal/edit-address-modal";

export const columns: ColumnDef<Address>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const address = row.original;
      return <div className="font-medium text-amber-800">#{address.id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Họ tên",
    cell: ({ row }) => {
      const address = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-amber-800">
            {address.first_name} {address.last_name}
          </span>
          {address.is_default && (
            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
              Mặc định
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => {
      const address = row.original;
      return <div className="text-amber-700">{address.phone}</div>;
    },
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => {
      const address = row.original;
      return (
        <div className="max-w-xs">
          <div className="font-medium text-amber-800">{address.address_line_1}</div>
          {address.address_line_2 && (
            <div className="text-sm text-amber-600">{address.address_line_2}</div>
          )}
          <div className="text-sm text-amber-600">
            {address.city}, {address.state}
          </div>
          <div className="text-sm text-amber-600">
            {address.postal_code}, {address.country}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Khu vực",
    cell: ({ row }) => {
      const address = row.original;
      return (
        <div className="text-amber-700">
          <div className="font-medium text-amber-800">{address.city}</div>
          <div className="text-sm">{address.state}</div>
          <div className="text-sm">{address.country}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full text-amber-800">Thao tác</div>,
    cell: ({ row }) => {
      const address = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <EditAddressModal address={address} />
          <DeleteAddressPopover address={address} />
        </div>
      );
    },
  },
];