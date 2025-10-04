import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import Home from "../pages/teacher/Home";
import Messages from "../pages/teacher/Messages";
import Schedule from "../pages/teacher/Schedule/index";
import Session from "../pages/teacher/Schedule/Session";
import Prepare from "../pages/teacher/Prepare/index";
import CourseList from "../pages/teacher/Prepare/Course/List";
import CourseNew from "../pages/teacher/Prepare/Course/New";
import CourseDetail from "../pages/teacher/Prepare/Course/Detail";
import SeatLayout from "../pages/teacher/Prepare/Course/SeatLayout";
import AssignmentList from "../pages/teacher/Assignment/List";
import AssignmentNew from "../pages/teacher/Assignment/New";
import AssignmentGrade from "../pages/teacher/Assignment/Grade";
import Grade from "../pages/teacher/Grade/index";
import { teachingRoutes } from './teacher.teaching.routes';

export const TeacherRoutes: RouteObject[] = [
  { path: "dashboard", element: <Navigate to="/teacher/home" replace /> },
  { path: "home", element: <Home /> },
  { path: "messages", element: <Messages /> },
  { path: "schedule", element: <Schedule /> },
  { path: "schedule/session/:id", element: <Session /> },
  ...teachingRoutes,
  {
    path: "prepare",
    element: <Prepare />,
    children: [
      { index: true, element: <Navigate to="/teacher/prepare/courses" replace /> },
      { path: "courses", element: <CourseList /> },
      { path: "course/new", element: <CourseNew /> },
      { path: "course/:id", element: <CourseDetail /> },
      { path: "course/:id/seat", element: <SeatLayout /> }
    ]
  },
  {
    path: "assignments",
    children: [
      { index: true, element: <AssignmentList /> },
      { path: "new", element: <AssignmentNew /> },
      { path: ":id/grade", element: <AssignmentGrade /> }
    ]
  },
  { path: "grade", element: <Grade /> },
  { path: "grades", element: <Navigate to="/teacher/grade" replace /> },
  { index: true, element: <Navigate to="/teacher/home" replace /> }
];
export default TeacherRoutes;
