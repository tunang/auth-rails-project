# Redux Auth System - Hướng dẫn sử dụng

## 📁 **Cấu trúc Redux**

```
src/
├── store/
│   ├── index.ts                    # Store configuration
│   ├── slices/
│   │   └── authSlice.ts           # Auth slice với actions & reducers
│   └── sagas/
│       ├── index.ts               # Root saga
│       └── authSaga.ts            # Auth side effects
├── hooks/
│   └── useAppDispatch.ts          # Typed hooks cho Redux
├── constant/
│   └── api.constant.ts            # API endpoints
└── services/
    └── auth.api.ts                # Pure API functions
```

## 🔧 **Cách sử dụng trong Components**

### **1. Login Page Example**

```typescript
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { loginRequest, clearMessage } from "@/store/slices/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, message } = useAppSelector((state) => state.auth);

  const onSubmit = (data: LoginRequest) => {
    // Clear previous messages
    dispatch(clearMessage());
    
    // Dispatch login request (saga will handle API call + toast)
    dispatch(loginRequest(data));
  };

  return (
    <button disabled={isLoading}>
      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
    </button>
  );
};
```

### **2. Register Page Example**

```typescript
import { registerRequest, clearMessage } from "@/store/slices/authSlice";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const { isRegistering, message } = useAppSelector((state) => state.auth);

  const onSubmit = (data: RegisterRequest) => {
    dispatch(clearMessage());
    dispatch(registerRequest(data)); // Auto navigate to confirm page
  };

  return (
    <button disabled={isRegistering}>
      {isRegistering ? "Đang tạo tài khoản..." : "Đăng ký"}
    </button>
  );
};
```

### **3. Forgot Password Example**

```typescript
import { forgotPasswordRequest } from "@/store/slices/authSlice";

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const { isForgotPassword, message } = useAppSelector((state) => state.auth);

  const onSubmit = (data: ForgotPasswordRequest) => {
    dispatch(forgotPasswordRequest(data));
  };

  return (
    <button disabled={isForgotPassword}>
      {isForgotPassword ? "Đang gửi email..." : "Gửi email"}
    </button>
  );
};
```

### **4. Reset Password Example**

```typescript
import { resetPasswordRequest } from "@/store/slices/authSlice";
import { useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const { isResettingPassword } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  const onSubmit = (data: Omit<ResetPasswordRequest, 'reset_password_token'>) => {
    const token = searchParams.get("token");
    
    dispatch(resetPasswordRequest({
      ...data,
      reset_password_token: token!
    }));
  };

  return (
    <button disabled={isResettingPassword}>
      {isResettingPassword ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
    </button>
  );
};
```

### **5. Confirm Email Example**

```typescript
import { confirmEmailRequest, resendConfirmationRequest } from "@/store/slices/authSlice";

const ConfirmEmailPage = () => {
  const dispatch = useAppDispatch();
  const { 
    isConfirmingEmail, 
    isResendingConfirmation, 
    message 
  } = useAppSelector((state) => state.auth);

  // Auto confirm if token in URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      dispatch(confirmEmailRequest({ token }));
    }
  }, []);

  const handleResend = () => {
    const email = searchParams.get("email");
    if (email) {
      dispatch(resendConfirmationRequest({ email }));
    }
  };

  return (
    <div>
      {isConfirmingEmail && <p>Đang xác thực...</p>}
      
      <button 
        onClick={handleResend}
        disabled={isResendingConfirmation}
      >
        {isResendingConfirmation ? "Đang gửi..." : "Gửi lại email"}
      </button>
    </div>
  );
};
```

## 🔐 **Protected Routes với Redux**

```typescript
import { useAppSelector } from "@/hooks/useAppDispatch";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
```

## 🔄 **Auth Initialization**

```typescript
// App.tsx hoặc layout component
import { useEffect } from "react";
import { initializeAuth } from "@/store/slices/authSlice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      dispatch(initializeAuth()); // Will fetch user profile
    }
  }, [dispatch]);

  return <AppRoutes />;
};
```

## 📊 **Available Redux State**

```typescript
interface AuthState {
  user: User | null;                    // Current user info
  token: string | null;                 // Access token
  refreshToken: string | null;          // Refresh token
  isLoading: boolean;                   // General loading (login, logout)
  message: string | null;               // Success/error messages
  isAuthenticated: boolean;             // Auth status
  
  // Specific loading states
  isRegistering: boolean;               // Register loading
  isResettingPassword: boolean;         // Reset password loading
  isForgotPassword: boolean;           // Forgot password loading
  isConfirmingEmail: boolean;          // Email confirmation loading
  isResendingConfirmation: boolean;    // Resend confirmation loading
}
```

## 🎯 **Available Actions**

### **Auth Actions**
```typescript
// Initialize & User
initializeAuth()                      // Initialize auth from token
setUser(user)                        // Set user info
clearAuth()                          // Clear all auth state

// Login
loginRequest(credentials)            // Start login
loginSuccess({ user, access_token, refresh_token })
loginFailure(errorMessage)

// Register  
registerRequest(credentials)         // Start register
registerSuccess({ message })
registerFailure(errorMessage)

// Logout
logoutRequest()                      // Start logout
logoutSuccess()
logoutFailure(errorMessage)

// Forgot Password
forgotPasswordRequest(credentials)   // Send reset email
forgotPasswordSuccess({ message })
forgotPasswordFailure(errorMessage)

// Reset Password
resetPasswordRequest(credentials)    // Reset with token
resetPasswordSuccess({ message })
resetPasswordFailure(errorMessage)

// Confirm Email
confirmEmailRequest({ token })       // Confirm email
confirmEmailSuccess({ message })
confirmEmailFailure(errorMessage)

// Resend Confirmation
resendConfirmationRequest({ email }) // Resend confirmation
resendConfirmationSuccess({ message })
resendConfirmationFailure(errorMessage)

// Refresh Token
refreshTokenRequest()                // Refresh access token
refreshTokenSuccess({ access_token, refresh_token })
refreshTokenFailure()

// Utilities
clearMessage()                       // Clear error/success messages
```

## 🍞 **Toast Notifications**

Toast được xử lý tự động trong **authSaga.ts**:

- ✅ **Loading**: "Đang đăng nhập...", "Đang tạo tài khoản..."
- ✅ **Success**: "Đăng nhập thành công!", "Email đã được gửi!"
- ✅ **Error**: Parse từ API response hoặc default messages
- ✅ **Navigation**: Tự động redirect sau success operations

## 🔗 **API Integration**

Saga sử dụng `authApi` từ `services/auth.api.ts`:

```typescript
// authSaga.ts
const response = yield call(authApi.login, credentials);
const response = yield call(authApi.register, credentials);
const response = yield call(authApi.forgotPassword, credentials);
// etc...
```

## 🚀 **Token Management**

- **Automatic**: Tokens được lưu/xóa tự động trong saga
- **localStorage**: Access & refresh tokens
- **Refresh**: Auto refresh khi token hết hạn
- **Cleanup**: Clear tokens khi logout hoặc refresh fail

## 💡 **Best Practices**

1. **Sử dụng `useAppSelector`** để lấy auth state
2. **Sử dụng `useAppDispatch`** để dispatch actions
3. **Clear messages** trước khi dispatch new actions
4. **Handle loading states** với specific boolean flags
5. **Auto navigation** được xử lý trong saga
6. **Error handling** thông qua Redux message state

## 🔄 **Flow Example: Login Process**

```
1. User submits form → dispatch(loginRequest(credentials))
2. Saga intercepts → calls authApi.login()  
3. Success → Save tokens + dispatch(loginSuccess())
4. Toast success + navigate to home
5. Error → dispatch(loginFailure()) + toast error
```

---

**🎉 Hệ thống Redux authentication hoàn chỉnh với saga side effects!**