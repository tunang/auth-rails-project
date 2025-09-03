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
import { authApi } from "@/services/auth.api";
import { toast } from "sonner";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/schemas/auth.schema";
import type { ApiResponse, AuthResponse, ErrorResponse } from "@/types";
import type { User } from "@/types/user.type";

// Helper function to parse error messages
function parseErrorMessage(error: any, fallbackMessage: string): string {
  if (error.response?.data) {
    const errorData = error.response.data;

    // Handle error format: { status: { message }, errors: [...] }
    if (
      errorData.errors &&
      Array.isArray(errorData.errors) &&
      errorData.errors.length > 0
    ) {
      return errorData.errors[0];
    } else if (errorData.status?.message) {
      return errorData.status.message;
    } else if (errorData.message) {
      return errorData.message;
    }
  }

  return fallbackMessage;
}

// Login saga
function* loginSaga(action: PayloadAction<LoginRequest>): SagaIterator {
  try {
    const credentials = action.payload;

    const response: AuthResponse = yield call(authApi.login, credentials);

    // Store tokens in localStorage
    const { access_token, refresh_token } = response;
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }

    yield put(loginSuccess(response));
  } catch (error: ApiResponse<null> | any) {
    console.log(error.response);
    const errorMessage =
      error.response.data.status.message ||
      "Email hoặc mật khẩu không chính xác.";
    yield put(loginFailure(errorMessage));
  }
}

// Register saga
function* registerSaga(action: PayloadAction<RegisterRequest>): SagaIterator {
  try {
    const credentials = action.payload;

    const response: ApiResponse<User> = yield call(
      authApi.register,
      credentials
    );
    yield put(registerSuccess(response.status.message));
  } catch (error: ApiResponse<null> | any) {
    const errorMessage =
      error.response.data.status.message ||
      "Đăng ký thất bại. Vui lòng thử lại.";
    yield put(registerFailure(errorMessage));
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

  try {
    const credentials = action.payload;

    const response: ApiResponse<null> =
      yield call(authApi.forgotPassword, credentials);

    yield put(forgotPasswordSuccess(response.status.message));

  
  } catch (error: any) {
    const errorMessage = parseErrorMessage(
      error,
      "Email không tồn tại trong hệ thống."
    );

    yield put(forgotPasswordFailure(errorMessage));
  }
}

// Reset password saga
function* resetPasswordSaga(
  action: PayloadAction<ResetPasswordRequest>
): SagaIterator {
  const toastId = toast.loading("Đang đặt lại mật khẩu...");

  try {
    const credentials = action.payload;

    const response: ApiResponse<{ status: string; message: string }> =
      yield call(authApi.resetPassword, credentials);

    yield put(resetPasswordSuccess({ message: response.data.message }));

    toast.success(
      "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.",
      {
        id: toastId,
        duration: 5000,
      }
    );

    // Navigate to login
    window.location.href = "/auth/login";
  } catch (error: any) {
    const errorMessage = parseErrorMessage(
      error,
      "Token không hợp lệ hoặc đã hết hạn."
    );

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

    const response: ApiResponse<{ status: string; message: string }> =
      yield call(authApi.confirmEmail, token);

    yield put(confirmEmailSuccess({ message: response.data.message }));

    toast.success(
      "Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.",
      {
        id: toastId,
        duration: 5000,
      }
    );

    // Navigate to login
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 2000);
  } catch (error: any) {
    const errorMessage = parseErrorMessage(
      error,
      "Token xác thực không hợp lệ hoặc đã hết hạn."
    );

    yield put(confirmEmailFailure(errorMessage));
    toast.error(errorMessage, { id: toastId });
  }
}

// Resend confirmation saga
function* resendConfirmationSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const email = action.payload;

    const response: ApiResponse<null> = yield call(
      authApi.resendConfirmation,
      email
    );

    yield put(resendConfirmationSuccess(response.status.message));
  } catch (error: ApiResponse<null> | any) {
    yield put(resendConfirmationFailure(error.response.data.status.message));
  }
}

// Refresh token saga
function* refreshTokenSaga(): SagaIterator {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response: ApiResponse<{
      access_token: string;
      refresh_token: string;
    }> = yield call(authApi.refreshToken, refreshToken);

    // Store new tokens
    const { access_token, refresh_token: newRefreshToken } = response.data;
    localStorage.setItem("access_token", access_token);
    if (newRefreshToken) {
      localStorage.setItem("refresh_token", newRefreshToken);
    }

    yield put(
      refreshTokenSuccess({
        access_token,
        refresh_token: newRefreshToken,
      })
    );
  } catch (error: any) {
    // Clear tokens if refresh fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    yield put(refreshTokenFailure());

    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
      duration: 4000,
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
