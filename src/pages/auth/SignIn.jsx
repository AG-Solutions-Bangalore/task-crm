import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import siginLogo from "../../assets/kmrlive.png";
import { Base_Url } from "../../config/BaseUrl";


const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  

  const validationSchema = Yup.object({
    mobile: Yup.number().required("mobile is required"),
    password: Yup.string()
      .min(2, "Password should be of minimum 2 characters length")
      .required("Password is required"),
  });



  const formik = useFormik({
    initialValues: {
      mobile: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await axios.post(
          `${Base_Url}/api/panel-login`,
          {
            mobile: values.mobile,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );


        if (res?.data?.code == 200) {
          if (!res?.data?.data?.user || !res?.data?.data?.token) {
            console.warn("⚠️ Login failed: Token missing in response");
            toast.error("Login Failed: No token received.");
            setIsLoading(false);
            return;
          }
  
          const  UserInfo  = res.data?.data;
      

          localStorage.setItem("token", UserInfo.token);
          localStorage.setItem("company_id", UserInfo.user.company_id);
          localStorage.setItem("name", UserInfo.user.name);
          localStorage.setItem("userType", UserInfo.user.user_type);
          localStorage.setItem("email", UserInfo.user.email);
 
  
          console.log("✅ Login successful! Redirecting to /home...");
          navigate("/home");
        } else {
          console.warn("⚠️ Unexpected API response:", res);
          toast.error("Login Failed: Unexpected response.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false); 
      }
    },
  });


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-accent-500 to-accent-600 relative">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-center">
            Manage your spice, oil, and seed inventory effortlessly with our
            CRM.
          </p>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <img
          src="https://images.immediate.co.uk/production/volatile/sites/30/2024/10/Soybean-oil-4695c4f.jpg?quality=90&resize=440,400"
          alt="SignIn Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2  flex flex-col justify-center items-center p-4 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={siginLogo} // Replace with your logo URL
              alt="Logo"
              className=" w-full h-20"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Welcome Back, Sign In
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                placeholder="Enter your mobile"
            
                onKeyDown={(e) => {
                  if (!/[0-9.]/.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
                maxLength={10}
                minLength={10}
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.mobile}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
             
              <Link
                tabIndex={-1}
                to="/forget-password"
                className="text-sm text-accent-500 hover:text-accent-600"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4  font-medium rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
