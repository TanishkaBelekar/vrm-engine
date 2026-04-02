// src/shared/lib/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken } from "./auth";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const token = getToken(); // use auth.ts token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;