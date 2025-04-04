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
import ValidationWrapper from "@/components/common/ValidationWrapper";
import ViewComponentTask from "@/pages/task/ViewComponentTask";
import CompletedTaskList from "@/pages/task/CompletedTaskList";
import FinishedTaskList from "@/pages/task/FinishedTaskList";
import ProjectDate from "@/pages/report/ProjectDate/ProjectDate";
import ProjectAssign from "@/pages/report/ProjectAssign/ProjectAssign";
import HoldTaskList from "@/pages/task/HoldTaskList";
import FullReport from "@/pages/report/FullReport/FullReport";
import RegularTaskList from "@/pages/task/RegularTaskList";
import PaymentList from "@/pages/payment/PaymentList";

function AppRoutes() {
  return (
    <ValidationWrapper>
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
          {/* payment  */}
          <Route path="/payment" element={<PaymentList />} />
          {/* task  */}
          <Route path="/task" element={<AllTaskList />} />
          <Route path="/task-hold" element={<HoldTaskList />} />
          <Route path="/task-completed" element={<CompletedTaskList />} />
          <Route path="/task-finished" element={<FinishedTaskList />} />
          <Route path="/task-regular" element={<RegularTaskList />} />
          <Route path="/task-project-date" element={<ProjectDate />} />
          <Route path="/task-project-assign" element={<ProjectAssign />} />
          <Route path="/task-view-task/:id" element={<ViewComponentTask />} />
          <Route
            path="/task-create-comment/:id"
            element={<ViewComponentTask />}
          />
          {/* //Reports */}
          <Route path="/report/project" element={<ProjectReport />} />
          <Route path="/report/task" element={<UserReport />} />
          <Route path="/report/project/task" element={<ProjectTask />} />
          <Route path="/full-report" element={<FullReport />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ValidationWrapper>
  );
}

export default AppRoutes;
