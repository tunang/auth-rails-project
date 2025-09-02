import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema, type ForgotPasswordRequest } from "@/schemas/auth.schema";
import { authApi } from "@/services/auth.api";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    setEmailValue(data.email);
    
    try {
      const response = await authApi.forgotPassword(data);
      if (response.status.code === 200) {
        setEmailSent(true);
      } else {
        // Show API error
        setError("root", {
          message: "Email không tồn tại trong hệ thống"
        });
      }
    } catch (error) {
      setError("root", {
        message: "Đã có lỗi xảy ra. Vui lòng thử lại."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="bg-red-600 text-white p-3 rounded-lg">
              <svg
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-red-600">FAHASA</span>
              <span className="text-sm text-gray-500">Thế giới trong tầm tay</span>
            </div>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-xl border-0">
          {!emailSent ? (
            <>
              <CardHeader className="space-y-1 bg-red-600 text-white rounded-t-lg py-4">
                <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu?</CardTitle>
                <CardDescription className="text-red-100 text-center">
                  Nhập email để nhận liên kết đặt lại mật khẩu
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Global Error */}
                  {errors.root && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{errors.root.message}</p>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email đăng ký
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      {...register("email")}
                      className={`h-11 border-2 focus:border-red-500 ${
                        errors.email ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn. 
                          Vui lòng kiểm tra cả thư mục spam/junk mail.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang gửi email...</span>
                      </div>
                    ) : (
                      "Gửi liên kết đặt lại"
                    )}
                  </Button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại đăng nhập
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 bg-green-600 text-white rounded-t-lg py-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-full p-3">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Email đã được gửi!</CardTitle>
                <CardDescription className="text-green-100 text-center">
                  Kiểm tra hộp thư của bạn để đặt lại mật khẩu
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến:
                  </p>
                                  <div className="bg-gray-100 p-3 rounded-md">
                  <p className="font-medium text-gray-800">{emailValue}</p>
                </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• Kiểm tra thư mục spam/junk mail nếu không thấy email</p>
                    <p>• Liên kết sẽ hết hạn sau 15 phút</p>
                    <p>• Nhấn vào liên kết để đặt lại mật khẩu mới</p>
                  </div>

                  {/* Resend Email */}
                  <div className="pt-4">
                    <p className="text-gray-600 mb-3">Không nhận được email?</p>
                    <Button
                      onClick={handleResendEmail}
                      variant="outline"
                      className="w-full h-11 border-red-600 text-red-600 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          <span>Đang gửi lại...</span>
                        </div>
                      ) : (
                        "Gửi lại email"
                      )}
                    </Button>
                  </div>

                  {/* Back to Login */}
                  <div className="pt-4">
                    <Link 
                      to="/login" 
                      className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Help */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Cần hỗ trợ? Liên hệ với chúng tôi</p>
          <div className="mt-2 space-x-4">
            <span className="text-red-600">📞 1900-636-467</span>
            <span className="text-red-600">✉️ support@fahasa.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;