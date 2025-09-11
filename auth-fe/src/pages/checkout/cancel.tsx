import { useNavigate } from "react-router-dom";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Thanh toán bị hủy
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Thanh toán của bạn đã bị hủy. Đơn hàng chưa được xử lý.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Lưu ý:</strong> Các sản phẩm vẫn còn trong giỏ hàng của bạn. 
                Bạn có thể tiếp tục mua sắm hoặc thử thanh toán lại.
              </p>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Bạn có thể:
              </h3>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• Quay lại giỏ hàng để xem lại sản phẩm</li>
                <li>• Thử lại với phương thức thanh toán khác</li>
                <li>• Tiếp tục mua sắm thêm sản phẩm khác</li>
              </ul>
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => navigate('/cart')} 
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Quay lại giỏ hàng
              </Button>
              
              <Button 
                onClick={() => navigate('/checkout')} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Thử thanh toán lại
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Gặp khó khăn khi thanh toán? Liên hệ hỗ trợ:</p>
          <p className="mt-1">
            Email: support@bookstore.com | Điện thoại: 1900-xxxx
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;