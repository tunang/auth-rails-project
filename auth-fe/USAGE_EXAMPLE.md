# Cách sử dụng Auth API và useAuth Hook

## 📁 **Cấu trúc files**

```
src/
├── services/
│   └── auth.api.ts           # Pure API functions (chỉ return data)
├── hooks/
│   └── useAuth.ts            # Hook với toast notifications và navigation
├── schemas/
│   └── auth.schema.ts        # Zod validation schemas
└── types/
    └── index.ts              # TypeScript types
```

## 🔧 **Auth API Functions**

File `src/services/auth.api.ts` chứa các function thuần túy chỉ gọi API và return data:

```typescript
import { authApi } from '@/services/auth.api';

// Tất cả functions chỉ return response.data
const result = await authApi.login(credentials);
const user = await authApi.getCurrentUser();
const resetResult = await authApi.resetPassword(data);
```

### **Available Functions:**
- `register(credentials)` - Đăng ký user mới
- `login(credentials)` - Đăng nhập
- `logout()` - Đăng xuất
- `forgotPassword(credentials)` - Gửi email reset password
- `resetPassword(credentials)` - Reset password với token
- `confirmEmail(token)` - Xác thực email
- `resendConfirmation(email)` - Gửi lại email xác thực
- `refreshToken(refreshToken)` - Refresh access token
- `getCurrentUser()` - Lấy thông tin user hiện tại
- `updateProfile(data)` - Cập nhật profile
- `changePassword(data)` - Đổi mật khẩu
- `verifyEmail(email, token)` - Verify email từ link

### **Utility Functions:**
- `isAuthenticated()` - Check user đã login chưa
- `getAccessToken()` - Lấy access token
- `getRefreshToken()` - Lấy refresh token
- `setTokens(accessToken, refreshToken)` - Lưu tokens
- `clearTokens()` - Xóa tokens

## 🎯 **useAuth Hook**

File `src/hooks/useAuth.ts` cung cấp các function với toast notifications và navigation:

### **Cách sử dụng trong Component:**

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginRequest } from '@/schemas/auth.schema';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      // Auto navigate to "/" với toast success
    } catch (error) {
      // Error đã được handle bởi useAuth với toast error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register("password")} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
};
```

## 📝 **Ví dụ cụ thể cho từng trang**

### **1. Login Page**

```typescript
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  
  const onSubmit = async (data: LoginRequest) => {
    await login(data); // Auto toast + navigate
  };
  
  // Component JSX...
};
```

### **2. Register Page**

```typescript
import { useAuth } from '@/hooks/useAuth';

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  
  const onSubmit = async (data: RegisterRequest) => {
    await register(data); // Auto toast + navigate to /confirm
  };
  
  // Component JSX...
};
```

### **3. Forgot Password Page**

```typescript
import { useAuth } from '@/hooks/useAuth';

const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  
  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await forgotPassword(data); // Auto toast success
      setEmailSent(true);
    } catch (error) {
      // Error handled by useAuth
    }
  };
  
  // Component JSX...
};
```

### **4. Reset Password Page**

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { resetPassword, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get("token");
  
  const onSubmit = async (data: Omit<ResetPasswordRequest, 'reset_password_token'>) => {
    await resetPassword({
      ...data,
      reset_password_token: token!
    }); // Auto toast + navigate to /login
  };
  
  // Component JSX...
};
```

### **5. Confirm Email Page**

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams, useLocation } from 'react-router-dom';

const ConfirmEmailPage = () => {
  const { confirmEmail, resendConfirmation, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const token = searchParams.get("token");
  const email = location.state?.email;
  
  // Auto confirm if token in URL
  useEffect(() => {
    if (token) {
      confirmEmail(token);
    }
  }, [token]);
  
  const handleResend = async () => {
    if (email) {
      await resendConfirmation(email); // Auto toast
    }
  };
  
  // Component JSX...
};
```

## 🔐 **Protected Routes**

```typescript
import { authApi } from '@/services/auth.api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authApi.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

## 🍞 **Toast Notifications**

Toast được xử lý tự động trong `useAuth` hook:

- ✅ **Loading states**: "Đang đăng nhập...", "Đang tạo tài khoản..."
- ✅ **Success messages**: "Đăng nhập thành công!", "Email đã được gửi!"
- ✅ **Error handling**: "Email không tồn tại", "Token hết hạn"
- ✅ **Auto dismiss**: Success toasts tự động ẩn sau 4-5s
- ✅ **Error persistence**: Error toasts có thể đóng thủ công

## 🚀 **API Endpoints**

```typescript
// Auth endpoints sử dụng trong authApi
POST   /api/v1/registrations        # Register
POST   /api/v1/sessions             # Login  
DELETE /api/v1/sessions             # Logout
POST   /api/v1/passwords            # Forgot password
PUT    /api/v1/passwords            # Reset password
GET    /api/v1/confirmations        # Confirm email
POST   /api/v1/confirmations        # Resend confirmation
POST   /api/v1/refresh_token        # Refresh token
GET    /api/v1/users/me             # Get current user
PUT    /api/v1/users/me             # Update profile
PUT    /api/v1/users/password       # Change password
```

## 💡 **Best Practices**

1. **Sử dụng useAuth hook** cho UI components (có toast + navigation)
2. **Sử dụng authApi trực tiếp** cho background tasks hoặc custom logic
3. **Luôn validate** với Zod schemas trước khi gọi API
4. **Handle loading states** bằng `isLoading` từ useAuth
5. **Store tokens** tự động được handle bởi useAuth
6. **Error boundaries** để catch unexpected errors

---

**🎉 Hệ thống authentication hoàn chỉnh với toast notifications và navigation tự động!**