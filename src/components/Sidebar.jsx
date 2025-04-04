import { NoImage, UserImage } from "@/config/BaseUrl";
import ImageDialog from "@/pages/user/ImageDialog";
import {
  BadgeIndianRupee,
  BookmarkCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderGit2,
  House,
  Loader2,
  User,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }) => {
  const [openSubmenu, setOpenSubmenu] = useState("");
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userImageUrl = useSelector((state) => state.auth.image);
  const [userInfo, setUserInfo] = useState({
    name: "",
    lastLogin: "",
  });
  const location = useLocation();
  const storedUserType = useSelector((state) => state.auth.user_type);
  const storedName = useSelector((state) => state.auth.name);
  const storedLastLogin = useSelector((state) => state.auth.last_login);
  useEffect(() => {
    setUserType(storedUserType);
    setUserInfo({
      name: storedName || "",
      lastLogin: storedLastLogin || "",
    });
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const allMenuItems = [
    {
      name: "Dashboard",
      path: "/home",
      icon: House,
    },
    {
      name: "Company",
      path: "/company",
      icon: Building2,
    },
    {
      name: "User",
      path: "/user",
      icon: User,
    },
    {
      name: "Project",
      path: "/project",
      icon: FolderGit2,
    },
    {
      name: "Payment",
      path: "/payment",
      icon: BadgeIndianRupee,
    },
    // {
    //   name: "Task",
    //   path: "/task",
    //   icon: BookmarkCheck,
    // },
    
    {
      name: "Task",
      icon: BookmarkCheck,
      subitems: [
        { name: "Pending Task", path: "/task" },
        { name: "Hold Task", path: "/task-hold" },
        { name: "Regular Task", path: "/task-regular" },
        { name: "Completed Task", path: "/task-completed" },

        ...(storedUserType === 2
          ? [{ name: "Finished Task", path: "/task-finished" }]
   
          : []),
      ],
    },
    {
      name: "Report",
      icon: Folder,
      subitems: [
        { name: "Project", path: "/report/project" },
        { name: "Task", path: "/report/task" },
        { name: "Project Task", path: "/report/project/task" },
        { name: "Project Date", path: "/task-project-date" },
        { name: "Project Assign", path: "/task-project-assign" },
      ],
    },
    {
      name: "Full Report",
      path: "/full-report",
      icon: FolderGit2,
    },
  ];

  const menuItems =
    userType == "1"
      ? allMenuItems.filter(
          (item) => item.name == "Task" || item.name == "Dashboard"
        )
      : allMenuItems;

  useEffect(() => {
    const currentSubmenu = menuItems.find((item) =>
      item.subitems?.some((subitem) => subitem.path === location.pathname)
    );

    if (currentSubmenu) {
      setOpenSubmenu(currentSubmenu.name);
    }
  }, [location.pathname]);

  const handleSubmenuClick = (itemName) => {
    setOpenSubmenu(openSubmenu === itemName ? "" : itemName);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return "Never logged in";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };
  const handleImageClick = () => {
    if (userImageUrl) {
      setIsDialogOpen(true);
    }
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-16" : "lg:w-64"}
        w-64 z-40 overflow-y-auto flex flex-col`}
      >
        <div className="p-4 flex-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.subitems ? (
                <div
                  onClick={() => handleSubmenuClick(item.name)}
                  className="mb-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        {openSubmenu === item.name ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `
                  mb-1 flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </NavLink>
              )}

              {!isCollapsed && item.subitems && openSubmenu === item.name && (
                <div className="ml-9 mb-2">
                  {item.subitems.map((subItem) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.path}
                      onClick={handleLinkClick}
                      className={() => `
    py-2 px-3 text-sm rounded-lg block transition-colors
    ${
      location.pathname === subItem.path
        ? "bg-accent-50 text-accent-600"
        : "text-gray-600 hover:bg-gray-100"
    }
  `}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isCollapsed && (
          <div className="p-2 border-t border-gray-200">
            {/* Updated Date */}
            <h3 className="text-sm text-gray-600 font-medium  text-center border-b pb-3 border-gray-200">
              Updated on:{" "}
              <span className="font-semibold text-gray-800">04-Apr-2025</span>
            </h3>

            {/* Profile Section */}
            <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg shadow-sm">
              {/* Profile Image */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                )}

                <img
                  src={userImageUrl ? `${UserImage}/${userImageUrl}` : NoImage}
                  alt="User"
                  className="rounded-full w-16 h-16 object-cover shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onLoad={handleImageLoad}
                  onClick={handleImageClick}
                  style={{ display: isLoading ? "none" : "block" }}
                />

                {/* Image Dialog */}
                {isDialogOpen && (
                  <ImageDialog
                    imageUrl={`${UserImage}/${userImageUrl}`}
                    label={storedName}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                )}
              </div>

              {/* User Details */}
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 capitalize">
                  {userInfo.name}
                </span>
                <span className="text-sm text-gray-500">
                  {moment(storedLastLogin).format("DD-MMM-YYYY")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
