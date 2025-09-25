import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import {
  initializeAuth,
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
  setUser,

} from "../slices/authSlice";
import { toast } from "sonner";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/schemas/auth.schema";
import type { AuthResponse, SingleResponse } from "@/types";
import type { User } from "@/types/user.type";
import { authApi } from "@/services/auth.api";




// Authentication initialization saga
function* initializeAuthSaga(): SagaIterator {
  try {
    const response : SingleResponse<User> = yield call(authApi.getCurrentUser);
   
    yield put(setUser(response.data as User));
  } catch (error: SingleResponse<null> | any) {
    const errorMessage =
      error.response.data.status.message ||
      "Email hoặc mật khẩu không chính xác.";
    yield put(loginFailure(errorMessage));
  }
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
  } catch (error: SingleResponse<null> | any) {
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

    const response: SingleResponse<User> = yield call(
      authApi.register,
      credentials
    );
    yield put(registerSuccess(response.status.message));
  } catch (error: SingleResponse<null> | any) {
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

    const response: SingleResponse<null> = yield call(
      authApi.forgotPassword,
      credentials
    );

    yield put(forgotPasswordSuccess(response.status.message));
  } catch (error: SingleResponse<null> | any) {
    const errorMessage =
      error.response.data.status.message ||
      "Đăng ký thất bại. Vui lòng thử lại.";

    yield put(forgotPasswordFailure(errorMessage));
  }
}

// Reset password saga
function* resetPasswordSaga(
  action: PayloadAction<ResetPasswordRequest>
): SagaIterator {
  try {
    const credentials = action.payload;

    const response: SingleResponse<null> = yield call(
      authApi.resetPassword,
      credentials
    );

    yield put(resetPasswordSuccess(response.status.message));
  } catch (error: SingleResponse<null> | any) {
    const errorMessage =
      error.response.data.status.message ||
      "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";

    yield put(resetPasswordFailure(errorMessage));
  }
}

// Confirm email saga
function* confirmEmailSaga(
  action: PayloadAction<{ token: string }>
): SagaIterator {
  try {
    const { token } = action.payload;

    const response: SingleResponse<null> = yield call(authApi.confirmEmail, token);

    yield put(confirmEmailSuccess(response.status.message));

  } catch (error: SingleResponse<null> | any) {
    const errorMessage =
      error.response.data.status.message ||
      "Token xác thực không hợp lệ hoặc đã hết hạn.";

    yield put(confirmEmailFailure(errorMessage));
  }
}

// Resend confirmation saga
function* resendConfirmationSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const email = action.payload;

    const response: SingleResponse<null> = yield call(
      authApi.resendConfirmation,
      email
    );

    yield put(resendConfirmationSuccess(response.status.message));
  } catch (error: SingleResponse<null> | any) {
    yield put(resendConfirmationFailure(error.response.data.status.message));
  }
}

// Refresh token saga
// function* refreshTokenSaga(): SagaIterator {
//   try {
//     const refreshToken = localStorage.getItem("refresh_token");
//     if (!refreshToken) {
//       throw new Error("No refresh token available");
//     }

//     const response: SingleResponse<{
//       access_token: string;
//       refresh_token: string;
//     }> = yield call(authApi.refreshToken, refreshToken);

//     // Store new tokens
//     const { access_token, refresh_token: newRefreshToken } = response.data;
//     localStorage.setItem("access_token", access_token);
//     if (newRefreshToken) {
//       localStorage.setItem("refresh_token", newRefreshToken);
//     }

//     yield put(
//       refreshTokenSuccess({
//         access_token,
//         refresh_token: newRefreshToken,
//       })
//     );
//   } catch (error: any) {
//     // Clear tokens if refresh fails
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");

//     yield put(refreshTokenFailure());

//     toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
//       duration: 4000,
//     });

//     // Navigate to login
//     window.location.href = "/auth/login";
//   }
// }

// Root auth saga
export function* authSaga(): SagaIterator {
  yield takeLatest(initializeAuth.type, initializeAuthSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(forgotPasswordRequest.type, forgotPasswordSaga);
  yield takeLatest(resetPasswordRequest.type, resetPasswordSaga);
  yield takeLatest(confirmEmailRequest.type, confirmEmailSaga);
  yield takeLatest(resendConfirmationRequest.type, resendConfirmationSaga);
  // yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
}
