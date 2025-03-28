import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import useApiToken from "@/components/common/UseToken";
import Layout from "@/components/Layout";
import ErrorLoader from "@/components/loader/ErrorLoader";
import Loader from "@/components/loader/Loader";
import { Label } from "@/components/ui/label";
import { Base_Url } from "@/config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const ProjectTask = () => {
  const [formData, setFormData] = useState({
    project_id: "",
  });
  const containerRef = useRef();
  const token = useApiToken();

  const {
    data: project,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const response = await axios.get(`${Base_Url}/api/panel-fetch-project`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.project;
    },
  });

  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["task", formData.project_id],
    queryFn: async () => {
      if (!formData.project_id) return [];
      const response = await axios.post(
        `${Base_Url}/api/panel-fetch-project-task-list-report`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.task || [];
    },
    enabled: false,
  });
  useEffect(() => {
    if (formData.project_id) {
      refetch();
    }
  }, [formData.project_id, refetch]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const groupedByProject = (task ?? []).reduce((acc, project) => {
    if (!acc[project.project_name]) {
      acc[project.project_name] = {};
    }
    if (!acc[project.project_name][project.to_name]) {
      acc[project.project_name][project.to_name] = [];
    }
    acc[project.project_name][project.to_name].push(project);
    return acc;
  }, {});
  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Task Report",
    pageStyle: `
      @page {
        size: A4 portrait; /* 
        margin: 5mm; 
      }
  
      @media print {
        body {
          font-size: 10px; 
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }
  
        table {
          font-size: 11px;
          width: 100%;
          border-collapse: collapse;
        }
        .print-hide {
          display: none;
        }
      }
    `,
  });

  if (isLoading || usersLoading) {
    return (
      <Layout>
        <Loader data={"Project Task Report"} />
      </Layout>
    );
  }

  // Render error state
  if (isError || usersError) {
    return (
      <Layout>
        <ErrorLoader onSuccess={refetch} />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="overflow-x-auto p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl">Project Task Report </h2>

          <ButtonConfigColor
            type="button"
            buttontype="print"
            label="Print"
            onClick={handlPrintPdf}
          />
        </div>
        <form>
          <div className="grid grid-cols-1 gap-4 mb-5">
            <div>
              <Label htmlFor="project_id" className="font-semibold">
                Project Id
              </Label>
              <select
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Select a Project Id</option>
                {project?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto" ref={containerRef}>
          <div className="flex justify-center">
            <h2 className="text-2xl my-3 hidden print:block">
              Project Task Report
            </h2>
          </div>

          {Object.entries(groupedByProject).map(
            ([projectName, types], index) => (
              <div key={index} className="mb-6  rounded-lg shadow-lg">
                {Object.entries(types).map(
                  ([projectType, tasks], typeIndex) => (
                    <div key={typeIndex} className="mb-4">
                      <div className="text-xs font-bold p-2 bg-gray-200 print:bg-white border-b border-black my-3">
                        {projectType}
                      </div>
                      <table className="w-full border border-black">
                        <thead className="bg-gray-300 print:bg-white text-black text-xs print:text-[10px]">
                          <tr>
                            <th className="border border-black px-1 py-2">
                              Webiste
                            </th>
                            <th className="border border-black px-1 py-2">
                              Title
                            </th>
                            <th className="border border-black px-1 py-2">
                              Created
                            </th>
                            <th className="border border-black px-1 py-2">
                              From
                            </th>
                            <th className="border border-black px-1 py-2">
                              Description
                            </th>
                            <th className="border border-black px-1 py-2">
                              Due Date
                            </th>
                            <th className="border border-black px-1 py-2">
                              Priority
                            </th>
                            <th className="border border-black px-1 py-2">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((project, idx) => (
                            <tr
                              key={idx}
                              className="text-center border border-black hover:bg-gray-200 transition-all duration-200 text-xs print:text-[10px]"
                            >
                              <td className="border border-black px-1 py-2">
                                {project.project_type}
                              </td>
                              <td className="border border-black px-1 py-2">
                                {project.task_title}
                              </td>

                              <td className="border border-black px-1 py-2">
                                {project.task_created
                                  ? moment(project.task_created).format(
                                      "DD-MM-YYYY"
                                    )
                                  : ""}
                              </td>

                              <td className="border border-black px-1 py-2">
                                {project.from_name}
                              </td>
                              <td
                                className="border border-black px-1 py-2 text-left align-top 
                               max-w-[50px] overflow-hidden break-words"
                              >
                                {project.task_desc}
                              </td>

                              <td className="border border-black px-1 py-2">
                                {project.task_due_date
                                  ? moment(project.task_due_date).format(
                                      "DD-MM-YYYY"
                                    )
                                  : ""}
                              </td>
                              <td className="border border-black px-1 py-2">
                                {project.task_priority}
                              </td>
                              <td className="border border-black px-1 py-2 font-semibold">
                                {project.task_status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            )
          )}
          {task?.length === 0 && (
            <div className="text-center font-semibold text-red-500 py-4">
              No Task Available
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectTask;
