import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SignIn from "../pages/auth/SignIn";
import Dashboard from "../pages/home/Dashboard";
import AllTaskList from "../pages/task/AllTaskList";
import ProjectList from "../pages/project/ProjectList";
import UserList from "../pages/user/UserList";
import CompanyList from "../pages/company/CompanyList";
import NotFound from "../pages/errors/NotFound";
import CompanyView from "@/pages/company/CompanyView";
import ProjectReport from "@/pages/report/ProjectReport/ProjectReport";
import UserReport from "@/pages/report/UserReport/UserReport";
import ProjectTask from "@/pages/report/ProjectTask/ProjectTask";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Route>

      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/home" element={<Dashboard />} />

        {/* company  */}
        <Route path="/company" element={<CompanyList />} />
        <Route path="/company/view/:id" element={<CompanyView />} />

        {/* user  */}
        <Route path="/user" element={<UserList />} />
        {/* project  */}
        <Route path="/project" element={<ProjectList />} />
        {/* task  */}
        <Route path="/task" element={<AllTaskList />} />
        {/* //Reports */}
        <Route path="/report/project" element={<ProjectReport />} />
        <Route path="/report/task" element={<UserReport />} />
        <Route path="/report/project/task" element={<ProjectTask />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
