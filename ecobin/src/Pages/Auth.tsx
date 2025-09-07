import { useState } from "react";
import { toast } from "react-toastify";
import { PostApiCall } from "../utils/apiCall";
import { setItem } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import type { RegistrationRequest, LoginRequest, RegistrationResponse, LoginResponse } from "../types/api";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface SignupForm extends Omit<RegistrationRequest, 'role'> {
  role: "household" | "municipality" | "";
}

type LoginForm = LoginRequest;

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.role || !signupForm.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // Convert form data to match API expectations
      const registrationData: RegistrationRequest = {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role as "household" | "municipality"
      };

      const data = await PostApiCall(
        `${backendUrl}/api/auth/register`,
        registrationData
      ) as RegistrationResponse;
      
      if (data.success) {
        await setItem("token", data.data.token);
        toast.success(data.message || "Registration successful!");
        navigate("/");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const data = await PostApiCall(
        `${backendUrl}/api/auth/login`, 
        loginForm
      ) as LoginResponse;

      if (data.success) {
        await setItem("token", data.data.token);
        toast.success("Login Successful");
        navigate("/");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/90">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/90 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-16 bg-gradient-to-r from-[#062f2e] to-[#062f2e]/80">
            <div className="flex h-full">
              <button
                onClick={() => setIsSignup(false)}
                className={`flex-1 flex items-center justify-center text-white font-medium transition-all duration-300 relative ${
                  !isSignup ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Sign In
                {!isSignup && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-lg" />
                )}
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`flex-1 flex items-center justify-center text-white font-medium transition-all duration-300 relative ${
                  isSignup ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Sign Up
                {isSignup && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-lg" />
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#062f2e] mb-6 text-center">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>

            <form
              className="space-y-4"
              onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
            >
              {isSignup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#062f2e] block">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-[#a08961]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 border border-[#a08961]/30 rounded-lg focus:ring-2 focus:ring-[#a08961] focus:border-[#a08961] outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#062f2e] block">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-[#a08961]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={isSignup ? signupForm.email : loginForm.email}
                    onChange={isSignup ? handleSignupChange : handleLoginChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#a08961]/30 rounded-lg focus:ring-2 focus:ring-[#a08961] focus:border-[#a08961] outline-none"
                    required
                  />
                </div>
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#062f2e] block">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-[#a08961]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <select
                      name="role"
                      value={signupForm.role}
                      onChange={handleSignupChange}
                      className="w-full pl-10 pr-10 py-2.5 border border-[#a08961]/30 rounded-lg focus:ring-2 focus:ring-[#a08961] focus:border-[#a08961] appearance-none outline-none"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="household">Household</option>
                      <option value="municipality">Municipality</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-[#a08961]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#062f2e] block">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-[#a08961]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={isSignup ? signupForm.password : loginForm.password}
                    onChange={isSignup ? handleSignupChange : handleLoginChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#a08961]/30 rounded-lg focus:ring-2 focus:ring-[#a08961] focus:border-[#a08961] outline-none"
                    required
                    minLength={6}
                  />
                </div>
                {isSignup && (
                  <p className="text-xs text-[#062f2e]/70 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#062f2e] to-[#062f2e]/80 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:from-[#083d3c] hover:to-[#083d3c]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isSignup ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  )}
                </svg>
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-xl font-semibold text-[#062f2e]">EcoBin</h2>
          </div>
          <p className="mt-2 text-sm text-[#062f2e]/70">
            © {new Date().getFullYear()} EcoBin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
