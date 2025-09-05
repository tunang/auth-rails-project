import type { RootState } from "@/store";
import { initializeAuth } from "@/store/slices/authSlice";
import { type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({allowedRoles, children}: {allowedRoles: string[], children: ReactNode}) => {
  const {user, isLoading} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  if (!user && !isLoading) {
    dispatch(initializeAuth());
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role || "") && !isLoading) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
