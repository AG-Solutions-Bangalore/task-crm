import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Layout from "@/components/Layout";
import { Base_Url } from "@/config/BaseUrl";

const ProjectReport = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${Base_Url}/api/panel-fetch-project-list-report`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.project;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p style={{ color: "red" }}>Error loading data</p>;

  return (
    <Layout>
      <h2 className="text-2xl mb-4">Project Report </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-black">
          <thead className="bg-gray-300 print:bg-white text-black text-xs print:text-[10px]">
            <tr>
              <th className="border border-black px-1 py-2">Project Name</th>
              <th className="border border-black px-1 py-2">Description</th>
              <th className="border border-black px-1 py-2">Status</th>
              <th className="border border-black px-1 py-2">Types</th>
              <th className="border border-black px-1 py-2">Due Dates</th>
              <th className="border border-black px-1 py-2">Sub Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((project, index) => (
              <tr
                key={index}
                className="text-center border border-black hover:bg-gray-200 transition-all duration-200 text-xs print:text-[10px]"
              >
                <td className="border border-black px-1 py-2">
                  {project.project_name}
                </td>
                <td className="border border-black px-1 py-2">
                  {project.project_desc}
                </td>
                <td className="border border-black px-1 py-2">
                  {project.project_status}
                </td>
                <td className="border border-black px-1 py-2">
                  {project.project_types
                    ? project.project_types.split(",").join(", ")
                    : "N/A"}
                </td>
                <td className="border border-black px-1 py-2">
                  {project.project_due_dates
                    ?moment( project.project_due_dates).split(",").join(", ")
                    : "N/A"}
                </td>
                <td className="border border-black px-1 py-2">
                  {project.projectSub_statuses
                    ? project.projectSub_statuses.split(",").join(", ")
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ProjectReport;
