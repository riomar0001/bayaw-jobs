import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { onLoginCompany } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8 || password.length > 12) {
      setError("Password must be between 8 and 12 characters");
      return;
    }
    setIsLoading(true);

    try {
      await onLoginCompany(username, password);
      navigate("/employer/jobs");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="bg-neutral-100 w-full h-screen py-56">
      <div className="flex justify-center">
        <div className="w-[650px] h-auto bg-white border border-neutral-300 rounded-xl px-12 py-8">
          <h1 className="font-normal text-3xl mb-10">Log in to your account</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User color="black" size={20} />
              </div>
              <Input
                placeholder="Enter your username or email"
                type="text"
                className="bg-neutral-100 h-12 pl-12"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User color="black" size={20} />
              </div>
              <Input
                placeholder="Enter your username or email"
                type={showPassword ? "text" : "password"}
                className="bg-neutral-100 h-12 pl-12"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff color="black" size={20} /> : <Eye color="black" size={20} />}
              </div>
            </div>
            <div className="flex justify-end items-center mt-10">
              <Button
                type="submit"
                className="bg-lochmara-500 text-white hover:bg-lochmara-700"
                disabled={isLoading}

              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;