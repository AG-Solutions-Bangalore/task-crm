import { Base_Url } from '@/config/BaseUrl';
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Edit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ButtonConfigColor from '@/components/buttonComponent/ButtonConfig';

const EditTask = ({ onSuccess, taskId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    task_title: '',
    task_desc: '',
    task_due_date: '',
    task_priority: '',
    task_status: ''
  });

  // Static options for dropdowns
  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'In Process', label: 'In Process' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancel', label: 'Cancel' }
  ];

  const fetchTaskData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
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
        task_status: taskData.task_status
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

  useEffect(() => {
    if (open) {
      fetchTaskData();
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

  const handleSubmit = async () => {
    if (!formData.task_priority || !formData.task_status) {
      toast({
        title: "Error",
        description: "Please select priority and status",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${Base_Url}/api/panel-update-task/${taskId}`,
        {
          task_priority: formData.task_priority,
          task_status: formData.task_status
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task_desc" className="text-right">
              Description
            </Label>
            <div className="col-span-3 px-3 py-2 text-sm border rounded-md">
              {formData.task_desc}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task_due_date" className="text-right">
              Due Date
            </Label>
            <div className="col-span-3 px-3 py-2 text-sm border rounded-md">
              {formData.task_due_date}
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