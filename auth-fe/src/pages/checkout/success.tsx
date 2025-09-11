import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearCartRequest } from "@/store/slices/cartSlice";

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    setSessionId(sessionIdParam);
    
   
  }, [searchParams, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Thanh toán thành công!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được xử lý thành công.
            </p>
            
            {sessionId && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Mã phiên thanh toán:</p>
                <p className="text-xs font-mono break-all">{sessionId}</p>
              </div>
            )}
            
            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn. 
                Đơn hàng sẽ được xử lý và giao trong 2-3 ngày làm việc.
              </p>
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => navigate('/orders')} 
                className="w-full"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Xem đơn hàng của tôi
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Có câu hỏi về đơn hàng? Liên hệ với chúng tôi qua:</p>
          <p className="mt-1">
            Email: support@bookstore.com | Điện thoại: 1900-xxxx
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;