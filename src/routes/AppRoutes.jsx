import {   Route, Routes } from "react-router-dom";
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


function AppRoutes() {
  return (

      <Routes>
        <Route path="/" element={<AuthRoute />}>
        <Route path="/" element={<SignIn />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
        <Route path="/home" element={<Dashboard />} />

               <Route path="/company" element={<CompanyList />} />
                <Route path="/user" element={<UserList />} />
                <Route path="/project" element={<ProjectList />} />
                <Route path="/task" element={<AllTaskList />} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    
  );
}

export default AppRoutes;