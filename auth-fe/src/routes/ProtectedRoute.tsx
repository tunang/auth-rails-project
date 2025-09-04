import type { RootState } from "@/store";
import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: ReactNode;
}) => {
  // const { user, isLoading } = useSelector((state: RootState) => state.auth);

  // if (!user && !isLoading) {
  //   return <Navigate to="/login" />;
  // }

  // if (!allowedRoles.includes(user?.role || "") && !isLoading) {
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
