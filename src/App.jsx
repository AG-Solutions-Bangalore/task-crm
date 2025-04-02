import DisableRightClick from "./components/common/DisableRightClick";
import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <DisableRightClick />
      <Toaster />
      <AppRoutes />
    </>
  );
}

export default App;
