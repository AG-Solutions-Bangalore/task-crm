import Loader from "@/components/loader/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const ImageDialog = ({ imageUrl, label, isDialogOpen, setIsDialogOpen }) => {
  const [loading, setLoading] = useState(!!imageUrl);
  const [error, setError] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{label || ""}</DialogTitle>
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

export default ImageDialog;
