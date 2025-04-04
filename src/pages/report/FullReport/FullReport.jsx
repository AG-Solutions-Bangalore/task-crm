import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import useApiToken from "@/components/common/UseToken";
import Layout from "@/components/Layout";
import ErrorLoader from "@/components/loader/ErrorLoader";
import Loader from "@/components/loader/Loader";
import { Base_Url } from "@/config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
const TaskCard = ({ task }) => {
  return (
    <div className="border border-gray-300 rounded-md p-2 shadow-sm flex items-center justify-between text-xs">
      <div className="space-y-1">
        <h2 className="font-semibold text-gray-900">{task.project_name}</h2>
        <p className="text-gray-700">{task.task_title}</p>
      </div>

      <div>
        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 font-medium">
          {task.to_name ? task.to_name.charAt(0).toUpperCase() : "?"}
        </div>{" "}
        <p className="text-gray-700 text-xs">
          {task.task_status ? task.task_status.slice(0, 3) : "?"}
        </p>
      </div>
    </div>
  );
};

const FullReport = () => {
  const containerRef = useRef();
  const containerHoldRef = useRef();
  const token = useApiToken();

  const {
    data: reportData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["fullreport"],
    queryFn: async () => {
      const response = await axios.post(
        `${Base_Url}/api/panel-fetch-project-task-pending-list-report
`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        tasks: response.data.task || [],
        holdTask: response.data.holdtask || [],
      };
    },
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  const groupTasks = (tasks) => {
    return (tasks ?? []).reduce((acc, project) => {
      if (!acc[project.project_type]) {
        acc[project.project_type] = {};
      }
      if (!acc[project.project_type][project.project_type]) {
        acc[project.project_type][project.project_type] = [];
      }
      acc[project.project_type][project.project_type].push(project);
      return acc;
    }, {});
  };

  const groupedTasks = groupTasks(reportData?.tasks);

  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Task_Report",
    pageStyle: `
      @page {
        size: A4 portrait; /* 
        // margin: 5mm; 
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
 

  if (isLoading) {
    return (
      <Layout>
        <Loader data={"Full Report"} />
      </Layout>
    );
  }

  // Render error state
  if (isError) {
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
          <h2 className="text-2xl">Full Report </h2>

          <ButtonConfigColor
            type="button"
            buttontype="print"
            label="Print"
            onClick={handlPrintPdf}
          />
        </div>
        <div className="overflow-x-auto">
          {Object.entries(groupedTasks).map(([projectName, types], index) => (
            <div key={index} className="mb-3">
              {Object.entries(types).map(([projectType, tasks], typeIndex) => (
                <div key={typeIndex} className="mb-1">
                  <div className="text-xs font-bold p-1 bg-gray-200 print:bg-white border-b border-black my-3">
                    {projectType}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-2">
                    {tasks.map((task, idx) => (
                      <TaskCard key={idx} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {groupedTasks?.length === 0 && (
            <div className="text-center font-semibold text-red-500 py-4">
              No Task Available
            </div>
          )}
        </div>
        <div className="overflow-x-auto hidden print:block" ref={containerRef}>
        

          {Object.entries(groupedTasks).map(([projectName, types], index) => (
            <div key={index} className="mb-3">
              {Object.entries(types).map(([projectType, tasks], typeIndex) => (
                <div key={typeIndex} className="mb-1">
                  <div className="text-sm font-bold p-1 bg-gray-200 print:bg-white border-b border-black my-2">
                    {projectType}
                  </div>
                  <div className="grid  grid-cols-4 gap-2">
                    {tasks.map((task, idx) => (
                      <TaskCard key={idx} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="mb-2">
            <div className="text-sm font-bold p-1 bg-gray-200 print:bg-white border-b border-black my-2">
              All Hold Tasks
            </div>
            <div className="grid grid-cols-4 gap-2">
              {reportData?.holdTask?.map((task, idx) => (
                <TaskCard key={idx} task={task} />
              ))}
            </div>
          </div>
          {reportData?.holdTask?.length === 0 && (
            <div className="text-center font-semibold text-red-500 py-4">
              No Hold Task Available
            </div>
          )}
          {groupedTasks?.length === 0 && (
            <div className="text-center font-semibold text-red-500 py-4">
              No Task Available
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="overflow-x-auto">
          <div className="mb-2">
            <div className="text-xs font-bold p-1 bg-gray-200 print:bg-white border-b border-black my-3">
              All Hold Tasks
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
              {reportData?.holdTask?.map((task, idx) => (
                <TaskCard key={idx} task={task} />
              ))}
            </div>
          </div>
          {reportData?.holdTask?.length === 0 && (
            <div className="text-center font-semibold text-red-500 py-4">
              No Hold Task Available
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FullReport;
