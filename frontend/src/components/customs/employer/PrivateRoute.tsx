import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";// Add this import if you have a spinner component

const PrivateRoute = () => {
    const { authStateCompany } = useAuth();
    const [authTimeout, setAuthTimeout] = useState(false);

    // Set timeout for authentication check
    useEffect(() => {
        let timer: any;
        if (authStateCompany === undefined) {
            timer = setTimeout(() => {
                setAuthTimeout(true);
            }, 5000); // 10 seconds timeout
        }
        return () => clearTimeout(timer);
    }, [authStateCompany]);

    console.log(authStateCompany);

    // If authentication is still being determined
    if (authStateCompany === undefined) {
        // If we've exceeded the auth timeout
        if (authTimeout) {
            return <Navigate to="/employer" replace state={{ message: "Authentication timed out. Please login again." }} />;
        }

        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    // If authenticated but not a company
    if (authStateCompany.user_type !== "company") {
        return <Navigate to="/employer" replace />;
    }

    // If authenticated and is a company
    return <Outlet />;
};

export default PrivateRoute;