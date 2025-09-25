import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, MapPin, CreditCard, Eye, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo, PerPageSelector } from "@/components/ui/pagination";
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

  const { orders, isLoading, pagination, perPage } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getUserOrdersRequest({ page: pagination.current_page || 1, per_page: perPage }));
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
      <Badge className={`${colorClass} border-0`}>{label}</Badge>
    );
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const handlePageChange = (page: number) => {
    dispatch(getUserOrdersRequest({ page, per_page: perPage }));
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-amber-700">Đang tải danh sách đơn hàng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
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
          </nav>
        </div>

        {/* Orders Count */}
        <div className="mb-6">
          <p className="text-amber-700">
            Tổng cộng <span className="font-semibold">{pagination.total_count}</span> đơn hàng
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-amber-600 mb-6">Bạn chưa có đơn hàng nào. Khám phá các sản phẩm của chúng tôi!</p>
              <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700 text-white">
                Khám phá ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => {
              const items = order.order_items || [];
              const maxPreview = 4;
              const extraCount = Math.max(items.length - maxPreview, 0);
              return (
                <Card key={order.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-amber-800">
                          {order.order_number}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-amber-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <div className="mt-2">
                          <span className="text-lg font-bold text-amber-700">
                            {formatCurrency(order.total_amount)}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Items preview */}
                    {items.length > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {items.slice(0, maxPreview).map((it) => (
                            <img
                              key={it.id}
                              src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${it.book.cover_image_url}`}
                              alt={it.book.title}
                              className="w-10 h-12 object-cover rounded border border-amber-200 shadow-sm"
                            />
                          ))}
                          {extraCount > 0 && (
                            <div className="w-10 h-12 rounded border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold flex items-center justify-center">
                              +{extraCount}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-amber-700 truncate">
                          {items.map((it) => it.book.title).slice(0, 2).join(', ')}{items.length > 2 ? '…' : ''}
                        </div>
                      </div>
                    )}

                    <Separator className="bg-amber-200" />

                    {/* Address and summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-700">
                            <p className="font-medium text-amber-800">
                              {order.shipping_address.first_name} {order.shipping_address.last_name}
                            </p>
                            <p className="truncate">{order.shipping_address.address_line_1}{order.shipping_address.address_line_2 && `, ${order.shipping_address.address_line_2}`}</p>
                            <p className="truncate">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center justify-between">
                          <span>Tạm tính</span><span className="font-semibold text-amber-800">{formatCurrency(order.subtotal)}₫</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center justify-between">
                          <span>Thuế</span><span className="font-semibold text-amber-800">{formatCurrency(order.tax_amount)}₫</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center justify-between">
                          <span>Vận chuyển</span>
                          <span className="font-semibold {parseFloat(order.shipping_cost)===0 ? 'text-green-600' : 'text-amber-800'}">
                            {parseFloat(order.shipping_cost) === 0 ? 'Miễn phí' : `${formatCurrency(order.shipping_cost)}₫`}
                          </span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center justify-between">
                          <span>Tổng</span><span className="font-bold text-amber-800">{formatCurrency(order.total_amount)}₫</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-amber-200" />

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-amber-700">
                        <CreditCard className="h-4 w-4" />
                        <span>Cập nhật: {formatDate(order.updated_at)}</span>
                      </div>
                      <Button
                        onClick={() => handleViewOrder(order.id)}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        size="sm"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.total_pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <PaginationInfo
              currentPage={pagination.current_page}
              totalCount={pagination.total_count}
              perPage={perPage}
            />
            <div className="flex items-center gap-4">
              <PerPageSelector 
                perPage={perPage} 
                onPerPageChange={(value) => dispatch({ type: 'order/setPerPage', payload: value })}
              />
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;