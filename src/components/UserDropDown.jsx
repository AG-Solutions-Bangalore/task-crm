import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleUser, LogOut, User } from "lucide-react";

const UserMenu = ({ setIsChangePasswordOpen, setIsLogoutDialogOpen }) => {
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle dropdown"
              >
                <CircleUser size={20} />
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align="end"
        className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
      >
        <button
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          <User size={20} className="text-gray-500" />
          Change Password
        </button>

        <button
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 transition-all"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <LogOut size={20} className="text-red-500" />
          Logout
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
