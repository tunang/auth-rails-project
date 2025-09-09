import { type ColumnDef } from "@tanstack/react-table";
import { type Order, OrderStatusLabels, OrderStatusColors } from "@/types/order.type";
import { Badge } from "@/components/ui/badge";
import OrderDetailModal from "./modal/order-detail-modal";
import UpdateOrderStatusModal from "./modal/update-order-status-modal";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const order = row.original;
      return <div className="font-medium">#{order.id}</div>;
    },
  },
  {
    accessorKey: "order_number",
    header: "Mã đơn hàng",
    cell: ({ row }) => {
      const order = row.original;
      return <div className="font-mono text-sm">{order.order_number}</div>;
    },
  },
  {
    accessorKey: "user",
    header: "Khách hàng",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-medium">{order.user.name}</div>
          <div className="text-sm text-gray-500">{order.user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const order = row.original;
      const statusNumber = parseInt(order.status) as keyof typeof OrderStatusLabels;
      const statusLabel = OrderStatusLabels[statusNumber] || order.status;
      const statusColor = OrderStatusColors[statusNumber] || "bg-gray-100 text-gray-800";
      
      return (
        <Badge className={`${statusColor} border-0`}>
          {statusLabel}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="font-medium">
          {parseFloat(order.total_amount).toLocaleString('vi-VN')}đ
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          {new Date(order.created_at).toLocaleDateString('vi-VN')}
          <div className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleTimeString('vi-VN')}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "shipping_address",
    header: "Địa chỉ giao hàng",
    cell: ({ row }) => {
      const order = row.original;
      const address = order.shipping_address;
      return (
        <div className="max-w-xs">
          <div className="font-medium">{address.first_name} {address.last_name}</div>
          <div className="text-sm text-gray-500 truncate">
            {address.address_line_1}, {address.city}
          </div>
          <div className="text-sm text-gray-500">{address.phone}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center w-full">Thao tác</div>,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <OrderDetailModal order={order} />
          <UpdateOrderStatusModal order={order} />
        </div>
      );
    },
  },
];