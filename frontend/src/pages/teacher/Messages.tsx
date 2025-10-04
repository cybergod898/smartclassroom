import React from "react";
import ApprovalCard from "../../components/teacher/Approval/ApprovalCard";
import { Section } from "../../components/teacher/Shared/Section";

export default function Messages() {
  return (
    <div className="tc-container">
      <Section title="我的消息">
        <div className="tc-list">
          <ApprovalCard title="请假申请：张三" count={1} actionable />
          <ApprovalCard title="解绑申请：李四" count={1} actionable />
          <ApprovalCard title="换座申请：王五" count={1} actionable />
        </div>
      </Section>
    </div>
  );
}
