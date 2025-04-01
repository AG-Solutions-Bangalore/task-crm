import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TaskDialog from "./ImageTask";
import moment from "moment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ButtonConfigColor from "@/components/buttonComponent/ButtonConfig";
import { Base_Url, CommnentImage } from "@/config/BaseUrl";
import useApiToken from "@/components/common/UseToken";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const CommentTask = ({ commentData, id }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const token = useApiToken();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    task_id: "",
    task_comment: "",
    task_comment_img: "",
  });
  const isCreateCommentPage = location.pathname.startsWith(
    "/task-create-comment/"
  );
  const latestComment =
    isCreateCommentPage && commentData?.length > 0
      ? commentData[commentData.length - 1]
      : null;
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
        setFormData({ task_comment: "", task_comment_img: null }); // Reset form
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
      <div className="mt-6">
        <h3 className="font-semibold text-lg">Task Comments</h3>
        {commentData?.length > 0 ? (
          <div className="space-y-4 mt-4">
            {isCreateCommentPage && latestComment ? (
              <div
                key={latestComment.id}
                className="p-4 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center  h-full text-xs text-gray-500">
                  <div className="text-xs text-gray-500 ">
                    {latestComment.task_comment_date
                      ? moment(latestComment.task_comment_date).format(
                          "DD-MM-YYYY"
                        )
                      : "No date available."}
                  </div>
                  <TaskDialog
                    imageUrl={`${CommnentImage}${latestComment.task_comment_img}`}
                    label="Comment Image"
                  />
                </div>

                <div className="text-sm text-gray-700">
                  {latestComment.task_comment || "No comment available."}
                </div>
              </div>
            ) : (
              <div className="mt-6 max-h-80 overflow-y-auto">
                <div className="space-y-4 mt-4">
                  {commentData
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((commentItem) => (
                      <div
                        key={commentItem.id}
                        className="p-4 bg-gray-100 rounded-md shadow-sm"
                      >
                        <div className="flex items-center  h-full text-xs text-gray-500">
                          <div className="text-xs text-gray-500">
                            {commentItem.task_comment_date
                              ? moment(commentItem.task_comment_date).format(
                                  "DD-MM-YYYY"
                                )
                              : "No date available."}
                          </div>
                          {commentItem.task_comment_img != null && (
                            <TaskDialog
                              imageUrl={`${CommnentImage}${commentItem.task_comment_img}`}
                              label="Comment Image"
                            />
                          )}
                        </div>

                        <div className="text-sm text-gray-700">
                          {commentItem.task_comment || "No comment available."}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <h2 className="flex justify-center">There is No Previous Comment</h2>
        )}
        {location.pathname.startsWith("/task-create-comment/") && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 my-4">
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

              <div>
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
        )}
      </div>
    </>
  );
};

export default CommentTask;
