import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquarePlus } from "lucide-react";
import { Base_Url } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";

const fetchProjects = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${Base_Url}/api/panel-fetch-project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchProjectSub = async (projectId) => {
  if (!projectId) return [];
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${Base_Url}/api/panel-fetch-project-sub/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${Base_Url}/api/panel-fetch-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createTask = async (taskData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${Base_Url}/api/panel-create-task`, 
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const CreateTask = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    project_id: "",
    project_type: "",
    to_id: "",
    task_title: "",
    task_desc: "",
    task_due_date: "",
    task_priority: "Medium", 
  });

  const [projects, setProjects] = useState([]);
  const [projectSubs, setProjectSubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState({
    projects: false,
    projectSubs: false,
    users: false,
  });


  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading((prev) => ({ ...prev, projects: true }));
      try {
        const data = await fetchProjects();
        if (data.code === 200) {
          setProjects(data.project || []);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading((prev) => ({ ...prev, projects: false }));
      }
    };

    const loadUsers = async () => {
      setIsLoading((prev) => ({ ...prev, users: true }));
      try {
        const data = await fetchUsers();
        if (data.code === 200) {
          setUsers(data.user || []);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      } finally {
        setIsLoading((prev) => ({ ...prev, users: false }));
      }
    };

    loadProjects();
    loadUsers();
  }, [toast]);

  useEffect(() => {
    const loadProjectSubs = async () => {
      if (!formData.project_id) {
        setProjectSubs([]);
        return;
      }

      setIsLoading((prev) => ({ ...prev, projectSubs: true }));
      try {
        const data = await fetchProjectSub(formData.project_id);
        if (data.code === 200) {
          setProjectSubs(data.projectSub || []);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch project types",
          variant: "destructive",
        });
      } finally {
        setIsLoading((prev) => ({ ...prev, projectSubs: false }));
      }
    };

    loadProjectSubs();
  }, [formData.project_id, toast]);

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (response) => {
      if (response.code === 200) {
        toast({
          title: "Success",
          description: response.msg || "Task created successfully",
        });

        setFormData({
          project_id: "",
          project_type: "",
          to_id: "",
          task_title: "",
          task_desc: "",
          task_due_date: "",
          task_priority: "Medium",
        });

        if (onSuccess) onSuccess();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to create task",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

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

  const handlePriorityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      task_priority: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.project_id ||
      !formData.project_type ||
      !formData.to_id ||
      !formData.task_title ||
      !formData.task_due_date
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate(formData);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="ml-2">
          <SquarePlus className="h-4 w-4 mr-2" /> Task
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="mb-4">
            <SheetTitle>Create New Task</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            {/* Project Selection */}
            <div className="grid gap-2">
              <Label htmlFor="project_id" className="font-semibold">
                Project *
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("project_id", value)}
                value={formData.project_id}
                disabled={isLoading.projects}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="project_type" className="font-semibold">
                Project Type *
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("project_type", value)}
                value={formData.project_type}
                disabled={isLoading.projectSubs || !formData.project_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectSubs.map((sub, index) => (
                    <SelectItem key={index} value={sub.project_type}>
                      {sub.project_type} (Due: {sub.project_due_date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assign To Selection */}
            <div className="grid gap-2">
              <Label htmlFor="to_id" className="font-semibold">
                Assign To *
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("to_id", value)}
                value={formData.to_id}
                disabled={isLoading.users}
              >
                <SelectTrigger>
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

            {/* Task Title */}
            <div className="grid gap-2">
              <Label htmlFor="task_title" className="font-semibold">
                Task Title *
              </Label>
              <Input
                id="task_title"
                name="task_title"
                value={formData.task_title}
                onChange={handleInputChange}
                placeholder="Enter task title"
              />
            </div>

            {/* Task Description */}
            <div className="grid gap-2">
              <Label htmlFor="task_desc" className="font-semibold">
                Task Description 
              </Label>
              <Textarea
                id="task_desc"
                name="task_desc"
                value={formData.task_desc}
                onChange={handleInputChange}
                placeholder="Enter task description"
                className="min-h-24"
              />
            </div>

            {/* Task Due Date */}
            <div className="grid gap-2">
              <Label htmlFor="task_due_date" className="font-semibold">
                Due Date *
              </Label>
              <Input
                type="date"
                id="task_due_date"
                name="task_due_date"
                value={formData.task_due_date}
                onChange={handleInputChange}
                className="cursor-pointer"
                min={getMinDate()} // Prevent selecting past dates
              />
            </div>

            {/* Task Priority - Using Tabs */}
            <div className="grid gap-2">
              <Label htmlFor="task_priority" className="font-semibold">
                Priority
              </Label>
              <Tabs 
                value={formData.task_priority} 
                onValueChange={handlePriorityChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="Low">Low</TabsTrigger>
                  <TabsTrigger value="Medium">Medium</TabsTrigger>
                  <TabsTrigger value="High">High</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <SheetFooter className="mt-4">
            <Button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="w-full"
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateTask;