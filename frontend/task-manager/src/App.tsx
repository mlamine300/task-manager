import { Route, Routes } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
// import UserDashBoard from "./pages/User/Dashboard";
import CreateTask from "./pages/Admin/CreateTask";
import ManageTasks from "./pages/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
// import Mytasks from "./pages/User/Mytasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <div className="layout bg-background-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          {/* <Route path="/admin/*" element={<Dashboard />} /> */}
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/create-task/:taskId" element={<CreateTask />} />
          {/* <Route path="/admin/tasks" element={<ManageTasks />} /> */}
          <Route path="/users" element={<ManageUsers />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["member", "admin"]} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<ManageTasks />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["member"]} />}>
          <Route path="/tasks/:id" element={<ViewTaskDetails />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
