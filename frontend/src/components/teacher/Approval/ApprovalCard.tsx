import React from "react";
export default function ApprovalCard({ title, count=0, actionable=false }:{title:string; count?:number; actionable?:boolean}) {
  return (
    <div className="tc-card">
      <div className="tc-title">{title}</div>
      <div className="tc-count">{count}</div>
      {actionable && (
        <div className="tc-actions">
          <button className="tc-btn">同意</button>
          <button className="tc-btn tc-btn--ghost">拒绝</button>
        </div>
      )}
    </div>
  );
}
