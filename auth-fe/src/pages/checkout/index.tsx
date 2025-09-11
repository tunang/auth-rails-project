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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {addressLoading ? (
                <div className="text-center py-4">Đang tải địa chỉ...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                  <Button onClick={() => navigate('/addresses')}>
                    Thêm địa chỉ mới
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAddressId?.toString() || ""}
                  onValueChange={(value) => setSelectedAddressId(Number(value))}
                >
                  {addresses.map((address: Address) => (
                    <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                      <div className="flex-1">
                        <Label htmlFor={`address-${address.id}`} className="font-medium">
                          {address.first_name} {address.last_name}
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.phone}
                        </p>
                        <p className="text-sm text-gray-600">
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
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                {paymentMethods.map((method) => (
                  <div key={method.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.value} id={`payment-${method.value}`} />
                    <Label htmlFor={`payment-${method.value}`}>{method.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Note */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú đơn hàng (tùy chọn)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ghi chú cho đơn hàng của bạn (ví dụ: gọi trước khi giao, giao tại cổng...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {selectedOrderItems.map((item) => (
                  <div key={item.book.id} className="flex gap-3">
                    <img
                      src={`${import.meta.env.VITE_APP_API_URL_IMAGE}${item.book.cover_image_url}`}
                      alt={item.book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.book.title}</h4>
                      <p className="text-xs text-gray-500 mb-1">
                        Số lượng: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.discountPercentage > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            {item.price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                        <span className="font-medium text-sm">
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

              <Separator />

              {/* Pricing Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{selectedTotalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-lg text-primary">
                    {selectedTotalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder || !selectedAddressId || addresses.length === 0}
              >
                {isCreatingOrder ? "Đang tạo đơn hàng..." : "Đặt hàng"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;