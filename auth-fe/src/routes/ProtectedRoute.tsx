import type { RootState } from "@/store";
import { initializeAuth } from "@/store/slices/authSlice";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({
  allowedRoles,
  children
}: {
  allowedRoles: string[];
  children: ReactNode;
}) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  // This should rarely happen since App.tsx handles initial loading
  // But keep it as a safety check
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // User not authenticated
  if (!user) {
    console.log("No user found, redirecting to login");
    // return <Navigate to="/login" replace />;
  }

  // User doesn't have required role
  if (!allowedRoles.includes(user?.role || "")) {
    console.log("Access denied. User role:", user?.role, "Required:", allowedRoles);
    // return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

// if (!user && !isLoading) {
//   console.log("initializeAuth")
//   dispatch(initializeAuth());
//   console.log(user)
// }

// if (!allowedRoles.includes(user?.role || "") && !isLoading) {
//   console.log("isLoading", isLoading)
//   console.log(allowedRoles.includes(user?.role || ""))
//   return <Navigate to="/" />;
// }

// console.log(user)

export default ProtectedRoute;
