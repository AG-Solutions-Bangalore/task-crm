import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaCompress,
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";
import {
  CircleUser,
  LogOut,
  Menu,
  SquareChevronLeft,
  SquareChevronRight,
  SquareX,
  User,
} from "lucide-react";
import ButtonConfigColor from "./buttonComponent/ButtonConfig";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Base_Url } from "@/config/BaseUrl";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useApiToken from "./common/UseToken";
import { persistor } from "@/redux/store";
import { logout } from "@/redux/authSlice";

const Navbar = ({
  toggleSidebar,
  isSidebarOpen,
  toggleCollapse,
  isCollapsed,
}) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const mobileNumber = useSelector((state) => state.auth.mobile);
  const token = useApiToken();
  const dispatch = useDispatch();
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.log(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await persistor.flush();
      localStorage.clear();
      dispatch(logout());
      navigate("/");
      setTimeout(() => persistor.purge(), 1000);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.old_password || !passwordData.new_password) {
      toast({
        title: "Error",
        description: "Both Old Password and New Password are required",
        variant: "destructive",
      });
      return;
    }
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Mobile Number is required to change the password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${Base_Url}/api/panel-change-password`,
        { ...passwordData, mobile: mobileNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg || "Password changed successfully",
        });

        setPasswordData({ old_password: "", new_password: "" });
        setIsChangePasswordOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors block lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <SquareX size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:inline-block"
            aria-label="Collapse sidebar"
          >
            {isCollapsed ? (
              <SquareChevronRight size={20} />
            ) : (
              <SquareChevronLeft size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle dropdown"
            >
              <CircleUser size={20} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  <span className="material-icons text-gray-500">
                    <User size={20} />
                  </span>
                  Change Password
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutDialogOpen(true);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 transition-all"
                >
                  <span className="material-icons text-red-500">
                    <LogOut size={20} />{" "}
                  </span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* //Chnage password */}
      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="max-w-sm" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-lg">Change Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="password">Old Password *</Label>
              <Input
                type="password"
                name="old_password"
                value={passwordData.old_password}
                onChange={handleInputChange}
                placeholder="Enter Old Password"
              />
            </div>

            <div>
              <Label htmlFor="password">New Password *</Label>
              <Input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handleInputChange}
                placeholder="Enter New Password"
              />
            </div>

            <DialogFooter className="flex justify-end gap-3">
              <ButtonConfigColor
                type="button"
                buttontype="cancel"
                onClick={() => setIsChangePasswordOpen(false)}
                label="Cancel"
              />
              <ButtonConfigColor
                loading={loading}
                disabled={loading}
                type="submit"
                buttontype="submit"
                label="Change Password"
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* //Logout */}
      <Dialog
        open={isLogoutDialogOpen}
        onOpenChange={() => setIsLogoutDialogOpen(false)}
      >
        <DialogContent className="max-w-sm" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-lg">Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm">
            Are you sure you want to logout?
          </p>
          <DialogFooter className="flex justify-end gap-3">
            <ButtonConfigColor
              type="button"
              buttontype="cancel"
              onClick={() => setIsLogoutDialogOpen(false)}
              label="Cancel"
            />
            <ButtonConfigColor
              type="button"
              buttontype="logout"
              onClick={handleLogout}
              label="Logout"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
