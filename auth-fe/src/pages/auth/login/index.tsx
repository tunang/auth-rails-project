import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Book, MailCheck, Lock } from "lucide-react";
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
import {
  loginSchema,
  registerSchema,
  type LoginRequest,
} from "@/schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { loginRequest, clearMessage } from "@/store/slices/authSlice";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, message } = useAppSelector((state) => state.auth);

  const form = useForm<LoginRequest>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    dispatch(loginRequest(data));
  };

  React.useEffect(() => {
    if (message === "invalid_credentials") {
      toast.error("Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại.", {
        duration: 5000,
      });
    }

    if (message === "login_success") {
      toast.success("Đăng nhập thành công", {
        duration: 5000,
      });
      navigate("/");
    }
  }, [message]);

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

            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đăng nhập
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
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
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {!isLoading ? "Đăng nhập" : "Đang đăng nhập..."}
                </Button>
              </form>
            </Form>
            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
