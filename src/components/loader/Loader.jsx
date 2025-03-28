import React from "react";
import { Button } from "../ui/button";
import { FiLoader } from "react-icons/fi";

const Loader = ({ data }) => {
  return (
    <div className="flex justify-center items-center min-h-96">
      <Button className="px-6 py-2 text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 cursor-not-allowed">
        <FiLoader className="animate-spin text-lg" /> Loading{" "}
        {data ? data : "Data"}
      </Button>
    </div>
  );
};

export default Loader;
