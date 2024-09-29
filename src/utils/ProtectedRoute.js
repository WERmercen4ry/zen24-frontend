import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem('userRole');  // Lấy role của người dùng từ localStorage
    if (!userRole|| !allowedRoles.includes(userRole)) {
        // Nếu role không tồn tại hoặc không được phép, điều hướng về trang login
        return <Navigate to="/login" />;
    }
    return children;  // Nếu hợp lệ, render component con

};

export default ProtectedRoute;
