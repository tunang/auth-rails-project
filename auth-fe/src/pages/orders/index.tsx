import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, MapPin, CreditCard, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserOrdersRequest } from "@/store/slices/orderSlice";
import { OrderStatusLabels, OrderStatusColors } from "@/types/order.type";
import type { RootState } from "@/store";
import type { Order } from "@/types/order.type";

const UserOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, isLoading, pagination } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getUserOrdersRequest({}));
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase();
    const label = OrderStatusLabels[statusKey as keyof typeof OrderStatusLabels] || status;
    const colorClass = OrderStatusColors[statusKey as keyof typeof OrderStatusColors] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={`${colorClass} border-0`}>
        {label}
      </Badge>
    );
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Đơn hàng của bạn</h1>
      </div>

      {/* Orders Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Tổng cộng <span className="font-semibold">{pagination.total_count}</span> đơn hàng
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <Button onClick={() => navigate('/')}>
              Khám phá ngay
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {order.order_number}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <div className="mt-2">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(order.total_amount)}₫
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Shipping Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address.address_line_1}
                      {order.shipping_address.address_line_2 && `, ${order.shipping_address.address_line_2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tạm tính:</span>
                    <span className="float-right font-medium">
                      {formatCurrency(order.subtotal)}₫
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Thuế:</span>
                    <span className="float-right font-medium">
                      {formatCurrency(order.tax_amount)}₫
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phí ship:</span>
                    <span className="float-right font-medium">
                      {parseFloat(order.shipping_cost) === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        `${formatCurrency(order.shipping_cost)}₫`
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>
                      Cập nhật: {formatDate(order.updated_at)}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleViewOrder(order.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More / Pagination can be added here if needed */}
      {pagination.total_pages > 1 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Trang {pagination.current_page} / {pagination.total_pages}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;