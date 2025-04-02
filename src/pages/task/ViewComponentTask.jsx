import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import useApiToken from "@/components/common/UseToken";
import Layout from "@/components/Layout";
import Loader from "@/components/loader/Loader";
import { Label } from "@/components/ui/label";
import { Base_Url, CommnentImage, TaskImage } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommentTask from "./CommentTask";
import TaskDialog from "./ImageTask";
import { useSelector } from "react-redux";
import { decryptId } from "@/components/common/EncryptionDecryption";

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
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth.user_type);
  const location = useLocation();

  const comment = location.state?.comment || false;
  const fetchTaskData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-task-by-id/${decryptedId}`,
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
            <h2 className="text-2xl font-semibold">Create Comment</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg">Comments</h3>
              {commentData?.length > 0 ? (
                <div className="space-y-4 ">
                  <div className=" max-h-80 overflow-y-auto">
                    <div className="space-y-4 mt-2">
                      {commentData
                        .slice()
                        .sort((a, b) => b.id - a.id)
                        .map((commentItem) => (
                          <div
                            key={commentItem.id}
                            className="p-4 bg-gray-100 rounded-md shadow-sm"
                          >
                            <div className="flex items-center  h-full text-xs text-gray-500">
                              <div className="text-xs text-gray-500">
                                {commentItem.task_comment_date
                                  ? moment(
                                      commentItem.task_comment_date
                                    ).format("DD-MM-YYYY")
                                  : "No date available."}
                              </div>
                              {commentItem.task_comment_img != null && (
                                <TaskDialog
                                  imageUrl={`${CommnentImage}${commentItem.task_comment_img}`}
                                  label="Comment Image"
                                />
                              )}
                            </div>

                            <div className="text-sm text-gray-700">
                              {commentItem.task_comment ||
                                "No comment available."}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <h2 className="flex justify-center min-h-80 items-center font-bold">
                  There is No Previous Comment
                </h2>
              )}
            </div>
            {!loading && (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Task</h3>

                  <TaskDetail label="Title" value={formData.task_title} />
                  <TaskDetail label="Description" value={formData.task_desc} />
                  <div className="grid grid-cols-2 gap-4">
                    <TaskDetail
                      label="Priority"
                      value={formData.task_priority}
                    />
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
                </div>
              </>
            )}
          </div>

          {userType === 2 && comment !== true && (
            <CommentTask
              commentData={commentData}
              id={decryptedId}
              fetchTaskData={fetchTaskData}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewComponentTask;
