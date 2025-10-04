import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import Login from './pages/Login';
import { TeacherRoutes } from './router/teacher';

function renderRoutes(routes: any[]) {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={route.path || index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route 
        key={route.path || index} 
        index={route.index} 
        path={route.path} 
        element={route.element} 
      />
    );
  });
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherLayout />}>
          {renderRoutes(TeacherRoutes)}
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}