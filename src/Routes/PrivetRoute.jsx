import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../redux/api/profileApi";

const routePermissionMap = {
    "/user-management": "USER",
  "/listing-management": "LISTING",
  "/subscription": "SUBSCRIPTION",
  "/all-subscriber": "SUBSCRIBER_LIST",
  "/earnings-management": "EARNING",
  "/NDA": "NDA",
  "/coupon": "COUPON",
  "/formation": "BLOG",
  "/categories": "CATEGORY",


  "/faq-management": "FAQ",
  "/privacy-policy": "PRIVACY_POLICY",
  "/terms-condition": "TERMS_CONDITIONS",
  "/refund-policy": "REFUND_POLICY",
};
const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);
  const location = useLocation();

  const { data: userProfileData, isLoading } = useGetUserProfileQuery(
    undefined,
    { skip: !token }
  );

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="loader-black"></span>
      </div>
    );
  }

  const user = userProfileData?.data;
  if (!user) return <Navigate to="/login" />;

  const requiredPermission = routePermissionMap[location.pathname];


  if (user.role === "SUPER_ADMIN") {
    return children;
  }


  if (user.role === "ADMIN") {

    if (requiredPermission === "SUPER_ADMIN_ONLY") {
      return <Navigate to="/no-access" />;
    }


    if (!requiredPermission) {
      return children;
    }

    // permission check
    if (user.permissions?.includes(requiredPermission)) {
      return children;
    }

    return <Navigate to="/no-access" />;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;