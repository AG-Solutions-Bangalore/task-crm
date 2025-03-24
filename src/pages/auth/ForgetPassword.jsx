
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import mainLogo from "../../assets/kmrlive.png"; // Ensure the path is correct
import { toast } from "sonner";
import { Base_Url } from "../../config/BaseUrl";
import { Button } from "@/components/ui/button";

const ForgetPassword = () => {

  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const onResetPassword = () => {
    const data = {
      username: username,
      mobile: mobile,
    };

    
    if (mobile !== "" ) {
      axios({
        url: `${Base_Url}/api/panel-send-password`,
        method: "POST",
        data: data,
      })
        .then((res) => {
          if (res.data.code == 200) {
            toast.success("New Password Sent to your Email");
           
              navigate("/");
          
          } else {
            toast.error("This email is not registered with us.");
          }
        })
        .catch((error) => {
          toast.error("Email Not Sent.");
        });
    } else {
      toast.warn("Please enter a User Name & Email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={mainLogo} alt="Main Logo" className=" h-16" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Reset Password
        </h2>

        {/* Form */}
        <div className="space-y-6">
        

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors placeholder-gray-400"
              placeholder="Enter mobile number"
              required

              onKeyDown={(e) => {
                if (!/[0-9.]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              maxLength={10}
              minLength={10}
            />
          </div>

          {/* Reset Password Button */}
          <Button
            onClick={onResetPassword}
            className="w-full py-3 px-4  font-medium rounded-lg hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
          >
            Reset Password
          </Button>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-accent-500 hover:text-accent-600"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      
    </div>
  );
};

export default ForgetPassword;