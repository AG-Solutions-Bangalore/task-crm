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
import { Input } from "@/components/ui/input";
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
import { Base_Url, UserImage } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Edit, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ButtonConfigColor from "../buttonComponent/ButtonConfig";
import useApiToken from "../common/UseToken";

const EditUserDialog = ({ onSuccess, userId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [image, setImage] = useState(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    status: "",
    user_image: "",
  });
  const token = useApiToken();

  const fetchCustomerData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${Base_Url}/api/panel-fetch-user-by-id/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data.user;
      setFormData({
        mobile: userData.mobile,
        email: userData.email,
        status: userData.status,
        user_image: userData.user_image,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomerData();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.mobile || !formData.status) {
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
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("status", formData.status);
      if (formData.user_image instanceof File) {
        formDataToSend.append("user_image", formData.user_image);
      }

      const response = await axios.post(
        `${Base_Url}/api/panel-update-user/${userId}?_method=PUT`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.code === 200) {
        toast({
          title: "Success",
          description: response?.data?.msg || "User updated successfully",
        });

        onSuccess?.();
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response?.data?.msg || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        if (file) {
          setImage(URL.createObjectURL(file));
          setFormData((prev) => ({
            ...prev,
            user_image: file,
          }));
        }
      }
    }
  };
  // const handleRemoveImage = () => {
  //   setImage(null);
  //   setFormData((prev) => ({
  //     ...prev,
  //     user_image: null,
  //   }));
  // };
  const fileInputRef = useRef(null);

  const handleRemoveImage = () => {
    setImage(null); // Reset the image state
    setFormData((prev) => ({ ...prev, user_image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        user_image: file,
      }));
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
            <p>Edit User</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information below</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="mobile" className="text-right">
              Mobile *
            </label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="col-span-3"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right">
              Status *
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="user_image" className="text-right">
              Image
            </label>

            {/* <Input
              type="file"
              id="user_image"
              name="user_image"
              onChange={handleImageChange}
              accept="image/*"
              className="col-span-3 hidden"
            /> */}
            {/* <div
              contentEditable
              suppressContentEditableWarning
              onPaste={handlePaste}
              className=" col-span-3 w-full min-h-[120px] flex items-center justify-center border  border-gray-200 text-gray-500 text-sm rounded-md  transition-all"
              onClick={() => document.getElementById("user_image").click()}
            ></div> */}
      
            <div
              onPaste={handlePaste}
              onClick={() => fileInputRef.current?.click()}
              className="col-span-3 w-full min-h-[120px] flex items-center justify-center border border-gray-200 text-gray-500 text-sm rounded-md transition-all cursor-pointer"
            >
              {image || formData.user_image ? (
                <div className="relative w-full flex justify-center">
                  <img
                    src={
                      image ||
                      (formData.user_image
                        ? `${UserImage}/${formData.user_image}`
                        : "")
                    }
                    alt="Uploaded or Pasted"
                    className="max-h-40 object-contain rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md transition-all"
                  >
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <span>Paste an image here</span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <ButtonConfigColor
            loading={isLoading}
            type="submit"
            buttontype="update"
            onClick={handleSubmit}
            disabled={isLoading}
            label="Update User"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
