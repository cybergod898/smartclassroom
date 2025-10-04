import React from "react";
export default function AssignmentNew() {
  return (
    <form className="tc-form">
      <label>作业标题<input placeholder="例如：第2次作业 - 树与二叉堆" /></label>
      <label>截止时间<input type="datetime-local" /></label>
      <label>附件<input type="file" /></label>
      <button className="tc-btn">发布</button>
    </form>
  );
}
