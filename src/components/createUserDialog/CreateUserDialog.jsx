import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

import { Base_Url } from "@/config/BaseUrl";
import { useLocation } from "react-router-dom";
import ButtonConfigColor from "../buttonComponent/ButtonConfig";
import useApiToken from "../common/UseToken";

const CreateUserDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { pathname } = useLocation();
  const token = useApiToken();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    user_image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      console.log("File Selected:", files[0]);
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };
  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("user_image", formData.user_image);
      const response = await axios.post(
        `${Base_Url}/api/panel-create-user`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });

        setFormData({
          name: "",
          mobile: "",
          email: "",
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
        description: error.response?.data?.message || "Failed to Create User",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {pathname.startsWith("/company/view") || pathname === "/user" ? (
          // <Button variant="default" className={`ml-2 `}>
          //   <SquarePlus className="h-4 w-4" /> User
          // </Button>

          <ButtonConfigColor
            type="button"
            buttontype="create"
            label="User"
            className="ml-2"
          />
        ) : pathname === "/create-contract" ||
          pathname === "/create-invoice" ? (
          // <p className="text-xs text-blue-600  hover:text-red-800 cursor-pointer">
          //   <span className="flex items-center flex-row gap-1">
          //     <SquarePlus className="w-4 h-4" /> <span>Add</span>
          //   </span>

          <ButtonConfigColor
            type="button"
            buttontype="create"
            label="Add"
            className="ml-2"
          />
        ) : // </p>
        null}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter Mobile"
              onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              maxLength={10}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              type="email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email"> Task Image</Label>

            <Input
              type="file"
              id="user_image"
              name="user_image"
              onChange={handleImageChange}
              accept="image/*"
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <ButtonConfigColor
            loading={isLoading}
            type="submit"
            buttontype="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            label="Create User"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
