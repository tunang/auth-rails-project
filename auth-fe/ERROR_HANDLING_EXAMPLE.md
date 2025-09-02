# Error Handling Examples

## 📋 **API Error Format**

Hệ thống hiện tại support các format error sau:

### **1. Standard Error Format (từ Rails API)**
```json
{
    "status": {
        "code": 422,
        "message": "User creation failed"
    },
    "errors": [
        "Email has already been taken"
    ]
}
```

### **2. Alternative Error Formats**
```json
// Format 1: Direct message
{
    "message": "Invalid credentials"
}

// Format 2: Status message only
{
    "status": {
        "message": "Validation failed"
    }
}

// Format 3: Nested errors object
{
    "errors": {
        "email": ["has already been taken"],
        "password": ["is too short"]
    }
}
```

## 🔧 **Error Parsing Logic**

Helper function trong `authSaga.ts`:

```typescript
function parseErrorMessage(error: any, fallbackMessage: string): string {
  if (error.response?.data) {
    const errorData = error.response.data;
    
    // Priority 1: Array errors format
    if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors[0]; // "Email has already been taken"
    } 
    // Priority 2: Status message
    else if (errorData.status?.message) {
      return errorData.status.message; // "User creation failed"
    } 
    // Priority 3: Direct message
    else if (errorData.message) {
      return errorData.message; // "Invalid credentials"
    }
  }
  
  return fallbackMessage; // Default fallback
}
```

## 🎯 **Validation Error Display**

### **Register Page Error Handling:**

```typescript
// Component logic
React.useEffect(() => {
  if (message) {
    // Handle specific validation errors
    if (message.toLowerCase().includes("email") || message.includes("taken")) {
      setError("email", { message }); // Show error under email field
    } else if (message.toLowerCase().includes("name") || message.includes("tên")) {
      setError("name", { message }); // Show error under name field
    } else if (message.toLowerCase().includes("password") || message.includes("mật khẩu")) {
      setError("password", { message }); // Show error under password field
    }
    // For general errors, don't set specific field errors
  }
}, [message, setError]);
```

**Result:**
- ✅ **"Email has already been taken"** → Shows under email input field
- ✅ **"Password is too short"** → Shows under password input field  
- ✅ **"Name can't be blank"** → Shows under name input field
- ✅ **"Server error"** → Shows as general error message

## 📱 **UI Examples**

### **Success Case:**
```
Input: Valid registration data
API Response: Success
UI: Toast "Đăng ký thành công!" + Navigate to confirm page
```

### **Field Validation Error:**
```
Input: Existing email
API Response: {
  "status": { "code": 422, "message": "User creation failed" },
  "errors": ["Email has already been taken"]
}
UI: Error appears under email field
Toast: "Email has already been taken"
```

### **General Error:**
```
Input: Any data
API Response: {
  "status": { "code": 500, "message": "Server error" }
}
UI: General error message below form
Toast: "Server error"
```

## 🔍 **Testing Examples**

### **Test 1: Email Already Taken**
```bash
# API Response
{
    "status": {
        "code": 422,
        "message": "User creation failed"
    },
    "errors": [
        "Email has already been taken"
    ]
}

# Expected UI
- Toast: "Email has already been taken"
- Field Error: Under email input
- Form: Stays on register page
```

### **Test 2: Multiple Validation Errors**
```bash
# API Response
{
    "status": {
        "code": 422,
        "message": "Validation failed"
    },
    "errors": [
        "Email has already been taken",
        "Password is too short"
    ]
}

# Expected UI
- Toast: "Email has already been taken" (first error)
- Field Error: Under email input (first error matching email)
- Form: Stays on register page
```

### **Test 3: Server Error**
```bash
# API Response
{
    "status": {
        "code": 500,
        "message": "Internal server error"
    }
}

# Expected UI
- Toast: "Internal server error"
- General Error: Below submit button
- Form: Stays on register page
```

## 🎨 **Error Message Mapping**

| API Error Message | UI Field Target | Toast Message |
|------------------|-----------------|---------------|
| "Email has already been taken" | email field | Same message |
| "Email is invalid" | email field | Same message |
| "Password is too short" | password field | Same message |
| "Name can't be blank" | name field | Same message |
| "Server error" | general error | Same message |
| "Invalid credentials" | general error | Same message |

## 🚨 **Error Priority**

1. **Field-specific errors** → Show under respective input fields
2. **General errors** → Show as general message below form
3. **Toast notifications** → Always show for user feedback
4. **Form state** → Keep user on current page for corrections

---

**✅ Error handling system hoàn chỉnh với priority và fallback logic!**