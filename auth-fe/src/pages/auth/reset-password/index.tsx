import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordFormSchema, type ResetPasswordFormData } from "@/schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { resetPasswordRequest, clearMessage } from "@/store/slices/authSlice";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const { isResettingPassword, message } = useAppSelector((state) => state.auth);

  // Get token from URL parameter
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  // const password = watch("password", ""); // Removed since password requirements section was deleted

  // Clear message when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  // Set form errors from Redux message
  React.useEffect(() => {
    if (message) {
      if (message.toLowerCase().includes("password") || message.includes("mật khẩu")) {
        setError("password", { message });
      } else if (message.toLowerCase().includes("confirm") || message.includes("xác nhận")) {
        setError("confirmation_password", { message });
      } else {
        // For token errors or general errors, set as root error
        setError("root", { message });
      }
    }
  }, [message, setError]);

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Token from URL:", token);
    
    // Validate token exists
    // if (!token) {
    //   console.error("No token found in URL");
    //   setError("root", {
    //     message: "Token không hợp lệ hoặc đã hết hạn"
    //   });
    //   return;
    // }

    // Clear any existing messages
    dispatch(clearMessage());
    
    // Dispatch reset password request with token from URL
    const payload = {
      ...data,
      reset_password_token: token
    };
    
    console.log("Dispatching resetPasswordRequest with payload:", payload);
    dispatch(resetPasswordRequest(payload));
  };

  // Show error if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Về trang chủ
            </Link>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-4 pb-6">
              {/* Logo */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">BookStore</h1>
                    <p className="text-xs text-gray-500">Tri thức là sức mạnh</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-red-600">
                  Liên kết không hợp lệ
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Liên kết đặt lại mật khẩu có thể đã hết hạn hoặc đã được sử dụng.
                </p>
                
                <div className="space-y-3">
                  <Link to="/auth/forgot-password">
                    <Button className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium">
                      Yêu cầu liên kết mới
                    </Button>
                  </Link>
                  
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Quay lại đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Về trang chủ
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BookStore</h1>
                  <p className="text-xs text-gray-500">Tri thức là sức mạnh</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đặt lại mật khẩu
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Tạo mật khẩu mới cho tài khoản của bạn
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmation_password" className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <Input
                    {...register("confirmation_password")}
                    id="confirmation_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmation_password && (
                  <p className="text-sm text-red-600">{errors.confirmation_password.message}</p>
                )}
              </div>



              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
                disabled={isResettingPassword}
                onClick={() => {
                  console.log("Button clicked!");
                  console.log("Form errors:", errors);
                  console.log("isResettingPassword:", isResettingPassword);
                }}
              >
                {isResettingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>

        


              
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu?{" "}
                <Link
                  to="/login"
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;