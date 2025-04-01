import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import useApiToken from "@/components/common/UseToken";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Base_Url } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Edit } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EditTask = ({ onSuccess, taskId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = useApiToken();
  const storedUserType = useSelector((state) => state.auth.user_type);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    task_title: "",
    task_desc: "",
    task_due_date: "",
    task_priority: "",
    task_status: "",
    to_id: "",
  });

  // Static options for dropdowns
  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "In Process", label: "In Process" },
    { value: "Completed", label: "Completed" },
    { value: "Cancel", label: "Cancel" },
    ...(storedUserType === 2 ? [{ value: "Finish", label: "Finish" }] : []),
  ];
  const fetchUsers = async (token) => {
    const response = await axios.get(`${Base_Url}/api/panel-fetch-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const fetchTaskData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-task-by-id/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const taskData = response.data.task;
      setFormData({
        task_title: taskData.task_title,
        task_desc: taskData.task_desc,
        task_due_date: taskData.task_due_date,
        task_priority: taskData.task_priority,
        task_status: taskData.task_status,
        to_id: taskData.to_id ? taskData.to_id.toString() : "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch task data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };
  const loadUsers = async () => {
    try {
      const data = await fetchUsers(token);
      console.log("edit");
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
    if (open && users) {
      fetchTaskData();
    }
    if (open) {
      loadUsers();
    }
  }, [open]);

  const handlePriorityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      task_priority: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      task_status: value,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(storedUserType);
  const handleSubmit = async () => {
    if (!formData.task_priority || !formData.task_status) {
      toast({
        title: "Error",
        description: "Please select priority and status",
        variant: "destructive",
      });
      return;
    }
    if (storedUserType == 2) {
      if (!formData.to_id) {
        toast({
          title: "Error",
          description: "Please select Assign To",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    const payload = {
      task_priority: formData.task_priority,
      task_status: formData.task_status,
      task_desc: formData.task_desc,
      to_id: formData.to_id,
    };
    try {
      const response = await axios.put(
        `${Base_Url}/api/panel-update-task/${taskId}`,
        payload,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        if (onSuccess) onSuccess();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-200 ${
                  isHovered ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Edit
                  className={`h-4 w-4 transition-all duration-200 ${
                    isHovered ? "text-blue-500" : ""
                  }`}
                />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task priority and status below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task_title" className="text-right">
              Title
            </Label>
            <div className="col-span-3 px-3 py-2 text-sm border rounded-md">
              {formData.task_title}
            </div>
          </div>
          {storedUserType !== 2 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task_desc" className="text-right">
                Description
              </Label>

              <div
                id="task_desc"
                className="col-span-3 px-3 py-2 text-sm border rounded-md resize-none overflow-hidden  min-h-[40px]"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {formData.task_desc}
              </div>
            </div>
          )}
          {storedUserType === 2 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task_desc" className="text-right">
                Description
              </Label>
              <div className="col-span-3 text-sm">
                <textarea
                  id="task_desc"
                  name="task_desc"
                  value={formData.task_desc}
                  onChange={handleInputChange}
                  className="px-3 py-2 text-sm border rounded-md resize-none min-h-[40px] overflow-hidden w-full"
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  rows={3}
                  placeholder="Enter task description..."
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task_due_date" className="text-right">
              Due Date
            </Label>
            <div className="col-span-3 px-3 py-2 text-sm border rounded-md">
              {formData.task_due_date
                ? moment(formData.task_due_date).format("DD-MM-YYYY")
                : ""}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task_priority" className="text-right">
              Priority
            </Label>
            <Select
              value={formData.task_priority}
              onValueChange={handlePriorityChange}
              disabled={isFetching}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task_status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.task_status}
              onValueChange={handleStatusChange}
              disabled={isFetching}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {storedUserType === 2 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to_id" className="text-right">
                Assign To
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("to_id", value)}
                value={formData.to_id}
                disabled={isFetching}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <ButtonConfigColor
            loading={isLoading}
            type="submit"
            buttontype="update"
            onClick={handleSubmit}
            disabled={isLoading || isFetching}
            label="Update Task"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
