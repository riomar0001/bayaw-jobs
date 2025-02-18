import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Profile from "./pages/applicant/Profile";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
            <Route path="/applicant/profile" element={<Profile />} />
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
