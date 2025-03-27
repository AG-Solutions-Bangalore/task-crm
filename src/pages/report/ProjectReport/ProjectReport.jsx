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
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="border px-4 py-2">Project Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Types</th>
              <th className="border px-4 py-2">Due Dates</th>
              <th className="border px-4 py-2">Sub Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((project, index) => (
              <tr
                key={index}
                className="text-center border-b hover:bg-gray-100"
              >
                <td className="border px-4 py-2">{project.project_name}</td>
                <td className="border px-4 py-2">{project.project_desc}</td>
                <td className="border px-4 py-2">{project.project_status}</td>
                <td className="border px-4 py-2">
                  {project.project_types
                    ? project.project_types.split(",").join(", ")
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {project.project_due_dates
                    ? project.project_due_dates.split(",").join(", ")
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
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
