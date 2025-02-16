import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";;
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const EmployerRegister = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
            <h1 className="font-normal text-2xl mb-8">Create your Employer account</h1>

            <h1 className="text-sm font-normal">Username</h1>
            <div className="relative mb-4">
                <User color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <Input placeholder="Enter your username" className="bg-neutral-100 h-12 pl-12" />
            </div>

            <h1 className="text-sm font-normal">Email</h1>
            <div className="relative mb-4">
                <Mail color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <Input placeholder="Enter your email" className="bg-neutral-100 h-12 pl-12" />
            </div>

            {/* <h1 className="text-sm font-normal">Company Name</h1>
            <div className="relative mb-4">
                <Building2 color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <Input placeholder="Enter your Company" className="bg-neutral-100 h-12 pl-12" />
            </div>

            <h1 className="text-sm font-normal">Company Description</h1>
            <Textarea placeholder="Write a description for your company.." className="bg-neutral-100 mb-4"/> */}

            <h1 className="text-sm font-normal">Password</h1>
            <div className="relative mb-6">
                <Lock color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <Input
                    placeholder="Enter a secure password (8-12 characters)"
                    type={showPassword ? "text" : "password"}
                    className="bg-neutral-100 h-12 pl-12"
                />
                <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <EyeOff color="black" size={20} /> : <Eye color="black" size={20} />}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-sm text-[#1783D0] hover:text-neutral-600 hover:font-medium cursor-pointer">Forgot Your Password?</h1>
                <Button className="bg-[#1783D0] text-white hover:bg-neutral-500">Create account</Button>
            </div>
        </div>
    )
}

export default EmployerRegister