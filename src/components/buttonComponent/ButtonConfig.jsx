import React from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { FileCog, PlusCircle } from "lucide-react";

const ButtonConfigColor = ({
  type,
  label,
  onClick,
  disabled,
  loading,
  className,
  buttontype,
}) => {
  const getButtonStyles = () => {
    const baseStyles =
      "px-6 py-2 text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105";
  
    switch (buttontype) {
      case "submit":
        return `${baseStyles} text-white bg-black hover:bg-gray-900`;
      case "back":
        return `${baseStyles} text-black bg-white border border-black hover:bg-gray-100`;
      case "create":
        return `${baseStyles} text-white bg-black hover:bg-gray-900`;
      case "update":
        return `${baseStyles} text-white bg-black hover:bg-gray-900`;
      case "normal":
        return `${baseStyles} text-white bg-black hover:bg-gray-900`;
      default:
        return `${baseStyles} text-white bg-black hover:bg-gray-900`;
    }
  };
  

  

  // Define icons based on the type
  const getIcon = () => {
    if (loading) return <FiLoader className="animate-spin text-lg" />;
    switch (buttontype) {
      case "submit":
        return <PlusCircle className="w-4 h-4" />;
      case "back":
        return <FaArrowLeft className="w-4 h-4" />;
      case "create":
        return <FaPlus className="w-4 h-4" />;
      case "update":
        return <FileCog className="w-4 h-4" />;

      default:
        return null;
    }
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${getButtonStyles()} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <div className="flex items-center justify-center gap-2 text-sm">
        {getIcon()}
        <span className="whitespace-nowrap">{label}</span>
      </div>
    </button>
  );
};

export default ButtonConfigColor;
