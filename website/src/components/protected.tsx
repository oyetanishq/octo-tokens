import { type JSX } from "react";
import { Navigate } from "react-router";
import { useAuthStore, type DecodedToken } from "@/store/user";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const logout = useAuthStore((state) => state.logout);
    const token = useAuthStore((state) => state.token);

    // 1. Check if token exists
    if (!token) return <Navigate to="/authentication" replace />;

    // 2. Decode token and check for expiry
    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
            // Token is expired, log the user out and redirect
            logout();
            return <Navigate to="/authentication" replace />;
        }
    } catch (error) {
        // If token is invalid, log out and redirect
        console.error("Invalid token: ", error);
        logout();
        return <Navigate to="/authentication" replace />;
    }

    // 3. If token is valid, render the requested component
    return children;
};
