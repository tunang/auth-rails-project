import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle, ShoppingBag, Home, BookOpenIcon, MailIcon, PhoneIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">


        <div className="max-w-2xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-800 mb-2">
                Đơn hàng đã được xử lý thành công!
              </CardTitle>
              <p className="text-amber-600 text-lg">
                Chúng tôi đã nhận được đơn hàng của bạn và đang chuẩn bị giao hàng.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Session ID */}

              {/* Order Info */}
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                  <MailIcon className="h-5 w-5" />
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-3 text-sm text-amber-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Email xác nhận đã được gửi đến địa chỉ của bạn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-amber-600" />
                    <span>Đơn hàng sẽ được xử lý và giao trong 2-3 ngày làm việc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4 text-amber-600" />
                    <span>Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản</span>
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
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Xem đơn hàng của tôi
                </Button>
                
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline" 
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 py-4 rounded-xl font-semibold text-lg"
                  size="lg"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Tiếp tục mua sắm
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Support Info */}
          <div className="mt-8 text-center">
            <Card className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-amber-800 mb-4">Cần hỗ trợ?</h3>
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
                Chúng tôi sẵn sàng hỗ trợ bạn 24/7
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;