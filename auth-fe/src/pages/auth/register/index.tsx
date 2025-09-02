import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterRequest } from "@/schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { registerRequest, clearMessage } from "@/store/slices/authSlice";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const { isRegistering, message } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    // Clear any existing messages
    dispatch(clearMessage());
    
    // Dispatch register request
    dispatch(registerRequest(data));
  };

  // Clear message when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  // Set form errors from Redux message
  React.useEffect(() => {
    if (message) {
      // Handle specific validation errors
      if (message.toLowerCase().includes("email") || message.includes("taken")) {
        setError("email", { message });
      } else if (message.toLowerCase().includes("name") || message.includes("tên")) {
        setError("name", { message });
      } else if (message.toLowerCase().includes("password") || message.includes("mật khẩu")) {
        setError("password", { message });
      }
      // For general errors, don't set specific field errors
    }
  }, [message, setError]);

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
                Đăng ký tài khoản
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Tạo tài khoản mới để khám phá thế giới sách
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Họ và tên *
                </label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="h-12"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="h-12"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu"
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
                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <Input
                    {...register("password_confirmation")}
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
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
                {errors.password_confirmation && (
                  <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
                disabled={isRegistering}
              >
                {isRegistering ? "Đang tạo tài khoản..." : "Đăng ký"}
              </Button>

              {/* General Error Message - only show if not a field-specific error */}
              {message && 
               !message.toLowerCase().includes("email") && 
               !message.includes("taken") &&
               !message.toLowerCase().includes("name") && 
               !message.includes("tên") && 
               !message.toLowerCase().includes("password") && 
               !message.includes("mật khẩu") && (
                <div className="text-center">
                  <p className="text-sm text-red-600">{message}</p>
                </div>
              )}
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
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

export default RegisterPage;