import Loader from "@/components/loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Base_Url } from "@/config/BaseUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useApiToken from "@/components/common/UseToken";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);
  const token = useApiToken();
  const storedUserType = useSelector((state) => state.auth.user_type);
  useEffect(() => {
    setUserType(storedUserType);

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${Base_Url}/api/panel-fetch-dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loader data={"Dashboard"} />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-red-500 text-center p-4">{error}</div>
      </Layout>
    );
  }

  const projectCards = [
    {
      title: "Pending Projects",
      value: dashboardData?.project_pending_count,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Confirmed Projects",
      value: dashboardData?.project_confirmed_count,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "In Progress",
      value: dashboardData?.project_onprogress_count,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Canceled",
      value: dashboardData?.project_cancel_count,
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Completed",
      value: dashboardData?.project_completed_count,
      color: "bg-green-100 text-green-800",
    },
  ];

  const taskCards = [
    {
      title: "Pending Tasks",
      value: dashboardData?.task_pending_count,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Approved Tasks",
      value: dashboardData?.task_approved_count,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "In Process",
      value: dashboardData?.task_inprocess_count,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Completed",
      value: dashboardData?.task_completed_count,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Canceled",
      value: dashboardData?.task_cancel_count,
      color: "bg-red-100 text-red-800",
    },

    {
      title: "Finish",
      value: dashboardData?.task_finish_count,
      color: "bg-green-300 text-green-800",
    },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        {userType == "2" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {projectCards.map((card, index) => (
              <Card key={`project-${index}`} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center ${card.color}`}
                  >
                    {card.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        )}

        {/* Conditionally render Tasks Section based on userType */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {taskCards.map((card, index) => (
              <Card key={`task-${index}`} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center ${card.color}`}
                  >
                    {card.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
