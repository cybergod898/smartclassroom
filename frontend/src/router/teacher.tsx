import { Navigate } from "react-router-dom";
import Dashboard from "../pages/teacher/Dashboard";
import Messages from "../pages/teacher/Messages";
import Schedule from "../pages/teacher/Schedule";
import Courses from "../pages/teacher/Courses";
import Assignments from "../pages/teacher/Assignments";
import Grades from "../pages/teacher/Grades";

export const TeacherRoutes = [
  { index: true, element: <Navigate to="/teacher/dashboard" replace /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "messages", element: <Messages /> },
  { path: "schedule", element: <Schedule /> },
  { path: "courses", element: <Courses /> },
  { path: "assignments", element: <Assignments /> },
  { path: "grades", element: <Grades /> },
];
