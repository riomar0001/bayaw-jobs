import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const RegistrationForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { onRegisterApplicant } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !password) {
            setError("All fields are required");
            return;
        }

        if (password.length < 8 || password.length > 12) {
            setError("Password must be between 8 and 12 characters");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            await onRegisterApplicant(username, email, password);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
            <h1 className="font-normal text-2xl mb-8">Create your Employer account</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister}>
                <h1 className="text-sm font-normal">Username</h1>
                <div className="relative mb-4">
                    <User color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <Input
                        placeholder="Enter your username"
                        className="bg-neutral-100 h-12 pl-12"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                    />
                </div>

                <h1 className="text-sm font-normal">Email</h1>
                <div className="relative mb-4">
                    <Mail color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <Input
                        placeholder="Enter your email"
                        className="bg-neutral-100 h-12 pl-12"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        required
                    />
                </div>

                <h1 className="text-sm font-normal">Password</h1>
                <div className="relative mb-6">
                    <Lock color="black" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <Input
                        placeholder="Enter a secure password (8-12 characters)"
                        type={showPassword ? "text" : "password"}
                        className="bg-neutral-100 h-12 pl-12"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        minLength={8}
                        maxLength={12}
                        required
                    />
                    <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff color="black" size={20} /> : <Eye color="black" size={20} />}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <h1 className="text-sm text-lochmara-500 hover:underline cursor-pointer">Forgot Your Password?</h1>
                    <Button
                        type="submit"
                        className="bg-lochmara-500 text-white hover:bg-lochmara-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create account"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;