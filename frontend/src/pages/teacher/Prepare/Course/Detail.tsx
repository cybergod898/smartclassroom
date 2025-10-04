import React from "react";
import { NavLink } from "react-router-dom";

export default function CourseDetail() {
  return (
    <div>
      <h3>课程详情：数据结构</h3>
      <nav className="tc-subtabs">
        <NavLink to="/teacher/prepare/course/1">资料</NavLink>
        <NavLink to="/teacher/prepare/course/1?tab=students">名册</NavLink>
        <NavLink to="/teacher/prepare/course/1/seat">座位</NavLink>
      </nav>
      <div className="tc-muted">这里是课程资料 / 名册 / 座位的容器。</div>
    </div>
  );
}
