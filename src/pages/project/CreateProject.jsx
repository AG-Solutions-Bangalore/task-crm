// create and mainted by sajid

import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
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
} from "@/components/ui/table";
import { CalendarIcon, Loader2, SquarePlus } from "lucide-react";
import moment from "moment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Base_Url } from "@/config/BaseUrl";

const CreateProject = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    project_name: "",
    project_desc: "",
    project_website: "No",
    project_webApp: "No",
    project_android_app: "No",
    project_ios_app: "No",
    project_marketing: "No",
    project_due_date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        project_due_date: moment(selectedDate).format("YYYY-MM-DD"),
      }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.project_name ||
      !formData.project_desc ||
      !formData.project_due_date
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${Base_Url}/api/panel-create-project`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg || "Project created successfully",
        });

        setFormData({
          project_name: "",
          project_desc: "",
          project_website: "No",
          project_webApp: "No",
          project_android_app: "No",
          project_ios_app: "No",
          project_marketing: "No",
          project_due_date: "",
        });
        if (onSuccess) onSuccess();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.data.msg || "Failed to create project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="ml-2">
          <SquarePlus className="h-4 w-4 mr-2" /> Project
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Create New Project</SheetTitle>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project_name" className="font-semibold">Project Name *</Label>
            <Input
              id="project_name"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              placeholder="Enter project name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project_desc" className="font-semibold">Project Description *</Label>
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
            <Label className="font-semibold">Project Requirements</Label>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="p-2 pl-0">Website</TableCell>
                  <TableCell className="p-2">
                    <RadioGroup 
                      value={formData.project_website} 
                      onValueChange={(value) => handleOptionChange("project_website", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="website-yes" />
                        <Label htmlFor="website-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="website-no" />
                        <Label htmlFor="website-no">No</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="p-2 pl-0">Web App</TableCell>
                  <TableCell className="p-2">
                    <RadioGroup 
                      value={formData.project_webApp} 
                      onValueChange={(value) => handleOptionChange("project_webApp", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="webapp-yes" />
                        <Label htmlFor="webapp-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="webapp-no" />
                        <Label htmlFor="webapp-no">No</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="p-2 pl-0">Android App</TableCell>
                  <TableCell className="p-2">
                    <RadioGroup 
                      value={formData.project_android_app} 
                      onValueChange={(value) => handleOptionChange("project_android_app", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="android-yes" />
                        <Label htmlFor="android-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="android-no" />
                        <Label htmlFor="android-no">No</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="p-2 pl-0">iOS App</TableCell>
                  <TableCell className="p-2">
                    <RadioGroup 
                      value={formData.project_ios_app} 
                      onValueChange={(value) => handleOptionChange("project_ios_app", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="ios-yes" />
                        <Label htmlFor="ios-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="ios-no" />
                        <Label htmlFor="ios-no">No</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="p-2 pl-0">Marketing</TableCell>
                  <TableCell className="p-2">
                    <RadioGroup 
                      value={formData.project_marketing} 
                      onValueChange={(value) => handleOptionChange("project_marketing", value)}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="marketing-yes" />
                        <Label htmlFor="marketing-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="marketing-no" />
                        <Label htmlFor="marketing-no">No</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project_due_date" className="font-semibold">Due Date *</Label>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                id="project_due_date"
                name="project_due_date"
                onChange={handleDateChange}
                min={moment().format("YYYY-MM-DD")}
                className={cn(
                  "font-normal",
                  !formData.project_due_date && "text-muted-foreground"
                )}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateProject;