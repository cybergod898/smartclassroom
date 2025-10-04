import React from "react";
import { Section } from "../../components/teacher/Shared/Section";
import ApprovalCard from "../../components/teacher/Approval/ApprovalCard";
import "../../styles/teacher/index.css";

export default function Home() {
  return (
    <div className="tc-container">
      <Section title="待办事项">
        <div className="tc-grid">
          <ApprovalCard title="请假审批" count={2} />
          <ApprovalCard title="解绑审批" count={1} />
          <ApprovalCard title="换座审批" count={3} />
          <ApprovalCard title="待批改作业" count={5} />
        </div>
      </Section>
      <Section title="快速入口">
        <div className="tc-quick">
          <a href="/teacher/schedule" className="tc-btn">去上课</a>
          <a href="/teacher/prepare/courses" className="tc-btn">课程管理</a>
          <a href="/teacher/assignments" className="tc-btn">作业管理</a>
          <a href="/teacher/grade" className="tc-btn">成绩</a>
        </div>
      </Section>
    </div>
  );
}
