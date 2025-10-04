import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Section } from "../../../components/teacher/Shared/Section";

export default function Prepare() {
  return (
    <div className="tc-container">
      <Section title="我的备课">
        <nav className="tc-tabs">
          <NavLink to="/teacher/prepare/courses">课程列表</NavLink>
          <NavLink to="/teacher/prepare/course/new">创建课程</NavLink>
        </nav>
        <Outlet />
      </Section>
    </div>
  );
}
