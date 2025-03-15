import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Profile from "./pages/applicant/Profile";
import Registration from "./pages/Registration"
import Login from "./pages/Login"
import EditProfile from "./pages/applicant/EditProfile";
import EmployerLayout from "./layouts/EmployerLayout";
import Dashboard from "./pages/employer/Dashboard";


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Landing />} />
                <Route path="/applicant/profile" element={<Profile />} />
                <Route path="/applicant/profile/edit" element={<EditProfile />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<EmployerLayout />}>
                <Route path="/employer/dashboard" element={<Dashboard/>} />
            </Route>
        </>


    )
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
