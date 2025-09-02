export const ApiConstant = {
  auth: {
    login: "/api/v1/sessions",
    register: "/api/v1/registrations", 
    logout: "/api/v1/sessions",
    forgotPassword: "/api/v1/passwords",
    resetPassword: "/api/v1/passwords",
    confirmEmail: "/api/v1/confirmations",
    resendConfirmation: "/api/v1/confirmations",
    refreshToken: "/api/v1/refresh_token",
    profile: "/api/v1/users/me",
  },
  users: {
    me: "/api/v1/users/me",
    updateProfile: "/api/v1/users/me",
    changePassword: "/api/v1/users/password",
  },
} as const;