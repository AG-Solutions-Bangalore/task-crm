import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../../config/BaseUrl";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import { loginSuccess } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { validateEnvironment } from "@/components/common/EncryptionDecryption";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateEnvironment();
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid environment detected!",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!formData.mobile) {
      toast({
        title: "Error",
        description: "Mobile number is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.mobile.length !== 10) {
      toast({
        title: "Error",
        description: "Mobile number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    if (!formData.password) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 2) {
      toast({
        title: "Error",
        description: "Password should be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${Base_Url}/api/panel-login`,
        {
          mobile: formData.mobile,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.code === 200) {
        if (!res?.data?.data?.user || !res?.data?.data?.token) {
          toast({
            title: "Error",
            description: "Login Failed: No token received.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const userInfo = res.data.data;
        const userData = {
          token: userInfo.token,
          company_id: userInfo.user.company_id,
          id: userInfo.user.id,
          mobile: userInfo.user.mobile,
          name: userInfo.user.name,
          user_type: userInfo.user.user_type,
          email: userInfo.user.email,
          last_login: userInfo.user.last_login,
          image: userInfo.user.user_image,
        };
        console.log("Dispatching user data:", userData);
        dispatch(loginSuccess(userData));

        console.log(
          "Navigating to:",
          userInfo.user.user_type === 1 ? "/task" : "/home"
        );
        navigate(userInfo.user.user_type === 1 ? "/task" : "/home");
      } else {
        toast({
          title: "Error",
          description: res?.data?.msg || "Login Failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.msg ||
          "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordClick = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e, nextFieldId) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.getElementById(nextFieldId)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-8">
          <div className="font-semibold flex items-center space-x-2">
            <div className="flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-800"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-yellow-900 leading-tight">
                Task Management
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-center text-gray-900 mb-6">
          Welcome Back, Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
                if (e.key === "Tab") {
                  handleKeyDown(e, "password");
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
              placeholder="Enter your mobile"
              maxLength={10}
              minLength={10}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    handleKeyDown(e, "submit-button");
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                placeholder="Enter your password"
                id="password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={handleClickShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forget-password"
              onClick={handleForgotPasswordClick}
              className="text-sm text-accent-500 hover:text-accent-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <ButtonConfigColor
            id="submit-button"
            loading={isLoading}
            type="submit"
            buttontype="normal"
            disabled={isLoading}
            label={isLoading ? "Signing In..." : "Sign In"}
            className="w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
