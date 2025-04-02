import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import useApiToken from "@/components/common/UseToken";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Base_Url } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useState } from "react";

const PROJECT_TYPES = [
  "Marketing",
  "IOS App",
  "Android App",
  "Web Application",
  "Website",
  "Festive Posts",
];

const createProject = async (projectData, token) => {
  const response = await axios.post(
    `${Base_Url}/api/panel-create-project`,
    projectData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const CreateProject = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const token = useApiToken();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    project_desc: "",
    client_name: "",
  });

  const [projectData, setProjectData] = useState([
    {
      project_type: "",
      project_due_date: "",
    },
  ]);

  const createProjectMutation = useMutation({
    // mutationFn: createProject,
    mutationFn: ({ taskData, token }) => createProject(taskData, token),

    onSuccess: (response) => {
      setLoading(false);
      if (response.code === 200) {
        toast({
          title: "Success",
          description: response.msg || "Project created successfully",
        });

        // Reset form
        setFormData({
          project_name: "",
          project_desc: "",
          client_name: "",
        });

        setProjectData([
          {
            project_type: "",
            project_due_date: "",
          },
        ]);

        if (onSuccess) onSuccess();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to create project",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
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

  const handleProjectDataChange = (index, field, value) => {
    const newProjectData = [...projectData];
    newProjectData[index] = {
      ...newProjectData[index],
      [field]: value,
    };
    setProjectData(newProjectData);
  };

  const addProjectDataRow = () => {
    setProjectData((prev) => [
      ...prev,
      {
        project_type: "",
        project_due_date: "",
      },
    ]);
  };

  const removeProjectDataRow = (index) => {
    if (projectData.length > 1) {
      setProjectData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.project_name ||
      !formData.client_name ||
      !projectData[0].project_type ||
      !projectData[0].project_due_date
    ) {
      toast({
        title: "Error",
        description: "Fill the required field",
        variant: "destructive",
      });
      return;
    }

    for (const item of projectData) {
      if (!item.project_type || !item.project_due_date) {
        toast({
          title: "Error",
          description: "All project types and due dates must be filled",
          variant: "destructive",
        });
        return;
      }
    }
    setLoading(true);

    // Prepare request data
    const requestData = {
      ...formData,
      project_data: projectData,
    };

    // Trigger mutation
    createProjectMutation.mutate({ taskData: requestData, token });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <ButtonConfigColor
          type="button"
          buttontype="create"
          label="Project"
          className="ml-2"
        />
      </SheetTrigger>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="mb-4">
            <SheetTitle>Create New Project</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client_name" className="font-semibold">
                Client Name *
              </Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project_name" className="font-semibold">
                Project Name *
              </Label>
              <Input
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
                placeholder="Enter project name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project_desc" className="font-semibold">
                Project Description
              </Label>
              <Textarea
                id="project_desc"
                name="project_desc"
                value={formData.project_desc}
                onChange={handleInputChange}
                placeholder="Enter project description"
                className="min-h-24"
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-semibold">Project Details *</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-10">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.project_type}
                          onValueChange={(value) =>
                            handleProjectDataChange(
                              index,
                              "project_type",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={item.project_due_date}
                          min={getMinDate()}
                          onChange={(e) =>
                            handleProjectDataChange(
                              index,
                              "project_due_date",
                              e.target.value
                            )
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProjectDataRow(index)}
                          disabled={projectData.length === 1}
                          type="button"
                        >
                          <MinusCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  onClick={addProjectDataRow}
                  variant="outline"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Row
                </Button>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-4">
            <ButtonConfigColor
              loading={loading}
              type="submit"
              buttontype="submit"
              disabled={createProjectMutation.isPending}
              label={
                createProjectMutation.isPending
                  ? "Creating..."
                  : "Create Project"
              }
              className="w-full"
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateProject;
