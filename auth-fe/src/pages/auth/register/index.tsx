import React, { useState } from "react";
import { Link } from "react-router-dom"; // chỉ Link từ react-router-dom
import { Eye, EyeOff, ArrowLeft, Lock, User, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterRequest } from "@/schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { registerRequest, clearMessage, resendConfirmationRequest } from "@/store/slices/authSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { message, isLoading } = useAppSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisted, setIsRegisted] = useState(false);

  const form = useForm<RegisterRequest>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    if (isRegisted) {
      dispatch(resendConfirmationRequest(data.email));
    }

    if(!isRegisted) {
      dispatch(registerRequest(data));
    }
  };

  // Clear message when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);


  React.useEffect(() => {
    if (message === "user_created_successfully") {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.", { 
        duration: 5000 
      });
      setIsRegisted(true);
    }

    if (message === "user_creation_failed") {
      toast.error("Đăng ký thất bại! Email đã tồn tại. Vui lòng thử lại.", { 
        duration: 5000 
      });
      setIsRegisted(false);
    }

    if (message === "confirmation_email_failed") {
      toast.error("Email không hợp lệ. Vui lòng thử lại.", { 
        duration: 5000 
      });
    }

    if (message === "confirmation_email_sent") {
      toast.success("Email đã được gửi lại. Vui lòng kiểm tra hộp thư.", { 
        duration: 5000 
      });
    }
  }, [message, navigate]);



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
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đăng ký tài khoản
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Tạo tài khoản mới để khám phá thế giới sách
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Nhập họ và tên"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MailCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Nhập email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {!isLoading && !isRegisted && "Đăng ký"}
                  {isLoading && "Đang đăng ký..."}
                  {isRegisted && "Gửi lại email"}
                </Button>
              </form>
            </Form>
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
