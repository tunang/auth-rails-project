import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  forgotPasswordSchema,
  loginSchema,
  type ForgotPasswordRequest,
  type LoginRequest,
} from "@/schemas/auth.schema";
import { Form } from "@/components/ui/form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MailCheck } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { forgotPasswordRequest } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { isLoading, message } = useAppSelector((state) => state.auth);

  const form = useForm<ForgotPasswordRequest>({
    mode: "onTouched",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    dispatch(forgotPasswordRequest(data));
  };

  React.useEffect(() => {
    if (message === "email_not_found") {
      toast.error("Email không tồn tại trong hệ thống.", {
        duration: 5000,
      });
    }

    if (message === "reset_email_sent") {
      toast.success("Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.", {
        duration: 5000,
      });
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="bg-red-600 text-white p-3 rounded-lg">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.21 2.28-.71 3.33-1.36C16.97 24.29 20.16 21.14 22 17c0-5.55-3.84-10-9-11zm0 2.18c4.16.79 7 3.7 7 7.82 0 4.12-2.84 7.03-7 7.82V4.18z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-red-600">FAHASA</span>
              <span className="text-sm text-gray-500">
                Thế giới trong tầm tay
              </span>
            </div>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-xl border-0 py-0">
          <>
            <CardHeader className="space-y-1 bg-red-600 text-white rounded-t-lg py-4">
              <CardTitle className="text-2xl font-bold text-center">
                Quên mật khẩu?
              </CardTitle>
              <CardDescription className="text-red-100 text-center">
                Nhập email để nhận liên kết đặt lại mật khẩu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
                    disabled={isLoading}
                  >
                    {!isLoading ? "Gửi liên kết" : "Đang gửi liên kết..."}
                  </Button>
                </form>
              </Form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Quay lại đăng nhập
                </Link>
              </div>
            </CardContent>
          </>
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
