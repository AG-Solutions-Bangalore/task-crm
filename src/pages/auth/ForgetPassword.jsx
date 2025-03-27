import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import mainLogo from "../../assets/kmrlive.png"; // Ensure the path is correct

import { Base_Url } from "../../config/BaseUrl";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ForgetPassword = () => {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const onResetPassword = () => {
    const data = {
      username: username,
      mobile: mobile,
    };

    if (mobile !== "") {
      axios({
        url: `${Base_Url}/api/panel-send-password`,
        method: "POST",
        data: data,
      })
        .then((res) => {
          if (res.data.code == 200) {
            toast({
              title: "Success",
              description: "New Password Sent to your Email",
            });
            navigate("/");
          } else {
            toast({
              title: "Error",
              description: "This email is not registered with us.",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Email Not Sent.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Warning",
        description: "Please enter a User Name & Email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
        <div className="font-semibold flex items-center space-x-2">
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-800">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-yellow-900 leading-tight">Task Management</span>
            </div>
            </div>
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
