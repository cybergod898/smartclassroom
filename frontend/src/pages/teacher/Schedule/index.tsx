import React from "react";
import { useNavigate } from "react-router-dom";
import { Section } from "../../../components/teacher/Shared/Section";

export default function Schedule() {
  const nav = useNavigate();
  return (
    <div className="tc-container">
      <Section title="我的课表">
        <div className="tc-card">
          <div>《数据结构》周三第3-4节（A202）</div>
          <button className="tc-btn" onClick={()=>nav('/teacher/schedule/session/1001')}>开始上课</button>
        </div>
      </Section>
    </div>
  );
}
