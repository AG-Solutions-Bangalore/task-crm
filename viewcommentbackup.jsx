import useApiToken from "@/components/common/UseToken";
import Loader from "@/components/loader/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Base_Url } from "@/config/BaseUrl";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import TaskDialog from "./ImageTask";

const TaskDetail = ({ label, value }) => (
  <div className="grid grid-cols-12 gap-2 items-center">
    <div className="col-span-12 sm:col-span-3">
      <Label className="font-semibold text-sm">{label}:</Label>
    </div>
    <div className="col-span-12 sm:col-span-9 text-xs sm:text-sm text-gray-700 flex items-center justify-between p-2 bg-gray-100 rounded-md shadow-sm">
      {value || "N/A"}
    </div>
  </div>
);

const fetchUsers = async (token) => {
  const response = await axios.get(`${Base_Url}/api/panel-fetch-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const ViewComponentTask = ({
  formData,
  open,
  setOpen,
  loading,
  error,
  label,
  subtitle,
  comment,
  taskData,
}) => {
  const [users, setUsers] = useState([]);
  const token = useApiToken();

  const loadUsers = async () => {
    try {
      const data = await fetchUsers(token);
      if (data.code == 200) {
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
  console.log(taskData);
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const assignedUser = users.find((user) => user.id == formData.to_id);

  return (
    <>
      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          {taskData?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Task Comments</h3>
              <div className="space-y-4 mt-4">
                {taskData?.map((commentItem) => (
                  <div
                    key={commentItem.id}
                    className="p-4 bg-gray-100 rounded-md shadow-sm"
                  >
                    <div className="text-sm text-gray-700">
                      {commentItem.task_comment || "No comment available."}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {commentItem.task_comment_date || "No date available."}
                    </div>
                    <TaskDialog imageUrl={commentItem.task_comment_img} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewComponentTask;
