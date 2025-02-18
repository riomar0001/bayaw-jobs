import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Profile from "./pages/applicant/Profile";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Landing />} />
      <Route path="/applicant/profile" element={<Profile />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
