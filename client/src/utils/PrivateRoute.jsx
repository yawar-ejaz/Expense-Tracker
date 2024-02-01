import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ user, isPremiumRoute }) => {
  if (isPremiumRoute) {
    if (user && user.isPremium) {
      return <Outlet />;
    }
    if (user && !user.isPremium) {
      return <Navigate to={"/dashboard"} replace />;
    }
    return <Navigate to={"/sign-in"} replace />;
  } else {
    if (user) {
      return <Outlet />;
    }
    return <Navigate to={"/sign-in"} replace />;
  }
};
