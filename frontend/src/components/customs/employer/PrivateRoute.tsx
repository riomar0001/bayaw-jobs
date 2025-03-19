import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const PrivateRoute = () => {
    const { authStateCompany } = useAuth();

    console.log("Auth state:", authStateCompany ? authStateCompany.user_type : "loading");

    if (authStateCompany === undefined || authStateCompany === null) {
        return <div>Loading authentication...</div>;
    }

    return authStateCompany.user_type === "company" ? <Outlet /> : <Navigate to="/employer" replace />;
};

export default PrivateRoute;