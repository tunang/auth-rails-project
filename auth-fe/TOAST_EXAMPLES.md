# Toast Notification Examples

## 🎨 **Visual Design**

### **Position & Layout:**
- **Vị trí**: Top-left corner
- **Màu sắc**: Success (xanh), Error (đỏ), Loading (xanh dương)
- **Icon**: Checkmark ✅, X ❌, Spinner ⏳ 
- **Close button**: X button (trắng, hover effect)

## 🎯 **Toast Types & Colors**

### **1. Success Toast (Xanh lá)**
```typescript
toast.success("Đăng nhập thành công!");
```
**Visual:**
```
┌─────────────────────────────────────┐
│ ✅ Đăng nhập thành công!             │ ← Background: #10B981 (xanh lá)
│                                  ✕  │ ← Text: white
└─────────────────────────────────────┘ ← Border: #059669
```

### **2. Error Toast (Đỏ)**
```typescript
toast.error("Email has already been taken");
```
**Visual:**
```
┌─────────────────────────────────────┐
│ ❌ Email has already been taken      │ ← Background: #EF4444 (đỏ)
│                                  ✕  │ ← Text: white  
└─────────────────────────────────────┘ ← Border: #DC2626
```

### **3. Loading Toast (Xanh dương)**
```typescript
toast.loading("Đang đăng nhập...");
```
**Visual:**
```
┌─────────────────────────────────────┐
│ ⏳ Đang đăng nhập...                 │ ← Background: #3B82F6 (xanh dương)
│                                  ✕  │ ← Text: white
└─────────────────────────────────────┘ ← Border: #2563EB
```

## 🔧 **Configuration Details**

### **App.tsx Setup:**
```typescript
<Toaster 
  position="top-left"          // Vị trí bên trái
  richColors                   // Enable rich colors
  expand={true}                // Expand on hover
  closeButton                  // Show close button
  toastOptions={{
    duration: 4000,            // 4 seconds auto-dismiss
    style: {
      fontSize: '14px',
      fontWeight: '500',
    },
    success: {
      style: {
        background: '#10B981',  // Green background
        color: 'white',
        border: '1px solid #059669',
      },
    },
    error: {
      style: {
        background: '#EF4444',  // Red background
        color: 'white', 
        border: '1px solid #DC2626',
      },
    },
    loading: {
      style: {
        background: '#3B82F6',  // Blue background
        color: 'white',
        border: '1px solid #2563EB',
      },
    },
  }}
/>
```

### **CSS Styling (index.css):**
```css
/* Success Toast */
[data-sonner-toast][data-type="success"] {
  background: #10B981 !important;
  color: white !important;
  border: 1px solid #059669 !important;
}

/* Error Toast */
[data-sonner-toast][data-type="error"] {
  background: #EF4444 !important;
  color: white !important;
  border: 1px solid #DC2626 !important;
}

/* Loading Toast */
[data-sonner-toast][data-type="loading"] {
  background: #3B82F6 !important;
  color: white !important;
  border: 1px solid #2563EB !important;
}
```

## 📱 **Authentication Flow Examples**

### **Login Success Flow:**
```
1. User clicks "Đăng nhập"
2. Loading toast: "Đang đăng nhập..." (xanh dương)
3. API success → Replace with: "Đăng nhập thành công!" (xanh lá)
4. Auto navigate to home
```

### **Register Error Flow:**
```
1. User clicks "Đăng ký"  
2. Loading toast: "Đang tạo tài khoản..." (xanh dương)
3. API error → Replace with: "Email has already been taken" (đỏ)
4. Show field error under email input
```

### **Forgot Password Success Flow:**
```
1. User clicks "Gửi email"
2. Loading toast: "Đang gửi email đặt lại mật khẩu..." (xanh dương)
3. API success → Replace with: "Email đặt lại mật khẩu đã được gửi!" (xanh lá)
```

## 🎨 **Visual Hierarchy**

### **Color Meanings:**
- 🟢 **Green (#10B981)**: Success, completion, positive actions
- 🔴 **Red (#EF4444)**: Errors, warnings, failed actions
- 🔵 **Blue (#3B82F6)**: Loading, in-progress, information

### **Typography:**
- **Font size**: 14px
- **Font weight**: 500 (medium)
- **Color**: White text on colored background
- **Font family**: Inter (system fallback)

### **Spacing & Layout:**
- **Border radius**: 8px
- **Shadow**: Subtle shadow for depth
- **Padding**: Standard toast padding
- **Position**: Top-left, stacked vertically

## 🔄 **Toast Lifecycle**

### **Loading → Success:**
```typescript
// In saga
const toastId = toast.loading("Đang đăng nhập...");

// On success
toast.success("Đăng nhập thành công!", { id: toastId });
```

### **Loading → Error:**
```typescript
// In saga  
const toastId = toast.loading("Đang đăng nhập...");

// On error
toast.error("Email hoặc mật khẩu không chính xác.", { id: toastId });
```

## 🎯 **User Experience**

### **Benefits:**
- ✅ **Clear visual feedback** với màu sắc rõ ràng
- ✅ **Consistent positioning** ở top-left
- ✅ **Auto-dismiss** sau 4 giây
- ✅ **Manual close** với close button
- ✅ **Loading states** cho better UX
- ✅ **Icon indicators** for quick recognition

### **Accessibility:**
- ✅ **High contrast** white text on colored backgrounds
- ✅ **Close button** for manual dismissal
- ✅ **Keyboard accessible** (ESC to close)
- ✅ **Screen reader friendly** with proper ARIA labels

---

**🎉 Toast notification system với màu sắc rõ ràng và positioning bên trái!**