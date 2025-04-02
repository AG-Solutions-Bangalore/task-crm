import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import useApiToken from "@/components/common/UseToken";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Base_Url } from "@/config/BaseUrl";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CommentTask = ({ id, fetchTaskData }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const token = useApiToken();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    task_id: "",
    task_comment: "",
    task_comment_img: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
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
            task_comment_img: file,
          }));
        }
      }
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setFormData((prev) => ({
      ...prev,
      task_comment_img: null,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !formData.task_comment) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("task_id", id);
      formDataObj.append("task_comment", formData.task_comment);
      if (formData.task_comment_img) {
        formDataObj.append("task_comment_img", formData.task_comment_img);
      }
      for (let pair of formDataObj.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await axios.post(
        `${Base_Url}/api/panel-create-task-comment`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: response.data.msg || "Comment submitted successfully",
        });
        fetchTaskData();
        setFormData({ task_comment: "", task_comment_img: null });
        setImage(null);
      } else {
        toast({
          title: "Error",
          description: response.msg || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <Label htmlFor="task_comment" className="font-semibold">
                Task Comment *
              </Label>
              <Textarea
                id="task_comment"
                name="task_comment"
                value={formData.task_comment}
                onChange={handleInputChange}
                placeholder="Enter task description"
                className="min-h-24"
              />
            </div>

            {/* <div>
              <Label htmlFor="task_comment_img" className="font-semibold">
                Task Image
              </Label>
              <Input
                type="file"
                id="task_comment_img"
                name="task_comment_img"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div> */}
            <div>
              <Label htmlFor="task_comment_img"> Image</Label>

              <div
                onPaste={handlePaste}
                className=" col-span-3 w-full min-h-24 flex items-center justify-center border  border-gray-200 text-gray-500 text-sm rounded-md  transition-all"
                onClick={() =>
                  document.getElementById("task_comment_img").click()
                }
              >
                {image ? (
                  <div className="relative w-full flex justify-center">
                    <img
                      src={image}
                      alt="Uploaded or Pasted"
                      className="max-h-40 object-contain rounded-md"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md  transition-all"
                    >
                      <XCircle className="w-5 h-5 text-gray-600 " />
                    </button>
                  </div>
                ) : (
                  <span>Paste an image here</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <ButtonConfigColor
              loading={loading}
              type="submit"
              buttontype="submit"
              label={loading ? "Creating..." : "Create Comment"}
            />
            <ButtonConfigColor
              type="button"
              buttontype="back"
              label="Back"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CommentTask;
