import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatusRequest } from "@/store/slices/orderSlice";
import type { RootState } from "@/store";
import type { Order, OrderStatus } from "@/types/order.type";
import { OrderStatusLabels } from "@/types/order.type";
import { updateOrderStatusSchema, type UpdateOrderStatusRequest } from "@/schemas/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UpdateOrderStatusModalProps {
  order: Order;
}

const UpdateOrderStatusModal = ({ order }: UpdateOrderStatusModalProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.order);

  const form = useForm<UpdateOrderStatusRequest>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues: {
      status: parseInt(order.status) as OrderStatus,
    },
  });

  const onSubmit = (data: UpdateOrderStatusRequest) => {
    dispatch(updateOrderStatusRequest({ id: order.id, data }));
    setOpen(false);
    form.reset();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  // Get available status options (you might want to restrict based on current status)
  const statusOptions = Object.entries(OrderStatusLabels)
    .filter(([key]) => !isNaN(parseInt(key))) // Only include numeric keys
    .map(([value, label]) => ({
      value: parseInt(value) as OrderStatus,
      label,
    }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
          Cập nhật
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Mã đơn hàng</label>
                <p className="font-mono text-sm">{order.order_number}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Khách hàng</label>
                <p className="text-sm">{order.user.name} ({order.user.email})</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Trạng thái hiện tại</label>
                <p className="text-sm">
                  {OrderStatusLabels[parseInt(order.status) as keyof typeof OrderStatusLabels]}
                </p>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái mới</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrderStatusModal;