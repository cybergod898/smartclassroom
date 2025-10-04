import React from "react";
export default function CourseList() {
  return (
    <div className="tc-table">
      <div className="tc-row tc-row--head">
        <div>课程名</div><div>班级</div><div>操作</div>
      </div>
      <div className="tc-row">
        <div>数据结构</div><div>计科2201</div>
        <div><a href="/teacher/prepare/course/1">详情</a></div>
      </div>
    </div>
  );
}
