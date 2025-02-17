import { logos } from "@/constants";
import { Button } from "../../ui/button";

const Navbar = () => {
    return (
        <div className="bg-white w-full h-[75px] border-b-2 border-neutral-300 flex items-center justify-between px-24">
            <div className="flex items-center gap-x-5">
                <img src={logos.brandlogo} className="w-10 h-10" />
                <h1 className="text-2xl font-medium">JobTally</h1>
            </div>

            <div className="flex space-x-10">
                <h1 className="hover:font-medium cursor-pointer">Find Jobs</h1>
                <h1 className="hover:font-medium cursor-pointer">Companies</h1>
                <h1 className="hover:font-medium cursor-pointer">Company Login</h1>
            </div>

            <div className="space-x-5">
                <Button className="bg-transparent border border-[#1783D0] text-[#1783D0] hover:bg-[#1783D0] hover:text-white">
                    Sign In
                </Button>
                <Button className="bg-[#1783D0]">Sign Up</Button>
            </div>
        </div>
    );
};

export default Navbar;
