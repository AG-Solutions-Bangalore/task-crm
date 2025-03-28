import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateEnvironment } from "./EncryptionDecryption";
import { persistor } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { useToast } from "@/hooks/use-toast";

const ValidationWrapper = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  useEffect(() => {
    const validateAndHandleError = async () => {
      try {
        validateEnvironment();
      } catch (error) {
        console.error("❌ Validation Error:", error.message);

        await persistor.flush();
        localStorage.clear();
        dispatch(logout());
        navigate("/");
        toast({
          title: "Error",
          description: "Invalid environment file detected",
          variant: "destructive",
        });
        setTimeout(() => persistor.purge(), 1000);
      }
    };

    validateAndHandleError();
  }, [navigate, dispatch]);

  return children;
};

export default ValidationWrapper;
