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
import AddJob from "./pages/employer/AddJob";
import ProfileEmployer from "./pages/employer/ProfileEmployer";
import EditJob from "./components/customs/employer/EditJob";
import FindJobs from "./pages/applicant/FindJobs";
import JobDetails from "./pages/applicant/JobDetails";
import JobDetailsEmployer from "./pages/employer/JobDetailsEmpoyer";
import { EditProfileSample } from "./constants";
import { Toaster } from "sonner";
import EmployerLogin from "./pages/employer/Login";
import { AuthProvider } from "./contexts/authContext";
import OnboardingCompany from "./pages/employer/OnboardingCompany";
import OnboardingApplicant from "./pages/applicant/OnboardingApplicant";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Landing />} />
                <Route path="/applicant/profile" element={<Profile />} />
                <Route path="/applicant/profile/edit" element={
                    EditProfileSample.map((item, index) => (
                        <EditProfile
                            key={index}
                            firstName={item.firstName}
                            lastName={item.lastName}
                            email={item.email}
                            contactNumber={item.contactNumber}
                            linkedInURL={item.linkedInURL}
                            facebookURL={item.facebookURL}
                            twitterURL={item.twitterURL}
                            birthdate={item.birthdate}
                            salaryExpectation={item.salaryExpectation}
                            location={item.location}
                        />

                    ))
                } />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/find-jobs" element={<FindJobs />} />
                <Route path="/find-jobs/details" element={<JobDetails />} />
                <Route path="/applicant/onboarding" element={<OnboardingApplicant />} />
            </Route>
            <Route path="/employer" element={<EmployerLogin />} />
            <Route element={<EmployerLayout />}>
                <Route path="/employer/jobs" element={<Dashboard />} />
                <Route path="/employer/jobs/job-details" element={<JobDetailsEmployer />} />
                <Route path="/employer/jobs/edit-job" element={<EditJob />} />
                <Route path="/employer/add-job" element={<AddJob />} />
                <Route path="/employer/profile" element={<ProfileEmployer />} />
                <Route path="/employer/onboarding" element={<OnboardingCompany />} />
            </Route>
        </>


    )
);

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
        </AuthProvider>
    );
};

export default App;
