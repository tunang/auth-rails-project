import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Receipt, Home, ChevronRight } from "lucide-react";
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
      <Badge className={`${colorClass} border-0 text-sm`}>{label}</Badge>
    );
  };

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-amber-700">Đang tải chi tiết đơn hàng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold text-amber-800 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-amber-600 mb-6">{message || "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."}</p>
            <Button onClick={() => navigate('/orders')} className="bg-amber-600 hover:bg-amber-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/orders')}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <ChevronRight className="h-4 w-4 text-amber-400" />
            <div className="bg-amber-600 text-white p-2 rounded-lg shadow-md">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-800">Chi tiết đơn hàng</h1>
              <p className="text-amber-600 text-sm">{order.order_number}</p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-amber-600">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1"
            >
              <Home className="h-4 w-4 mr-1" />
              Trang chủ
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-amber-800">Đơn hàng</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-amber-800">{order.order_number}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Package className="h-5 w-5" />
                  Sản phẩm trong đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-amber-200 rounded-xl">
                        <img
                          src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${item.book.cover_image_url}`}
                          alt={item.book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-800">{item.book.title}</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            Số lượng: {item.quantity} × {formatCurrency(item.unit_price)}₫
                          </p>
                          <p className="font-semibold text-amber-800 mt-2">
                            Tổng: {formatCurrency(item.total_price)}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-600">Thông tin sản phẩm sẽ được cập nhật sau.</p>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-amber-700">
                  <p className="font-medium text-amber-800">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  <p>{order.shipping_address.phone}</p>
                  <p>
                    {order.shipping_address.address_line_1}
                    {order.shipping_address.address_line_2 && `, ${order.shipping_address.address_line_2}`}
                  </p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary & Timeline */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Receipt className="h-5 w-5" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-amber-700">
                <div className="flex justify-between">
                  <span className="text-amber-600">Tạm tính:</span>
                  <span className="font-medium text-amber-800">{formatCurrency(order.subtotal)}₫</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-amber-600">Thuế:</span>
                  <span className="font-medium text-amber-800">{formatCurrency(order.tax_amount)}₫</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-amber-600">Phí vận chuyển:</span>
                  <span>
                    {parseFloat(order.shipping_cost) === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${formatCurrency(order.shipping_cost)}₫`
                    )}
                  </span>
                </div>
                
                <Separator className="bg-amber-200" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-amber-800">Tổng cộng:</span>
                  <span className="text-amber-700">{formatCurrency(order.total_amount)}₫</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Calendar className="h-5 w-5" />
                  Thông tin đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-amber-700">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 mt-1 text-amber-600" />
                  <div>
                    <p className="font-medium text-sm">Ngày đặt hàng</p>
                    <p className="text-sm">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 mt-1 text-amber-600" />
                  <div>
                    <p className="font-medium text-sm">Cập nhật lần cuối</p>
                    <p className="text-sm">{formatDate(order.updated_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Receipt className="h-4 w-4 mt-1 text-amber-600" />
                  <div>
                    <p className="font-medium text-sm">Trạng thái hiện tại</p>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-amber-700 mb-3">Cần hỗ trợ về đơn hàng này?</p>
                <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400">
                  Liên hệ hỗ trợ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetailPage;