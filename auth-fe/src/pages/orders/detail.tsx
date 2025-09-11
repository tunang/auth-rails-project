import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserOrderDetailRequest, clearCurrentOrder } from "@/store/slices/orderSlice";
import { OrderStatusLabels, OrderStatusColors } from "@/types/order.type";
import type { RootState } from "@/store";

const UserOrderDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentOrder: order, isLoading, message } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (id) {
      dispatch(getUserOrderDetailRequest(parseInt(id)));
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

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
      <Badge className={`${colorClass} border-0 text-sm`}>
        {label}
      </Badge>
    );
  };

  if (isLoading && !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-gray-500 mb-6">
            {message || "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."}
          </p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
          <p className="text-gray-600 mt-1">{order.order_number}</p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sản phẩm trong đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${item.book.cover_image_url}`}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.book.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Số lượng: {item.quantity} × {formatCurrency(item.unit_price)}₫
                        </p>
                        <p className="font-semibold mt-2">
                          Tổng: {formatCurrency(item.total_price)}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Thông tin sản phẩm sẽ được cập nhật sau.</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-gray-600">{order.shipping_address.phone}</p>
                <p className="text-gray-600">
                  {order.shipping_address.address_line_1}
                  {order.shipping_address.address_line_2 && `, ${order.shipping_address.address_line_2}`}
                </p>
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping_address.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary & Timeline */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{formatCurrency(order.subtotal)}₫</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Thuế:</span>
                <span>{formatCurrency(order.tax_amount)}₫</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span>
                  {parseFloat(order.shipping_cost) === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    `${formatCurrency(order.shipping_cost)}₫`
                  )}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-primary">{formatCurrency(order.total_amount)}₫</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Ngày đặt hàng</p>
                  <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Cập nhật lần cuối</p>
                  <p className="text-sm text-gray-600">{formatDate(order.updated_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Receipt className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">Trạng thái hiện tại</p>
                  <div className="mt-1">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Cần hỗ trợ về đơn hàng này?
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Liên hệ hỗ trợ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetailPage;