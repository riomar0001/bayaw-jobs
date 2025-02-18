import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User, Briefcase } from "lucide-react";
import { useState } from "react";

const AccountRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);

  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);

  };

  const registrationForms = [
    {
      value: "jobseeker",
      title: "Create your Job Seeker account",
      fields: [
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
        {
          label: "Confirm Password",
          placeholder: "Re-enter your password",
          type: "confirmpassword",
          icon: <Lock color="black" size={20} />,
        },
      ],
    },
    {
      value: "employer",
      title: "Create your Employer account",
      fields: [
        {
          label: "Company Name",
          placeholder: "Enter your company name",
          icon: <Briefcase color="black" size={20} />,
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
        {
          label: "Confirm Password",
          placeholder: "Re-enter your password",
          type: "confirmpassword",
          icon: <Lock color="black" size={20} />,
        },
      ],
    },
  ];

  return (
    <div className="bg-white w-full h-auto pt-12 pb-24">
      <h1 className="text-4xl font-medium text-center mb-8">Account Registration</h1>
      <div className="flex justify-center">
        <Tabs defaultValue="jobseeker">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger
                value="jobseeker"
                className="data-[state=active]:text-white data-[state=active]:bg-lochmara-500 text-base font-normal"
              >
                Job Seekers
              </TabsTrigger>
              <TabsTrigger
                value="employer"
                className="data-[state=active]:text-white data-[state=active]:bg-lochmara-500 text-base font-normal"
              >
                Employers
              </TabsTrigger>
            </TabsList>
          </div>
          {registrationForms.map((form) => (
            <TabsContent key={form.value} value={form.value}>
              <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
                <h1 className="font-normal text-2xl mb-8">{form.title}</h1>
                {form.fields.map((field, index) => (
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
                    {field.type === "confirmpassword" && (
                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff color="black" size={20} /> : <Eye color="black" size={20} />}

                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <h1 className="text-sm text-lochmara-500 hover:underline cursor-pointer">
                    Forgot Your Password?
                  </h1>
                  <Button className="bg-lochmara-500 text-white hover:bg-neutral-500">
                    Create account
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AccountRegistration;