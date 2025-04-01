import useApiToken from "@/components/common/UseToken";
import Loader from "@/components/loader/Loader";
import { Label } from "@/components/ui/label";
import { Base_Url, CommnentImage, TaskImage } from "@/config/BaseUrl";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import TaskDialog from "./ImageTask";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import CommentTask from "./CommentTask";

const TaskDetail = ({ label, value }) => (
  <div className="items-center">
    <div>
      <Label className="font-semibold text-sm">{label}:</Label>
    </div>
    <div className=" text-xs sm:text-sm text-gray-700 flex items-center justify-between p-2 bg-gray-100 rounded-md shadow-sm">
      {value || "N/A"}
    </div>
  </div>
);

const ViewComponentTask = () => {
  const [users, setUsers] = useState([]);
  const token = useApiToken();
  const [formData, setFormData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { label, comment } = location.state || {};
  const fetchTaskData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-task-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const taskData = response.data.task;
      setFormData(taskData);
      setCommentData(response.data.taskComment);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch task data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const loadUsers = async () => {
    try {
      const response = await axios.get(`${Base_Url}/api/panel-fetch-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.code === 200) {
        setUsers(data.user || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchTaskData();
    loadUsers();
  }, []);
  const assignedUser = users.find((user) => user.id == formData.to_id);
  const imageUrl = formData.task_img
    ? `${TaskImage}${formData.task_img}`
    : null;

  return (
    <Layout>
      <div className="p-6 bg-white rounded-md shadow-md">
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold">{label}</h2>
            <div className="space-x-3">
              <TaskDialog imageUrl={imageUrl} label="Task Image" />

              <ButtonConfigColor
                type="button"
                buttontype="back"
                label="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader />
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && (
            <>
              {/* Task Details Grid */}
              <div className="grid grid-cols-1 gap-3 py-2">
                <TaskDetail label="Title" value={formData.task_title} />
                <TaskDetail label="Description" value={formData.task_desc} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <TaskDetail label="Priority" value={formData.task_priority} />
                <TaskDetail
                  label="Assign To"
                  value={assignedUser ? assignedUser.name : "N/A"}
                />
                <TaskDetail
                  label="Due Date"
                  value={
                    formData.task_due_date
                      ? moment(formData.task_due_date).format("DD-MM-YYYY")
                      : ""
                  }
                />
                <TaskDetail label="Status" value={formData.task_status} />
              </div>
            </>
          )}

          <CommentTask commentData={commentData} id={id} />
        </div>
      </div>
    </Layout>
  );
};

export default ViewComponentTask;
