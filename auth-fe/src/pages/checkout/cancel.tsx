import { useNavigate } from "react-router-dom";
import { XCircle, ShoppingCart, ArrowLeft, BookOpenIcon, AlertTriangleIcon, RefreshCwIcon, HomeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-800 mb-2">
                Thanh toán đã bị hủy
              </CardTitle>
              <p className="text-amber-600 text-lg">
                Đơn hàng của bạn chưa được thanh toán. Hãy vào mục đơn hàng của tôi và thanh toán trong vòng 30 phút.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-800 mb-2">Lưu ý quan trọng</h3>
                    <p className="text-sm text-amber-700">
                      Nếu không thanh toán trong vòng 30 phút, đơn hàng sẽ tự động bị hủy.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* What you can do */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5" />
                  Bạn có thể làm gì tiếp theo?
                </h3>
                <div className="space-y-3 text-sm text-amber-700">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-amber-600" />
                    <span>Quay lại giỏ hàng để xem lại sản phẩm đã chọn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCwIcon className="h-4 w-4 text-amber-600" />
                    <span>Thử lại với phương thức thanh toán khác</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HomeIcon className="h-4 w-4 text-amber-600" />
                    <span>Tiếp tục mua sắm thêm sản phẩm khác</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <Button 
                  onClick={() => navigate('/orders')} 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Đến đơn hàng của tôi
                </Button>
                
      
                
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3 rounded-xl font-semibold"
                  size="lg"
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Tiếp tục mua sắm
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Support Info */}
          <div className="mt-8 text-center">
            <Card className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-amber-800 mb-4">Gặp khó khăn khi thanh toán?</h3>
              <p className="text-sm text-amber-600 mb-4">
                Chúng tôi sẵn sàng hỗ trợ bạn giải quyết vấn đề thanh toán
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <MailIcon className="h-4 w-4" />
                  <span>support@bookstore.com</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <PhoneIcon className="h-4 w-4" />
                  <span>1900-xxxx</span>
                </div>
              </div>
              <p className="text-xs text-amber-500 mt-3">
                Hỗ trợ 24/7 - Chúng tôi luôn sẵn sàng giúp đỡ bạn
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;