import { FaTwitterSquare, FaLinkedin, FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="bg-white border border-neutral-300 w-full h-[400px] flex flex-col justify-between">
            <div className="flex justify-between px-24 py-12">
                <div className="flex gap-x-5">
                    <img src="/BrandLogo.svg" className="w-10 h-10" />
                    <h1 className="text-2xl font-medium">BayawJobs</h1>
                </div>

                <div className="flex gap-x-16">
                    <div className="font-light space-y-2">
                        <h1 className="font-medium">For Job Seekers</h1>
                        <h1 className="hover:font-normal cursor-pointer">Sign In</h1>
                        <h1 className="hover:font-normal cursor-pointer">Sign Up</h1>
                        <h1 className="hover:font-normal cursor-pointer">Jobs</h1>
                        <h1 className="hover:font-normal cursor-pointer">Companies</h1>
                    </div>

                    <div className="font-light space-y-2">
                        <h1 className="font-medium">For Employers</h1>
                        <h1 className="hover:font-normal cursor-pointer">Sign In</h1>
                        <h1 className="hover:font-normal cursor-pointer">Sign Up</h1>
                    </div>

                    <div className="font-light space-y-2">
                        <h1 className="font-medium">Company</h1>
                        <h1 className="hover:font-normal cursor-pointer">About us</h1>
                        <h1 className="hover:font-normal cursor-pointer">Contact</h1>
                    </div>
                </div>

                <div className="flex gap-x-3">
                    <FaFacebookSquare size={35} className="text-gray-400 hover:text-[#1783D0]" />
                    <FaLinkedin size={35} className="text-gray-400 hover:text-[#1783D0]" />
                    <FaTwitterSquare size={35} className="text-gray-400 hover:text-[#1783D0]" />
                </div>
            </div>

            <div className="bg-white border-t-2 border-neutral-300 w-full h-[70px] flex justify-between items-center px-24">
                <h1 className="space-x-5">
                    <span>Account</span>
                    <span>Marketing</span>
                    <span>Support</span>
                </h1>

                <h1>Copyright © 2025 KALMOT</h1>

                <h1 className="space-x-5">
                    <span>User Agreement</span>
                    <span>Privacy Policy</span>
                </h1>
            </div>
        </div>
    );
};

export default Footer;
