import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const DisableRightClick = () => {
  const { toast } = useToast();
  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
      toast({
        title: "Blocked",
        description: "No Aceess",
        variant: "destructive",
      });
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" || // F12 - Dev Tools
        (e.ctrlKey && e.key.toLowerCase() === "u") || // Ctrl + U - View Source
        (e.ctrlKey && e.key.toLowerCase() === "s") || // Ctrl + S - Save Page
        (e.ctrlKey && e.key.toLowerCase() === "h") || // Ctrl + H - History
        // (e.ctrlKey && e.key.toLowerCase() === "a") || // Ctrl + A - Select All
        (e.ctrlKey && e.key.toLowerCase() === "p") || // Ctrl + P - Print
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") || // Ctrl + Shift + I - Dev Tools
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") || // Ctrl + Shift + J - Dev Console
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") || // Ctrl + Shift + C - Inspect
        (e.metaKey && e.key.toLowerCase() === "s") || // CMD + S (Mac Save Page)
        (e.metaKey && e.key.toLowerCase() === "u") // CMD + U (Mac View Source)
      ) {
        e.preventDefault();
        toast({
          title: "Blocked",
          description: "This action is disabled on this page",
          variant: "destructive",
        });
        return false;
      }
    };

    const preventDefaultBehavior = (e) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", preventDefaultBehavior);
    document.onkeydown = handleKeyDown;

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", preventDefaultBehavior);
      document.onkeydown = null;
    };
  }, []);

  return null;
};

export default DisableRightClick;
