import React from "react";
import { Section } from "../../../components/teacher/Shared/Section";

export default function Session() {
  return (
    <div className="tc-container">
      <Section title="上课会话">
        <div className="tc-flex">
          <button className="tc-btn">开放就坐</button>
          <button className="tc-btn">锁定座位</button>
          <button className="tc-btn">审批请假</button>
          <button className="tc-btn">点名 A/B/C</button>
        </div>
      </Section>
    </div>
  );
}
