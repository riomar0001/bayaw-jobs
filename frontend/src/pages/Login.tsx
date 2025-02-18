import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginFields = [
    {
      label: "Username",
      placeholder: "Enter your username",
      icon: <User color="black" size={20} />,
    },
    {
      label: "Email",
      placeholder: "Enter your email",
      icon: <Mail color="black" size={20} />,
    },
    {
      label: "Password",
      placeholder: "Enter a secure password (8-12 characters)",
      type: "password",
      icon: <Lock color="black" size={20} />,
    },
  ];

  return (
    <div className="bg-white w-full h-auto pt-12 pb-24">
      <div className="flex justify-center">
        <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
          <h1 className="font-normal text-3xl mb-10">Log in to your account</h1>
          {loginFields.map((field, index) => (
            <div key={index} className="relative mb-4">
              {field.icon && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  {field.icon}
                </div>
              )}
              <Input
                placeholder={field.placeholder}
                type={field.type === "password" ? (showPassword ? "text" : "password") : field.type || "text"}
                className="bg-neutral-100 h-12 pl-12"
              />
              {field.type === "password" && (
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff color="black" size={20} /> : <Eye color="black" size={20} />}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-between items-center">
            <h1 className="text-sm text-lochmara-500 hover:underline cursor-pointer">
              Forgot Your Password?
            </h1>
            <Button className="bg-lochmara-500 text-white hover:bg-neutral-500">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;