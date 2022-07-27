import React, { useContext } from "react";
import Admin from "../contexts/Admin";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAdmin } = useContext(Admin);
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
