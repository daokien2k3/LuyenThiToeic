import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/user/Home";
import Tests from "./pages/user/Test";
import TestDetail from "./pages/user/TestDetail";
import Result from "./pages/user/Result";
import Statistic from "./pages/user/Statistics";
import Profile from "./pages/user/Profile";
import DoTest from "./pages/user/DoTest";

import Dashboard from "./pages/admin/Dashboard";
import AdminQuestionManager from "./pages/admin/QuestionManager";
import ExamManager from "./pages/admin/ExamManager";
import CommentManager from "./pages/admin/CommentManager";

function App() {
  return (
    <Router>
      <Routes>

        {/* Routes main */}
        <Route path="/*" element={<MainLayout />} />

        {/* Routes user */}
        <Route path="/user/*" element={
          <UserLayout>
            <Routes>
              <Route index element={<Home />} />
              <Route path="tests" element={<Tests />} />
              <Route path="tests/:id" element={<TestDetail />} />
              {/* <Route path="dotest" element={<DoTest />} /> */}
              <Route path="/dotests/:id" element={<DoTest />} />
              <Route path="result/:attemptID" element={<Result />} />
              <Route path="statistics" element={<Statistic />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </UserLayout>
        } />

        {/* Routes auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes admin */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="questionsmanager" element={<AdminQuestionManager />} />
              <Route path="exammanager" element={<ExamManager />} />
              <Route path="commentmanager" element={<CommentManager />} />
            </Routes>
          </AdminLayout>
        } />

      </Routes>
    </Router>
  );
}

export default App;
