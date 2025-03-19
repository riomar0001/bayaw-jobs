import { logos } from "@/constants";
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import AuthDropdown from "./AuthDropdown";

const Navbar = () => {
  const { authStateApplicant } = useAuth();

  return (
    <div className="bg-white w-full h-[75px] border-b-2 border-neutral-300 flex items-center justify-between px-24">
      <Link to={"/"}>
        <div className="flex items-center gap-x-5">
          <img src={logos.brandlogo} className="w-10 h-10" />
          <h1 className="text-2xl font-medium">JobTally</h1>
        </div>
      </Link>

      <div className="flex space-x-10">

        <Link to={"/find-jobs"}>
          <h1 className="hover:underline cursor-pointer">Find Jobs</h1>
        </Link>

        <h1 className="hover:underline cursor-pointer">Companies</h1>
        <Link to="/employer">
          <h1 className="hover:underline cursor-pointer">Company Login</h1>
        </Link>
      </div>

      {
        authStateApplicant?.authenticated ? (
          <AuthDropdown data={authStateApplicant} />
        ) : (
          <div className="space-x-5">
            <Link to={"/login"}>
              <Button className="bg-transparent border border-lochmara-500 text-lochmara-500 hover:bg-lochmara-500 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link to={"/register"}>
              <Button className="bg-lochmara-500">Sign Up</Button>
            </Link>
          </div>
        )
      }
    </div>
  );
};

export default Navbar;
