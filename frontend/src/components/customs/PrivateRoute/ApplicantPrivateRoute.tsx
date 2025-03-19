import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const ApplicantPrivateRoute = () => {
    const { authStateApplicant } = useAuth();
    return (
        <>
            {
                authStateApplicant?.authenticated === true ?
                    <Outlet /> :
                    <Navigate to="/login" />
            }
        </>
    );
};


export default ApplicantPrivateRoute;