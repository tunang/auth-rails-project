import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetailRequest, clearCurrentOrder } from "@/store/slices/orderSlice";
import type { RootState } from "@/store";
import type { Order } from "@/types/order.type";
import { OrderStatusLabels, OrderStatusColors } from "@/types/order.type";

interface OrderDetailModalProps {
  order: Order;
}

const OrderDetailModal = ({ order }: OrderDetailModalProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector((state: RootState) => state.order);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      dispatch(getOrderDetailRequest(order.id));
    } else {
      dispatch(clearCurrentOrder());
    }
  };

  const statusNumber = parseInt(order.status) as keyof typeof OrderStatusLabels;
  const statusLabel = OrderStatusLabels[statusNumber] || order.status;
  const statusColor = OrderStatusColors[statusNumber] || "bg-gray-100 text-gray-800";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
          Chi tiết
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng #{order.order_number}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : currentOrder ? (
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mã đơn hàng</label>
                    <p className="font-mono">{currentOrder.order_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                    <div className="mt-1">
                      <Badge className={`${statusColor} border-0`}>
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                    <p>{new Date(currentOrder.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                    <p>{new Date(currentOrder.updated_at).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tên</label>
                  <p>{currentOrder.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{currentOrder.user.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Địa chỉ giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ tên</label>
                    <p>{currentOrder.shipping_address.first_name} {currentOrder.shipping_address.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                    <p>{currentOrder.shipping_address.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                  <p>{currentOrder.shipping_address.address_line_1}</p>
                  {currentOrder.shipping_address.address_line_2 && (
                    <p>{currentOrder.shipping_address.address_line_2}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thành phố</label>
                    <p>{currentOrder.shipping_address.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tỉnh/Thành</label>
                    <p>{currentOrder.shipping_address.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mã bưu điện</label>
                    <p>{currentOrder.shipping_address.postal_code}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Quốc gia</label>
                  <p>{currentOrder.shipping_address.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${item.book.cover_image_url}`}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.book.title}</h4>
                        <p className="text-sm text-gray-500">
                          Đơn giá: {parseFloat(item.unit_price).toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {parseFloat(item.total_price).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng kết đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{parseFloat(currentOrder.subtotal).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế:</span>
                  <span>{parseFloat(currentOrder.tax_amount).toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{parseFloat(currentOrder.shipping_cost).toLocaleString('vi-VN')}đ</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span>{parseFloat(currentOrder.total_amount).toLocaleString('vi-VN')}đ</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;