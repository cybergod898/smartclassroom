import React from "react";
export default function CourseNew() {
  return (
    <form className="tc-form">
      <label>课程名<input placeholder="例如：数据结构" /></label>
      <label>授课班级<input placeholder="例如：计科2201" /></label>
      <button className="tc-btn">创建</button>
    </form>
  );
}
