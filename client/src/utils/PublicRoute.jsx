import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ user }) {
  if (!user) {
    return <Outlet />;
  }

  return <Navigate to={"/dashboard"} replace />;
}
