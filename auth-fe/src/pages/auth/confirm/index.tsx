import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { confirmEmailRequest } from "@/store/slices/authSlice";

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<"loading" | "success" | "error" | "pending">("pending");
  const [countdown, setCountdown] = useState(60);

  const dispatch = useAppDispatch();
  const { message,isConfirmingEmail } = useAppSelector((state) => state.auth);
  // Get email from navigation state or URL params
  const token = searchParams.get("confirmation_token");

  useEffect(() => {
    // If there's a token in URL, it means user clicked confirmation link
    if (token) {  
      setConfirmationStatus("loading");
      // Simulate email confirmation API call
      dispatch(confirmEmailRequest({ token }));
    }
  }, [token]);

  useEffect(() => {
    // Countdown for resend email
    if (confirmationStatus === "pending" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, confirmationStatus]);

  const handleResendEmail = () => {
    setIsLoading(true);
    // Simulate resend email API call
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(60);
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Email confirmation successful
  if (!isConfirmingEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="bg-red-600 text-white p-3 rounded-lg">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">FAHASA</span>
                <span className="text-sm text-gray-500">Thế giới trong tầm tay</span>
              </div>
            </Link>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 bg-green-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4">
                  <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Xác thực thành công!</CardTitle>
              <CardDescription className="text-green-100 text-center">
                Tài khoản của bạn đã được kích hoạt
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">🎉 Chào mừng bạn đến với FAHASA!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Tài khoản đã được xác thực thành công.
                  </p>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <p>✅ Tài khoản đã được kích hoạt</p>
                  <p>✅ Có thể đăng nhập và mua sắm</p>
                  <p>✅ Nhận thông báo khuyến mãi qua email</p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleBackToLogin}
                    className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Đăng nhập ngay
                  </Button>
                  
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full h-11 border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Khám phá sách hay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    );
  }

  // Email confirmation error
  // if (confirmationStatus === "error") {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
  //       <div className="w-full max-w-md">
  //         <div className="text-center mb-8">
  //           <Link to="/" className="inline-flex items-center space-x-3">
  //             <div className="bg-red-600 text-white p-3 rounded-lg">
  //               <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
  //                 <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z"/>
  //               </svg>
  //             </div>
  //             <div className="flex flex-col">
  //               <span className="text-2xl font-bold text-red-600">FAHASA</span>
  //               <span className="text-sm text-gray-500">Thế giới trong tầm tay</span>
  //             </div>
  //           </Link>
  //         </div>

  //         <Card className="shadow-xl border-0">
  //           <CardHeader className="space-y-1 bg-red-600 text-white rounded-t-lg">
  //             <div className="flex justify-center mb-4">
  //               <div className="bg-white rounded-full p-3">
  //                 <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  //                 </svg>
  //               </div>
  //             </div>
  //             <CardTitle className="text-2xl font-bold text-center">Xác thực thất bại</CardTitle>
  //             <CardDescription className="text-red-100 text-center">
  //               Liên kết xác thực không hợp lệ hoặc đã hết hạn
  //             </CardDescription>
  //           </CardHeader>
  //           <CardContent className="p-6">
  //             <div className="text-center space-y-4">
  //               <p className="text-gray-600">
  //                 Liên kết xác thực có thể đã hết hạn hoặc đã được sử dụng. 
  //                 Vui lòng thử lại hoặc yêu cầu gửi lại email xác thực.
  //               </p>
                
  //               <div className="space-y-3">
  //                 <Button
  //                   onClick={handleResendEmail}
  //                   className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
  //                   disabled={isLoading}
  //                 >
  //                   {isLoading ? (
  //                     <div className="flex items-center space-x-2">
  //                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
  //                       <span>Đang gửi lại...</span>
  //                     </div>
  //                   ) : (
  //                     "Gửi lại email xác thực"
  //                   )}
  //                 </Button>
                  
  //                 <Button
  //                   onClick={handleBackToLogin}
  //                   variant="outline"
  //                   className="w-full h-11 border-red-600 text-red-600 hover:bg-red-50"
  //                 >
  //                   Quay lại đăng nhập
  //                 </Button>
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

    // Loading confirmation
    if (isConfirmingEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="bg-red-600 text-white p-3 rounded-lg">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">FAHASA</span>
                <span className="text-sm text-gray-500">Thế giới trong tầm tay</span>
              </div>
            </Link>
          </div>

          <Card className="shadow-xl border-0 pt-4">
            <CardHeader className="space-y-1 bg-blue-600 text-white rounded-t-lg py-4">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Đang xác thực...</CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Vui lòng chờ trong giây lát
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Chúng tôi đang xác thực email của bạn. Quá trình này có thể mất vài giây.
                </p>
                <div className="flex justify-center">
                  <div className="animate-pulse text-blue-600">⏳ Đang xử lý...</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Pending confirmation (waiting for user to check email)
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
  //     <div className="w-full max-w-md">
  //       {/* Logo */}
  //       <div className="text-center mb-8">
  //         <Link to="/" className="inline-flex items-center space-x-3">
  //           <div className="bg-red-600 text-white p-3 rounded-lg">
  //             <svg
  //               className="h-8 w-8"
  //               fill="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z"/>
  //             </svg>
  //           </div>
  //           <div className="flex flex-col">
  //             <span className="text-2xl font-bold text-red-600">FAHASA</span>
  //             <span className="text-sm text-gray-500">Thế giới trong tầm tay</span>
  //           </div>
  //         </Link>
  //       </div>

  //       {/* Confirmation Card */}
  //       <Card className="shadow-xl border-0">
  //         <CardHeader className="space-y-1 bg-orange-500 text-white rounded-t-lg">
  //           <div className="flex justify-center mb-4">
  //             <div className="bg-white rounded-full p-3">
  //               <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  //               </svg>
  //             </div>
  //           </div>
  //           <CardTitle className="text-2xl font-bold text-center">Kiểm tra email của bạn</CardTitle>
  //           <CardDescription className="text-orange-100 text-center">
  //             Chúng tôi đã gửi liên kết xác thực đến email của bạn
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="p-6">
  //           <div className="text-center space-y-4">
  //             <p className="text-gray-600">
  //               Chúng tôi đã gửi email xác thực đến:
  //             </p>
  //             <div className="bg-gray-100 p-3 rounded-md">
  //               <p className="font-medium text-gray-800">Email của bạn đã được gửi</p>
  //             </div>
              
  //             <div className="space-y-3 text-sm text-gray-600">
  //               <p>📧 Kiểm tra hộp thư đến và thư mục spam</p>
  //               <p>🔗 Nhấn vào liên kết trong email để kích hoạt</p>
  //               <p>⏰ Liên kết có hiệu lực trong 24 giờ</p>
  //             </div>

  //             {/* Resend Email */}
  //             <div className="pt-4">
  //               <p className="text-gray-600 mb-3">Không nhận được email?</p>
  //               <Button
  //                 onClick={handleResendEmail}
  //                 variant="outline"
  //                 className="w-full h-11 border-red-600 text-red-600 hover:bg-red-50"
  //                 disabled={isLoading || countdown > 0}
  //               >
  //                 {isLoading ? (
  //                   <div className="flex items-center space-x-2">
  //                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
  //                     <span>Đang gửi lại...</span>
  //                   </div>
  //                 ) : countdown > 0 ? (
  //                   `Gửi lại sau ${countdown}s`
  //                 ) : (
  //                   "Gửi lại email"
  //                 )}
  //               </Button>
  //             </div>

  //             {/* Back to Login */}
  //             <div className="pt-4">
  //               <Link 
  //                 to="/login" 
  //                 className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
  //               >
  //                 <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  //                 </svg>
  //                 Quay lại đăng nhập
  //               </Link>
  //             </div>
  //           </div>
  //         </CardContent>
  //       </Card>

  //       {/* Help */}
  //       <div className="mt-6 text-center text-sm text-gray-500">
  //         <p>Gặp vấn đề với email xác thực?</p>
  //         <div className="mt-2 space-x-4">
  //           <span className="text-red-600">📞 1900-636-467</span>
  //           <span className="text-red-600">✉️ support@fahasa.com</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Confirm;