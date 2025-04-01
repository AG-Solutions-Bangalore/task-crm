import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Loader from "@/components/loader/Loader";

const TaskDialog = ({ imageUrl, classcss, label }) => {
  const [loading, setLoading] = useState(!!imageUrl);
  const [error, setError] = useState(false);

  return (
    <Dialog>
      {imageUrl != null && (
        <TooltipProvider>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="transition-all duration-200 hover:bg-blue-50"
                >
                  <Image
                    className={`h-4 w-4 transition-all duration-200 hover:text-blue-500 ${
                      classcss || ""
                    }`}
                  />
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent>
              <p>View Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label || "Image"}</DialogTitle>
        </DialogHeader>

        {/* Loader Section */}
        {loading && !error && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader data="Image" />
          </div>
        )}

        {/* Image Section */}
        {imageUrl && !error ? (
          <img
            src={imageUrl}
            alt="Task"
            className={`w-full h-auto rounded-lg ${
              loading ? "hidden" : "block"
            }`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        ) : (
          !loading && (
            <p className="text-center text-gray-500">No image available</p>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
