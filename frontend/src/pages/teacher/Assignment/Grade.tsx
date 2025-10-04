import React from "react";
export default function AssignmentGrade() {
  return (
    <div>
      <h4>批改作业</h4>
      <div className="tc-card">
        <div>张三 - 已提交</div>
        <label>评分<input type="number" min="0" max="100"/></label>
        <label>评语<textarea /></label>
        <button className="tc-btn">保存</button>
      </div>
    </div>
  );
}
