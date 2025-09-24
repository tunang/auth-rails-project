import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAddressesRequest } from "@/store/slices/addressSlice";
import { MapPinIcon, CreditCardIcon, FileTextIcon, ShoppingBagIcon, CheckCircleIcon, TruckIcon, BookOpenIcon } from "lucide-react";
import type { RootState } from "@/store";
import type { Address } from "@/types/address.type";
import type { CreateOrderRequest, CreateOrderItem } from "@/types/order.type";
import { orderApi } from "@/services/order.api";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { selectedItems, selectedTotalAmount, items } = useSelector(
    (state: RootState) => state.cart
  );
  
  const { addresses, isLoading: addressLoading } = useSelector(
    (state: RootState) => state.address
  );
  
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [note, setNote] = useState<string>("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Redirect nếu không có items được chọn
  useEffect(() => {
    if (selectedItems.length === 0) {
      navigate('/cart');
    }
  }, [selectedItems.length, navigate]);

  // Load addresses
  useEffect(() => {
    dispatch(getAddressesRequest());
  }, [dispatch]);

  // Auto-select first address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const selectedOrderItems = items
    .filter(item => selectedItems.includes(item.book.id))
    .map(item => ({
      book: item.book,
      quantity: item.quantity,
      price: parseFloat(item.book.price),
      discountPercentage: parseFloat(item.book.discount_percentage),
      discountedPrice: parseFloat(item.book.price) * (1 - parseFloat(item.book.discount_percentage) / 100),
      totalPrice: parseFloat(item.book.price) * (1 - parseFloat(item.book.discount_percentage) / 100) * item.quantity
    }));

  const paymentMethods = [
    { value: "credit_card", label: "Thẻ tín dụng/ghi nợ" },
    { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
    { value: "e_wallet", label: "Ví điện tử" },
    { value: "cash_on_delivery", label: "Thanh toán khi nhận hàng (COD)" },
  ];

  const handleCreateOrder = async () => {
    if (!selectedAddressId || selectedOrderItems.length === 0) {
      return;
    }

    setIsCreatingOrder(true);

    try {
      const orderItems: CreateOrderItem[] = selectedOrderItems.map(item => ({
        quantity: item.quantity,
        book_id: item.book.id
      }));

      const orderData: CreateOrderRequest = {
        shipping_address_id: selectedAddressId,
        payment_method: paymentMethod,
        note: note.trim() || undefined,
        order_items: orderItems
      };

      const response = await orderApi.user.createOrder(orderData);
      
      // If payment_url exists, redirect to Stripe checkout
      if (response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        // Fallback: redirect to order detail if no payment URL
        navigate(`/orders/${response.data.id}`, {
          state: { message: "Đơn hàng đã được tạo thành công!" }
        });
      }
      
    } catch (error: any) {
      console.error("Create order error:", error);
      alert(error.response?.data?.status?.message || "Có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (selectedItems.length === 0) {
    return null; // Sẽ redirect về cart
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-600 text-white p-2 rounded-lg shadow-md">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-800">Thanh toán</h1>
              <p className="text-amber-600 text-sm">Hoàn tất đơn hàng của bạn</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center gap-2 text-amber-600">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="font-medium">Giỏ hàng</span>
            </div>
            <div className="w-8 h-px bg-amber-300"></div>
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
              <span>Thanh toán</span>
            </div>
            <div className="w-8 h-px bg-amber-200"></div>
            <div className="flex items-center gap-2 text-amber-400">
              <div className="w-6 h-6 bg-amber-200 text-amber-600 rounded-full flex items-center justify-center text-xs">3</div>
              <span>Hoàn thành</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addressLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                    <p className="ml-3 text-amber-700">Đang tải địa chỉ...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <MapPinIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <p className="text-amber-700 font-medium mb-4">Bạn chưa có địa chỉ nào</p>
                    <Button 
                      onClick={() => navigate('/addresses')}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Thêm địa chỉ mới
                    </Button>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAddressId?.toString() || ""}
                    onValueChange={(value) => setSelectedAddressId(Number(value))}
                    className="space-y-3"
                  >
                    {addresses.map((address: Address) => (
                      <div key={address.id} className="flex items-start space-x-4 p-4 border border-amber-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                        <RadioGroupItem 
                          value={address.id.toString()} 
                          id={`address-${address.id}`}
                          className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                        />
                        <div className="flex-1">
                          <Label htmlFor={`address-${address.id}`} className="font-semibold text-amber-800 cursor-pointer">
                            {address.first_name} {address.last_name}
                          </Label>
                          <p className="text-sm text-amber-600 mt-1">
                            {address.phone}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address_line_1}
                            {address.address_line_2 && `, ${address.address_line_2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.postal_code}, {address.country}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.value} className="flex items-center space-x-3 p-3 border border-amber-200 rounded-lg hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                      <RadioGroupItem 
                        value={method.value} 
                        id={`payment-${method.value}`}
                        className="border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                      <Label htmlFor={`payment-${method.value}`} className="font-medium text-amber-700 cursor-pointer">
                        {method.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Note */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Ghi chú đơn hàng (tùy chọn)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ghi chú cho đơn hàng của bạn (ví dụ: gọi trước khi giao, giao tại cổng...)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-4">
                  {selectedOrderItems.map((item) => (
                    <div key={item.book.id} className="flex gap-3 p-3 bg-amber-50 rounded-lg">
                      <img
                        src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${item.book.cover_image_url}`}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded-lg shadow-sm border border-amber-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-amber-800 truncate">{item.book.title}</h4>
                        <p className="text-xs text-amber-600 mb-2">
                          Số lượng: {item.quantity}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.discountPercentage > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                          )}
                          <span className="font-bold text-amber-700">
                            {item.totalPrice.toLocaleString('vi-VN')}đ
                          </span>
                          {item.discountPercentage > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{item.discountPercentage}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-amber-200" />

                {/* Pricing Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">Tạm tính:</span>
                    <span className="font-semibold text-amber-700">{selectedTotalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600 flex items-center gap-1">
                      <TruckIcon className="h-3 w-3" />
                      Phí vận chuyển:
                    </span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>
                  <Separator className="bg-amber-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-amber-800">Tổng cộng:</span>
                    <span className="font-bold text-2xl text-amber-700">
                      {selectedTotalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                  size="lg"
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !selectedAddressId || addresses.length === 0}
                >
                  <ShoppingBagIcon className="mr-2 h-5 w-5" />
                  {isCreatingOrder ? "Đang tạo đơn hàng..." : "Đặt hàng ngay"}
                </Button>

                <div className="text-xs text-amber-600 text-center bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="h-3 w-3" />
                    <span>Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;