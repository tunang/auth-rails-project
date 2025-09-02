import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  confirmEmailRequest,
  confirmEmailSuccess,
  confirmEmailFailure,
  resendConfirmationRequest,
  resendConfirmationSuccess,
  resendConfirmationFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "../slices/authSlice";
import { api } from "@/services/api.service";
import { ApiConstant } from "@/constant/api.constant";
import { authApi } from "@/services/auth.api";
import { toast } from "sonner";
import type { 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from "@/schemas/auth.schema";
import type { ApiResponse, AuthResponse } from "@/types";

// Helper function to parse error messages
function parseErrorMessage(error: any, fallbackMessage: string): string {
  if (error.response?.data) {
    const errorData = error.response.data;
    
    // Handle error format: { status: { message }, errors: [...] }
    if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors[0];
    } else if (errorData.status?.message) {
      return errorData.status.message;
    } else if (errorData.message) {
      return errorData.message;
    }
  }
  
  return fallbackMessage;
}

// Authentication initialization saga
// function* initializeAuthSaga(): SagaIterator {
//   try {
//     const response: ApiResponse<any> = yield call(api.get, ApiConstant.users.me);
//     yield put(setUser(response.data));
//   } catch (error) {
//     // Clear tokens if user info fetch fails
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     yield put(loginFailure("Token không hợp lệ"));
//   }
// }

// Login saga
function* loginSaga(
  action: PayloadAction<LoginRequest>
): SagaIterator {
  const toastId = toast.loading("Đang đăng nhập...");
  
  try {
    const credentials = action.payload;

    const response: AuthResponse = yield call(
      authApi.login,
      credentials
    );
    
    console.log("Login API Response:", response);
    console.log("User data:", response.data);
    
    // Store tokens in localStorage
    const { access_token, refresh_token } = response;
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }

    toast.success("Đăng nhập thành công!", { id: toastId });
    
    console.log("Dispatching loginSuccess with:", response);
    yield put(
      loginSuccess(response)
    );


    // Navigate to home page
    window.location.href = "/";

  } catch (error: any) {
    const errorMessage = parseErrorMessage(error, "Email hoặc mật khẩu không chính xác.");
    
    yield put(loginFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Register saga
function* registerSaga(
  action: PayloadAction<RegisterRequest>
): SagaIterator {
  const toastId = toast.loading("Đang tạo tài khoản...");
  
  try {
    const credentials = action.payload;
    
    const response: ApiResponse<{ user: any; status: string; message: string }> = yield call(
      authApi.register,
      credentials
    );

    yield put(
      registerSuccess({ message: response.data.message })
    );

    toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.", { 
      id: toastId,
      duration: 5000 
    });



  } catch (error: any) {
    const errorMessage = parseErrorMessage(error, "Đăng ký thất bại. Vui lòng thử lại.");
    
    yield put(registerFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Logout saga
function* logoutSaga(): SagaIterator {
  const toastId = toast.loading("Đang đăng xuất...");
  
  try {
    yield call(authApi.logout);
    
    // Clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    yield put(logoutSuccess());
    toast.success("Đăng xuất thành công!", { id: toastId });

    // Navigate to login
    window.location.href = "/auth/login";

  } catch (error: any) {
    // Still clear tokens even if API call fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    yield put(logoutSuccess());
    toast.success("Đăng xuất thành công!", { id: toastId });

    // Navigate to login
    window.location.href = "/auth/login";
  }
}

// Forgot password saga
function* forgotPasswordSaga(
  action: PayloadAction<ForgotPasswordRequest>
): SagaIterator {
  const toastId = toast.loading("Đang gửi email đặt lại mật khẩu...");
  
  try {
    const credentials = action.payload;
    
    const response: ApiResponse<{ status: string; message: string }> = yield call(
      authApi.forgotPassword,
      credentials
    );

    yield put(
      forgotPasswordSuccess({ message: response.data.message })
    );

    toast.success("Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.", { 
      id: toastId,
      duration: 5000 
    });

  } catch (error: any) {
    const errorMessage = parseErrorMessage(error, "Email không tồn tại trong hệ thống.");
    
    yield put(forgotPasswordFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Reset password saga
function* resetPasswordSaga(
  action: PayloadAction<ResetPasswordRequest>
): SagaIterator {
  const toastId = toast.loading("Đang đặt lại mật khẩu...");
  
  try {
    const credentials = action.payload;
    
    const response: ApiResponse<{ status: string; message: string }> = yield call(
      authApi.resetPassword,
      credentials
    );

    yield put(
      resetPasswordSuccess({ message: response.data.message })
    );

    toast.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.", { 
      id: toastId,
      duration: 5000 
    });

    // Navigate to login
    window.location.href = "/auth/login";

  } catch (error: any) {
    const errorMessage = parseErrorMessage(error, "Token không hợp lệ hoặc đã hết hạn.");
    
    yield put(resetPasswordFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Confirm email saga
function* confirmEmailSaga(
  action: PayloadAction<{ token: string }>
): SagaIterator {
  const toastId = toast.loading("Đang xác thực email...");
  
  try {
    const { token } = action.payload;
    
    const response: ApiResponse<{ status: string; message: string }> = yield call(
      authApi.confirmEmail,
      token
    );

    yield put(
      confirmEmailSuccess({ message: response.data.message })
    );

    toast.success("Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.", { 
      id: toastId,
      duration: 5000 
    });

    // Navigate to login
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 2000);

  } catch (error: any) {
    const errorMessage = parseErrorMessage(error, "Token xác thực không hợp lệ hoặc đã hết hạn.");
    
    yield put(confirmEmailFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Resend confirmation saga
function* resendConfirmationSaga(
  action: PayloadAction<{ email: string }>
): SagaIterator {
  const toastId = toast.loading("Đang gửi lại email xác thực...");
  
  try {
    const { email } = action.payload;
    
    const response: ApiResponse<{ status: string; message: string }> = yield call(
      authApi.resendConfirmation,
      email
    );

    yield put(
      resendConfirmationSuccess({ message: response.data.message })
    );

    toast.success("Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư.", { 
      id: toastId,
      duration: 5000 
    });

  } catch (error: any) {
    const errorMessage = parseErrorMessage(error, "Không thể gửi lại email xác thực. Vui lòng thử lại.");
    
    yield put(resendConfirmationFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Refresh token saga
function* refreshTokenSaga(): SagaIterator {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response: ApiResponse<{ access_token: string; refresh_token: string }> = yield call(
      authApi.refreshToken,
      refreshToken
    );

    // Store new tokens
    const { access_token, refresh_token: newRefreshToken } = response.data;
    localStorage.setItem('access_token', access_token);
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }

    yield put(
      refreshTokenSuccess({
        access_token,
        refresh_token: newRefreshToken,
      })
    );

  } catch (error: any) {
    // Clear tokens if refresh fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    yield put(refreshTokenFailure());
    
    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
      duration: 4000
    });

    // Navigate to login
    window.location.href = "/auth/login";
  }
}

// Root auth saga
export function* authSaga(): SagaIterator {
  // yield takeLatest(initializeAuth.type, initializeAuthSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(forgotPasswordRequest.type, forgotPasswordSaga);
  yield takeLatest(resetPasswordRequest.type, resetPasswordSaga);
  yield takeLatest(confirmEmailRequest.type, confirmEmailSaga);
  yield takeLatest(resendConfirmationRequest.type, resendConfirmationSaga);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
}