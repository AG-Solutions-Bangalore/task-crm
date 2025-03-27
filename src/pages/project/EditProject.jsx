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
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, PlusCircle, MinusCircle, Trash2, Loader2 } from "lucide-react";
import { Base_Url } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PROJECT_TYPES = [
  "Marketing",
  "IOS App",
  "Android App",
  "Web Application",
  "Website"
];

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "On Progress", label: "On Progress" },
  { value: "Cancel", label: "Cancel" },
  { value: "Completed", label: "Completed" },
];

const updateProject = async ({ projectId, projectData }) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${Base_Url}/api/panel-update-project/${projectId}`,
    projectData,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

const deleteProjectSub = async (projectSubId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `${Base_Url}/api/panel-delete-project-sub/${projectSubId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
};

const EditProject = ({ projectId, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    project_name: "",
    client_name: "",
    project_desc: "",
    project_status: "Pending",
  });

  const [projectData, setProjectData] = useState([
    {
      id: null,
      project_type: "",
      project_due_date: "",
      projectSub_status: "Pending",
    },
  ]);

  useEffect(() => {
    if (open && projectId) {
      fetchProjectData();
    }
  }, [open, projectId]);

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchProjectData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-project-by-id/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.code === 200) {
        const project = response.data.project;
        setFormData({
          project_name: project.project_name,
          client_name: project.client_name,
          project_desc: project.project_desc,
          project_status: project.project_status,
        });

        const mappedProjectData = response.data.projectSub.map(sub => ({
          id: sub.id,
          project_type: sub.project_type,
          project_due_date: sub.project_due_date,
          projectSub_status: sub.projectSub_status,
        }));

        setProjectData(mappedProjectData.length > 0 ? mappedProjectData : [
          {
            id: null,
            project_type: "",
            project_due_date: "",
            projectSub_status: "Pending",
          },
        ]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project data",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, projectData }) => updateProject({ projectId, projectData }),
    onSuccess: (response) => {
      if (response.code === 200) {
        toast({
          title: "Success",
          description: response.msg || "Project updated successfully",
        });

        if (onSuccess) onSuccess();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to update project",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteProjectSubMutation = useMutation({
    mutationFn: deleteProjectSub,
    onSuccess: (response, projectSubId) => {
      if (response.code === 200) {
        toast({
          title: "Success",
          description: response.msg || "Project item deleted successfully",
        });
        setProjectData(prev => prev.filter(item => item.id !== projectSubId));
      } else {
        toast({
          title: "Error",
          description: response.msg || "Failed to delete project item",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project item",
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
        id: null,
        project_type: "",
        project_due_date: "",
        projectSub_status: "Pending",
      },
    ]);
  };

  const removeProjectDataRow = (index) => {
    const item = projectData[index];
    if (item.id) {
      setDeleteItemId(item.id);
      setDeleteConfirmOpen(true);
    } else {
      setProjectData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const confirmDelete = async () => {
    if (deleteItemId) {
      await deleteProjectSubMutation.mutateAsync(deleteItemId);
    }
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.project_name || !formData.client_name || !projectData[0].project_type || !projectData[0].project_due_date) {
      toast({
        title: "Error",
        description: "Fill the required fields",
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

    const requestData = {
      ...formData,
      project_data: projectData.map(item => ({
        id: item.id || undefined,
        project_type: item.project_type,
        project_due_date: item.project_due_date,
        projectSub_status: item.projectSub_status,
      })),
    };

    updateProjectMutation.mutate({ projectId, projectData: requestData });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="mb-4">
            <SheetTitle>Edit Project - {formData.client_name}</SheetTitle>
          </SheetHeader>

          {isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-2">
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
                      className="cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project_status" className="font-semibold">
                      Project Status
                    </Label>
                    <Select
                      value={formData.project_status}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, project_status: value }))
                      }
                    >
                      <SelectTrigger className="">
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
                        <TableHead>Status</TableHead>
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
                                handleProjectDataChange(index, "project_type", value)
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
                            <Select
                              value={item.projectSub_status}
                              onValueChange={(value) =>
                                handleProjectDataChange(
                                  index,
                                  "projectSub_status",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-[150px]">
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
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProjectDataRow(index)}
                              type="button"
                            >
                              {item.id ? (
                                <Trash2 className="h-4 w-4 text-red-500" />
                              ) : (
                                <MinusCircle className="h-4 w-4 text-red-500" />
                              )}
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
                <Button
                  type="submit"
                  disabled={updateProjectMutation.isPending}
                  className="w-full"
                >
                  {updateProjectMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Project"
                  )}
                </Button>
              </SheetFooter>
            </>
          )}
        </form>

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                disabled={deleteProjectSubMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteProjectSubMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
};

export default EditProject;