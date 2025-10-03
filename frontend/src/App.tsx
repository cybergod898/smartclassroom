import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import Login from './pages/Login';
import { TeacherRoutes } from './router/teacher';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherLayout />}>
          {TeacherRoutes.map((route, index) => (
            <Route 
              key={route.path || 'index'} 
              index={route.index} 
              path={route.path} 
              element={route.element} 
            />
          ))}
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}