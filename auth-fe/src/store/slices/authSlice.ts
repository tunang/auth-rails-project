import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/schemas/auth.schema";
import type { AuthResponse } from "@/types";
import type { User } from "@/types/user.type";

interface AuthState {
  user: User | null;
  message: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  message: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state, action: PayloadAction<LoginRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      console.log(action.payload.data);
      state.isLoading = false;
      state.user = action.payload.data;
      state.isAuthenticated = true;
      state.message = action.payload.status.message;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Register actions
    registerRequest: (state, action: PayloadAction<RegisterRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    // Logout actions
    logoutRequest: (state) => {
      state.isLoading = true;
      state.message = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.message = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    // Forgot password actions
    forgotPasswordRequest: (
      state,
      action: PayloadAction<ForgotPasswordRequest>
    ) => {
      state.isLoading = true;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    // Reset password actions
    resetPasswordRequest: (
      state,
      action: PayloadAction<ResetPasswordRequest>
    ) => {
      state.isLoading = true;
      state.message = null;
    },
    resetPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    // Confirm email actions
    confirmEmailRequest: (state, action: PayloadAction<{ token: string }>) => {
      state.isLoading = true;
      state.message = null;
    },
    confirmEmailSuccess: (
      state,
      action: PayloadAction<string>
    ) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    confirmEmailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    // Resend confirmation actions
    resendConfirmationRequest: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.message = null;
    },
    resendConfirmationSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    resendConfirmationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    // Refresh token actions
    refreshTokenRequest: (state) => {
      state.isLoading = true;
    },
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{ access_token: string; refresh_token?: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
    },
    refreshTokenFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Clear message
    clearMessage: (state) => {
      state.message = null;
    },

    // Clear all auth state
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.message = null;
    },
  },
});

export const {
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
  clearMessage,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
