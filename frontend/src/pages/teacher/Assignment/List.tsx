import React from "react";
export default function AssignmentList() {
  return (
    <div>
      <a className="tc-btn" href="/teacher/assignments/new">发布作业</a>
      <div className="tc-list">
        <div className="tc-card">
          <div>第1次作业：链表与栈</div>
          <a className="tc-link" href="/teacher/assignments/101/grade">去批改</a>
        </div>
      </div>
    </div>
  );
}
